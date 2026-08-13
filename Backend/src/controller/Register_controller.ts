import type { Request , Response } from "express"
import bcrypt from "bcrypt";
import { fromPromise } from "neverthrow";
import { db } from "../db/index.js";
import { client, users } from "../db/schema.js";
import { eq } from "drizzle-orm";
import { StatusCode } from "../Constraints/status-codes.js";

export const createUser = async ( req : Request , res : Response ) =>
{
    const { email , password , name , address , number , age } = req.body;
    const passwordHash = await bcrypt.hash(password , 10);

    const result = await fromPromise(
        db
        .select({ id : users.id})
        .from(users)
        .where(eq (users.email , email))
        .limit(1),
        () => new Error("Database Error")
    );

    if(result.isErr())
    {
        return res
            .status(StatusCode.INTERNAL_SERVER_ERROR)
            .json({ message : result.error.message })
    };

    const existingUser =  result.value;

    if(existingUser.length > 0)
    {
        return res
            .status(StatusCode.CONFLICT)
            .json({ message : "User already exists"})
    };

    const transactionResult = await fromPromise
    (
        db.transaction(async (tx) => 
        {
            const [newUser] = await tx
                .insert(users)
                .values({
                    email,
                    password_hash: passwordHash,
                    role: "Client"
                })
                .returning({ id: users.id });

            if(!newUser)
            {
                throw new Error("User Creation failed"); 
            }

            const [newClient] = await tx
                .insert(client)
                .values({
                userid: newUser.id,
                name,
                address,
                number,
                age})
                .returning();

                if(!newClient)
                {
                    throw new Error("Client Creation Failed");
                }

                return {
                    user : newUser,
                    client : newClient
                };
        }),
        () => new Error("Databae Error")
    )

    if(transactionResult.isErr())
    {
        return res
            .status(StatusCode.INTERNAL_SERVER_ERROR)
            .json({ message : transactionResult.error.message });
    }

    return res
        .status(StatusCode.CREATED)
        .json({ message : "User Registred Successfully" , data : transactionResult.value });
}