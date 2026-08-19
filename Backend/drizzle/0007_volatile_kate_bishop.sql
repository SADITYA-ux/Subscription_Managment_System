ALTER TABLE "payment" ALTER COLUMN "payment_date" SET DATA TYPE timestamp;--> statement-breakpoint
ALTER TABLE "payment" ALTER COLUMN "payment_date" SET DEFAULT now();