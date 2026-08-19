import type { Request , Response } from "express-serve-static-core";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";  
import { fromPromise } from "neverthrow";
import { db } from "../db/index.js";
import { users } from "../db/schema.js";
import { eq } from "drizzle-orm";
import { StatusCode } from "../Constraints/status-codes.js";
import "dotenv/config";
import e from "express";

export const userLogin = async ( req : Request , res : Response) =>
{
    const { password , email , } = req.body;
    
    const data = await fromPromise
    (
        db
        .select()
        .from(users)
        .where(eq ( users.email , email))
        .limit(1),
        () => new Error("Database Error")
    );

    if(data.isErr())
    {
        return res
            .status(StatusCode.INTERNAL_SERVER_ERROR)
            .json({ message : data.error.message })
    };

    const [value] = data.value;
    if(!value)
    {
        return res  
            .status(StatusCode.UNAUTHORIZED)
            .json({ message : " Wrong email or password"})
    }
    
    const isMatch = await bcrypt.compare
    (
        password , value.password_hash
    )

    if(!isMatch)
    {
        return res 
            .status(StatusCode.UNAUTHORIZED)
            .json({ message : "Password not matched" })
    };

    
console.log("SECRET AT VERIFY:", process.env.JWT_SECRET);
    const token = jwt.sign(
        {
            id : value.id,
            email : value.email,
            role : value.role
        },
        process.env.JWT_SECRET!,
        {
            expiresIn : "1h",
        }
        
    );
    

    return res 
    .status(StatusCode.OK)
    .json({ token , user : { id : value.id , email : value.email , role : value.role} })
}