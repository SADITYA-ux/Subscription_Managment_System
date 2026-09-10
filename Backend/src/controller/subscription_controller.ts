import type { Request , Response } from "express";
import { Err, fromPromise } from "neverthrow";
import { db } from "../db/index.js";
import { client, plan, subscription } from "../db/schema.js";
import { StatusCode } from "../Constraints/status-codes.js";
import { eq } from "drizzle-orm";
import { format } from "path";

function computeStatus( sub : typeof subscription.$inferSelect)
{
    const now = new Date();
    const end = new Date(sub.endDate);

    if(sub.status !== "Rejected" && end < now)
    {
        return { ...sub , status : "Expired" as const }
    }
    
    return sub
}

export const createSubs = async ( req : Request , res : Response ) =>
{
    const { clientid , planid , startDate} = req.body;

    const planResult = await fromPromise
    (
        db
            .select()
            .from(plan)
            .where(eq (plan.id , planid)),
            () => new Error("database Error")
    );

    if(planResult.isErr())
    {
        return res 
            .status(StatusCode.INTERNAL_SERVER_ERROR)
            .json({ message : planResult.error.message })
    };

    const [foundPlan] = planResult.value;

    if(!foundPlan)
    {
        return res  
            .status(StatusCode.NOT_FOUND)
            .json({ message : "No plan found" })
    }

    const start = new Date(startDate);
    const end = new Date(start);
    end.setDate(end.getDate() + foundPlan.duration) 

    

    const data = await fromPromise
    (
        db
            .insert(subscription)
            .values({
                clientid,
                planid,
                startDate : start,
                endDate : end,
                status : "Active"
            })
            .returning(),
            () => new Error("Database Error")
    );

    if(data.isErr())
    {
        return res
            .status(StatusCode.INTERNAL_SERVER_ERROR)
            .json({ message : data.error.message })
    };

    return res
        .status(StatusCode.CREATED)
        .json({ message : "Subscription successfully created" , data : data.value })
}

export const getAllSubs = async( req : Request , res : Response ) =>
{
    const data = await fromPromise
    (
        db
        .select()
        .from(subscription)
        .where(eq(subscription.isActive, true)),
        () => new Error("Database Error")
    );

    if(data.isErr())
    {
        return res
            .status(StatusCode.INTERNAL_SERVER_ERROR)
            .json({ message : data.error.message })
    }

    return res  
        .status(StatusCode.OK)
        .json({ message : "All Subscription Found " , data : data.value.map(computeStatus)})
};

export const getSubsById = async ( req : Request , res : Response ) =>
{
    const id = Number(req.params.id);

    if(Number.isNaN(id))
    {
        return res  
            .status(StatusCode.BAD_REQUEST)
            .json({ message : "Invallid id"})
    };

    const data = await fromPromise
    (
        db
            .select()
            .from(subscription)
            .where(eq (subscription.id , id)),
            () => new Error("Database Error")
    )

    if(data.isErr())
    {
        return res
            .status(StatusCode.INTERNAL_SERVER_ERROR)
            .json({ message : data.error.message })
    };

    if(data.value.length === 0)
    {
        return res
            .status(StatusCode.NOT_FOUND)
            .json({ message : "No Subscription found"})
    };

    const [found] = data.value;

    if(!found)
    {
        return res
            .status(StatusCode.NOT_FOUND)
            .json({ message : "Not FOund"})
    }


    return res
        .status(StatusCode.OK)
        .json({ message : "Found" , data : computeStatus(found) })
};

export const updateSubs = async ( req : Request , res : Response ) =>
{
    const id = Number(req.params.id);
    const { planid , endDate} = req.body;

    const newPlan = await fromPromise
    (
        db
            .select()
            .from(plan)
            .where(eq (plan.id , planid)),
            () => new Error ("Database Error")
    )

    if(newPlan.isErr())
    {
        return res
            .status(StatusCode.BAD_REQUEST)
            .json({ message : newPlan.error.message })
    };

    const [newP] = newPlan.value;

    if(!newP)
    {
        return res
        .status(StatusCode.NOT_FOUND)
        .json({ message : "No Plan Found"})
    };

    const start = await fromPromise
    (
        db
        .select({startDate : subscription.startDate})
        .from(subscription)
        .where(eq ( subscription.id , id))
        .limit(1),
        () => new Error("Database Error")
    );

    if(start.isErr())
    {
        return res
            .status(StatusCode.INTERNAL_SERVER_ERROR)
            .json({ message : start.error.message })
    }

    const [existing] = start.value;

    if(!existing)
    {
        return res  
            .status(StatusCode.NOT_FOUND)
            .json({message : "No Subscription Found"})
    };

    const newEndDate = new Date(existing.startDate)
    newEndDate.setDate(newEndDate.getDate() +  newP.duration);

    const data = await fromPromise
    (
        db
            .update(subscription)
            .set({ planid , endDate : newEndDate })
            .where(eq ( subscription.id , id))
            .returning(),
            () => new Error("Database Error")
    );

    if(data.isErr())
    {
        return res
            .status(StatusCode.INTERNAL_SERVER_ERROR)
            .json({ message : data.error.message})
    };

    return res  
        .status(StatusCode.OK)
        .json({ message : "Subscription Updated successfully" , data : data.value[0] })
}

export const getSubsByClient = async (req: Request, res: Response) => {
    const id = Number(req.params.id);

    if (Number.isNaN(id)) {
        return res
            .status(StatusCode.BAD_REQUEST)
            .json({ message: "Invalid client id" });
    }

    const data = await fromPromise(
        db.select().from(subscription).where(eq(subscription.clientid, id)),
        () => new Error("Database Error")
    );

    if (data.isErr()) {
        return res
            .status(StatusCode.INTERNAL_SERVER_ERROR)
            .json({ message: data.error.message });
    }

    if (data.value.length === 0) {
        return res
            .status(StatusCode.NOT_FOUND)
            .json({ message: "No subscriptions found for this client" });
    }

    return res
        .status(StatusCode.OK)
        .json({ message: "Subscriptions found", data: data.value.map(computeStatus) });
};

export const deleteSubs = async (req: Request, res: Response) => {
    const id = Number(req.params.id);

    if (Number.isNaN(id)) {
        return res
            .status(StatusCode.BAD_REQUEST)
            .json({ message: "Invalid id" });
    }

    const data = await fromPromise(
        db.update(subscription).set({ isActive: false }).where(eq(subscription.id, id)).returning(),
        () => new Error("Database Error")
    );

    if (data.isErr()) {
        return res
            .status(StatusCode.INTERNAL_SERVER_ERROR)
            .json({ message: data.error.message });
    }

    if (data.value.length === 0) {
        return res
            .status(StatusCode.NOT_FOUND)
            .json({ message: "No subscription found" });
    }

    return res
        .status(StatusCode.OK)
        .json({ message: "Subscription deleted successfully", data: data.value[0] });
};

export const editSubs = async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const { startDate, endDate, status } = req.body;

    if (Number.isNaN(id)) {
        return res
            .status(StatusCode.BAD_REQUEST)
            .json({ message: "Invalid id" });
    }

    const data = await fromPromise(
        db.update(subscription)
            .set({ startDate, endDate, status })
            .where(eq(subscription.id, id))
            .returning(),
        () => new Error("Database Error")
    );

    if (data.isErr()) {
        return res
            .status(StatusCode.INTERNAL_SERVER_ERROR)
            .json({ message: data.error.message });
    }

    if (data.value.length === 0) {
        return res
            .status(StatusCode.NOT_FOUND)
            .json({ message: "No subscription found" });
    }

    return res
        .status(StatusCode.OK)
        .json({ message: "Subscription edited successfully", data: data.value[0] });
};

export const inactiveSubs = async (req : Request , res : Response) =>
{
    const data = await fromPromise
    (
        db
            .select()
            .from(subscription)
            .where(eq(subscription.isActive , false)),
            () => new Error("Database Error")
    )

    if(data.isErr())
        {
            return res
                .status(StatusCode.INTERNAL_SERVER_ERROR)
                .json({ message : data.error.message })
        }
        
    return res
        .status(StatusCode.OK)
        .json({message : "Found inactive subscription" , data : data.value })
}

export const restoreSubs = async (req : Request , res : Response) =>
{
    const id = Number(req.params.id);

    if(Number.isNaN(id))
    {
        return res
            .status(StatusCode.BAD_REQUEST)
            .json({message : "no id found "})
    }

    const data = await fromPromise
    (
        db
        .update(subscription)
        .set({isActive : true})
        .where(eq(subscription.id , id)),
        () => new Error("Database Error")
    )

    if(data.isErr())
    {
        return res
            .status(StatusCode.INTERNAL_SERVER_ERROR)
            .json({ message : data.error.message})
    };

    return res
        .status(StatusCode.OK)
        .json({ message : "succesfully activated the sub"})
}

export const extendSubs = async (req: Request, res: Response) => {
    const id = Number(req.params.id);

    if (Number.isNaN(id)) {
        return res
            .status(StatusCode.BAD_REQUEST)
            .json({ message: "Invalid id" });
    }

    const subResult = await fromPromise(
        db.select().from(subscription).where(eq(subscription.id, id)).limit(1),
        () => new Error("Database Error")
    );

    if (subResult.isErr()) {
        return res
            .status(StatusCode.INTERNAL_SERVER_ERROR)
            .json({ message: subResult.error.message });
    }

    const [existingSub] = subResult.value;

    if (!existingSub) {
        return res
            .status(StatusCode.NOT_FOUND)
            .json({ message: "Subscription not found" });
    }

    const planResult = await fromPromise(
        db.select().from(plan).where(eq(plan.id, existingSub.planid)).limit(1),
        () => new Error("Database Error")
    );

    if (planResult.isErr()) {
        return res
            .status(StatusCode.INTERNAL_SERVER_ERROR)
            .json({ message: planResult.error.message });
    }

    const [foundPlan] = planResult.value;

    if (!foundPlan) {
        return res
            .status(StatusCode.NOT_FOUND)
            .json({ message: "Plan not found" });
    }

    const newEndDate = new Date(existingSub.endDate);
    newEndDate.setDate(newEndDate.getDate() + foundPlan.duration);

    const data = await fromPromise(
        db.update(subscription)
            .set({ endDate: newEndDate, status: "Active" })
            .where(eq(subscription.id, id))
            .returning(),
        () => new Error("Database Error")
    );

    if (data.isErr()) {
        return res
            .status(StatusCode.INTERNAL_SERVER_ERROR)
            .json({ message: data.error.message });
    }

    return res
        .status(StatusCode.OK)
        .json({ message: "Subscription extended successfully", data: data.value[0] });
};

export const getMySubs = async (req: Request, res: Response) => {
    const userId = (req as any).user.id;

    const clientResult = await fromPromise(
        db.select().from(client).where(eq(client.userid, userId)).limit(1),
        () => new Error("Database Error")
    );

    if (clientResult.isErr()) {
        return res.status(StatusCode.INTERNAL_SERVER_ERROR).json({ message: clientResult.error.message });
    }

    const [foundClient] = clientResult.value;

    if (!foundClient) {
        return res.status(StatusCode.NOT_FOUND).json({ message: "Client profile not found" });
    }

    const data = await fromPromise(
        db.select().from(subscription).where(eq(subscription.clientid, foundClient.id)),
        () => new Error("Database Error")
    );

    if (data.isErr()) {
        return res.status(StatusCode.INTERNAL_SERVER_ERROR).json({ message: data.error.message });
    }

    return res.status(StatusCode.OK).json({ message: "Your subscriptions", data: data.value.map(computeStatus) });
};