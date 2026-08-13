import type { Request , Response } from "express";
import { Err, fromPromise } from "neverthrow";
import { db } from "../db/index.js";
import { plan } from "../db/schema.js";
import { StatusCode } from "../Constraints/status-codes.js";
import { stat } from "node:fs";
import { eq } from "drizzle-orm";
import { from } from "node:stream/iter";


export const getPlan = async( req : Request , res : Response ) =>
{
    const data = await fromPromise
    (
        db
        .select()
        .from(plan),
        () => new Error("Database Error")
    )    

    if(data.isErr())
    {
        return res
            .status(StatusCode.INTERNAL_SERVER_ERROR)
            .json({ message : data.error.message })
    };

    return res
        .status(StatusCode.OK)
        .json({ message : "Got all Plans" , data : data.value })
};

export const getPlanById = async ( req : Request , res : Response ) =>
{
    const id = Number(req.params.id);

    const data = await fromPromise
    (
        db
        .select()
        .from(plan)
        .where(eq (plan.id , id)),
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
            .json({ message : "Plan Not FOund at all"})
    };

    const foundPlan = data.value[0];

    return res
        .status(StatusCode.OK)
        .json({ message : "Plan FOund " , data : foundPlan})
};

export const createPlan = async (req : Request , res : Response ) =>
{
    const { pname , duration , price} = req.body;

    const data = await fromPromise
    (
        db
            .insert(plan)
            .values({ pname , duration , price})
            .returning(),
            () => new Error("Database Error")
    )

    if(data.isErr())
    {
        return res
            .status(StatusCode.INTERNAL_SERVER_ERROR)
            .json({ message : data.error.message })
    };

    return res    
        .status(StatusCode.CREATED)
        .json({ message : "Successfully Plan created" , data : data.value })
};

export const deletePlan = async ( req : Request , res : Response ) =>
{
    const id = Number(req.params.id)

    if(Number.isNaN(id))
    {
        return res
        .status(StatusCode.NOT_FOUND)
        .json({ message : "Invalid Id"})
    };

    const data = await fromPromise
    (
        db  
            .delete(plan)
            .where(eq (plan.id , id))
            .returning(),
            () => new Error("Database Error")
    )

    if(data.isErr())
    {
        return res
            .status(StatusCode.INTERNAL_SERVER_ERROR)
            .json({ message : data.error.message })
    };

    return res
        .status(StatusCode.OK)
        .json({message : " Successfully deleted Plan"})
}

