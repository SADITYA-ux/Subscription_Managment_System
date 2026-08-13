CREATE TABLE "payment" (
	"id" serial PRIMARY KEY NOT NULL,
	"sub_id" integer NOT NULL,
	"price" numeric(10, 5) NOT NULL,
	"payment_date" varchar(100) NOT NULL,
	"portal" varchar NOT NULL,
	"account_no" varchar(150) NOT NULL
);
--> statement-breakpoint
ALTER TABLE "payment" ADD CONSTRAINT "payment_sub_id_subscription_id_fk" FOREIGN KEY ("sub_id") REFERENCES "public"."subscription"("id") ON DELETE no action ON UPDATE no action;