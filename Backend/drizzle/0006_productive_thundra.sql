CREATE TYPE "public"."payment_status" AS ENUM('Paid', 'Pending', 'Overdue');--> statement-breakpoint
ALTER TABLE "payment" ADD COLUMN "status" "payment_status" DEFAULT 'Paid' NOT NULL;