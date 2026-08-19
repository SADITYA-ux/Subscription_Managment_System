import type { Request, Response } from "express";
import { fromPromise } from "neverthrow";
import { db } from "../db/index.js";
import { payment, subscription } from "../db/schema.js";
import { eq } from "drizzle-orm";
import { StatusCode } from "../Constraints/status-codes.js";

export const createPayment = async (req: Request, res: Response) => {
    const { subid, amount, portal, accountno, status } = req.body;

    const subResult = await fromPromise(
        db.select().from(subscription).where(eq(subscription.id, subid)).limit(1),
        () => new Error("Database Error")
    );

    if (subResult.isErr()) {
        return res
            .status(StatusCode.INTERNAL_SERVER_ERROR)
            .json({ message: subResult.error.message });
    }

    const [foundSub] = subResult.value;

    if (!foundSub) {
        return res
            .status(StatusCode.NOT_FOUND)
            .json({ message: "Subscription not found" });
    }

    const data = await fromPromise(
        db.insert(payment)
            .values({
                subid,
                amount,
                portal,
                accountno,
                status: status ?? "Paid"
            })
            .returning(),
        () => new Error("Database Error")
    );

    if (data.isErr()) {
        return res
            .status(StatusCode.INTERNAL_SERVER_ERROR)
            .json({ message: data.error.message });
    }

    return res
        .status(StatusCode.CREATED)
        .json({ message: "Payment recorded successfully", data: data.value[0] });
};

export const getAllPayments = async (req: Request, res: Response) => {
    const data = await fromPromise(
        db.select().from(payment),
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
            .json({ message: "No payments found" });
    }

    return res
        .status(StatusCode.OK)
        .json({ message: "Payments found", data: data.value });
};

export const getPaymentById = async (req: Request, res: Response) => {
    const id = Number(req.params.id);

    if (Number.isNaN(id)) {
        return res
            .status(StatusCode.BAD_REQUEST)
            .json({ message: "Invalid id" });
    }

    const data = await fromPromise(
        db.select().from(payment).where(eq(payment.id, id)),
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
            .json({ message: "No payment found" });
    }

    return res
        .status(StatusCode.OK)
        .json({ message: "Payment found", data: data.value[0] });
};

export const getPaymentsBySubscription = async (req: Request, res: Response) => {
    const subid = Number(req.params.subId);

    if (Number.isNaN(subid)) {
        return res
            .status(StatusCode.BAD_REQUEST)
            .json({ message: "Invalid subscription id" });
    }

    const data = await fromPromise(
        db.select().from(payment).where(eq(payment.subid, subid)),
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
            .json({ message: "No payments found for this subscription" });
    }

    return res
        .status(StatusCode.OK)
        .json({ message: "Payments found", data: data.value });
};

export const updatePayment = async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const { status, amount, portal, accountno } = req.body;

    if (Number.isNaN(id)) {
        return res
            .status(StatusCode.BAD_REQUEST)
            .json({ message: "Invalid id" });
    }

    const data = await fromPromise(
        db.update(payment)
            .set({ status, amount, portal, accountno })
            .where(eq(payment.id, id))
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
            .json({ message: "No payment found" });
    }

    return res
        .status(StatusCode.OK)
        .json({ message: "Payment updated successfully", data: data.value[0] });
};