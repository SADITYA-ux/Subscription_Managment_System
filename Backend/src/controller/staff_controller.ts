import type { Request, Response } from "express";
import bcrypt from "bcrypt";
import { fromPromise } from "neverthrow";
import { db } from "../db/index.js";
import { users, staff } from "../db/schema.js";
import { eq } from "drizzle-orm";
import { StatusCode } from "../Constraints/status-codes.js";

export const createStaff = async (req: Request, res: Response) => {
    const { email, password, name, age, address, phone } = req.body;
    const password_hash = await bcrypt.hash(password, 10);

    const existing = await fromPromise(
        db.select().from(users).where(eq(users.email, email)).limit(1),
        () => new Error("Database Error")
    );

    if (existing.isErr()) {
        return res
            .status(StatusCode.INTERNAL_SERVER_ERROR)
            .json({ message: existing.error.message });
    }

    const [user] = existing.value;

    if (user) {
        return res
            .status(StatusCode.CONFLICT)
            .json({ message: "Email already exists" });
    }

    const transactionResult = await fromPromise(
        db.transaction(async (tx) => {
            const [newUser] = await tx
                .insert(users)
                .values({ email, password_hash, role: "Staff" })
                .returning({ id: users.id });

            if (!newUser) {
                throw new Error("Failed to create user");
            }

            const [newStaff] = await tx
                .insert(staff)
                .values({ userid: newUser.id, name, age, address, phone })
                .returning();

            if (!newStaff) {
                throw new Error("Failed to create staff");
            }

            return { user: newUser, staff: newStaff };
        }),
        () => new Error("Database Error")
    );

    if (transactionResult.isErr()) {
        return res
            .status(StatusCode.INTERNAL_SERVER_ERROR)
            .json({ message: transactionResult.error.message });
    }

    return res
        .status(StatusCode.CREATED)
        .json({ message: "Staff created successfully", data: transactionResult.value });
};

export const getAllStaff = async (req: Request, res: Response) => {
    const data = await fromPromise(
        db.select().from(staff).where(eq(staff.isActive, true)),
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
            .json({ message: "No staff found" });
    }

    return res
        .status(StatusCode.OK)
        .json({ message: "Staff found", data: data.value });
};

export const getStaffById = async (req: Request, res: Response) => {
    const id = Number(req.params.id);

    if (Number.isNaN(id)) {
        return res
            .status(StatusCode.BAD_REQUEST)
            .json({ message: "Invalid id" });
    }

    const data = await fromPromise(
        db.select().from(staff).where(eq(staff.id, id)),
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
            .json({ message: "No staff found" });
    }

    return res
        .status(StatusCode.OK)
        .json({ message: "Staff found", data: data.value[0] });
};

export const deactivateStaff = async (req: Request, res: Response) => {
    const id = Number(req.params.id);

    if (Number.isNaN(id)) {
        return res
            .status(StatusCode.BAD_REQUEST)
            .json({ message: "Invalid id" });
    }

    const data = await fromPromise(
        db.update(staff).set({ isActive: false }).where(eq(staff.id, id)).returning(),
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
            .json({ message: "No staff found" });
    }

    return res
        .status(StatusCode.OK)
        .json({ message: "Staff deactivated successfully", data: data.value[0] });
};