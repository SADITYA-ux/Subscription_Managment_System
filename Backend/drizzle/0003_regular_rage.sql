ALTER TABLE "subscription" DROP CONSTRAINT "subscription_client_id_unique";--> statement-breakpoint
ALTER TABLE "subscription" DROP CONSTRAINT "subscription_plan_id_unique";--> statement-breakpoint
ALTER TABLE "subscription" DROP COLUMN "start_Date";