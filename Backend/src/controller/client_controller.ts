import type { Request , Response } from "express"
import { fromPromise } from "neverthrow"
import { db } from "../db/index.js"
import { client } from "../db/schema.js"
import { StatusCode } from "../Constraints/status-codes.js"
import { eq } from "drizzle-orm"
import { measureMemory } from "vm"
import { Client } from "pg"

export const getAllClients = async ( req : Request , res : Response ) =>
{
    const data = await fromPromise
    (
        db
        .select()
        .from(client),
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
        .json({ data : data.value })
};

export const getClientsById = async( req : Request , res : Response) =>
{
    const id = Number(req.params.id);

    if(Number.isNaN(id))
    {
        return res
        .status(StatusCode.BAD_REQUEST)
        .json({ message : "Invalid Id " })
    };

    const data = await fromPromise
    (
        db
          .select()
          .from(client)
          .where(eq (client.id , id)),
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
        .json({ message : "Successfully found client" , data : data.value[0] })
}

export const deleteClient = async( req : Request , res : Response) =>
{
    const id = Number(req.params.id);

    if(Number.isNaN(id))
    {
        return res
            .status(StatusCode.BAD_REQUEST)
            .json({ message : "Invalid Id" })
    }

    const data = await fromPromise
    (
        db  
            .update(client)
            .set({ isActive : false})
            .where(eq (client.id , id))
            .returning(),
            () => new Error("Database error")
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
            .json({ message : "No Clients found" })
    };

    return res
        .status(StatusCode.OK)
        .json({ message : "Client deleted successfully" , data : data.value[0]})
};

export const updateClient = async( req : Request , res : Response) =>
{
    const id = Number(req.params.id);
    const {name , address , number , age} = req.body;

    if(Number.isNaN(id))
    {
        return res
            .status(StatusCode.BAD_REQUEST)
            .json({ message : "Invalid Id" })
    };

    const data = await fromPromise
    (
        db
            .update(client)
            .set({ name , address , age , number})
            .where(eq (client.id , id))
            .returning(),
            () => new Error(" Database Error")
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
            .json({ message : "No Client Found" })
    };

    return res
        .status(StatusCode.OK)
        .json({ message : "Client Updated Successfully" , data : data.value[0] })
}