import type { Request , Response } from "express";
import bcrypt from "bcrypt";
import { db } from "../db/index.js";
import { users , staff } from "../db/schema.js";
import {eq} from "drizzle-orm";

export const createStaff = async (req : Request , res : Response) =>
{
    const {email , password , name , age , address , phone} = req.body;
        const password_hash = await bcrypt.hash(password , 10);

    try
    {
        const [user] = await db
            .select()
            .from(users)
            .where(eq(users.email , email))
            .limit(1)

        if(user)
        {
            return res.status(409).json({
                message : "Email already exists"
            });
        }

        await db.transaction(async (tx) => {

            const [newUser] = await tx
            .insert(users)
            .values(
                {
                    email,
                    password_hash,
                    role : "Staff"
                })
            .returning({ id : users.id});

            if(!newUser)
            {
                throw new Error("Failed to create user");
            }

            await tx.insert(staff).values({
                userid : newUser.id,
                name,
                age,
                address,
                phone
            });

            res.status(201).json({
                message : "Staff Created Successfully"
            })
        });
    }catch(error)
    {
        return res.status(500).json({
            message : "Server Error"
        });
    }
}


