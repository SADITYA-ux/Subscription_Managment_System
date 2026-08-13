CREATE TYPE "public"."role" AS ENUM('Admin', 'Client', 'Staff');--> statement-breakpoint
CREATE TYPE "public"."status" AS ENUM('Active', 'Pending', 'Rejected');--> statement-breakpoint
CREATE TABLE "client" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer,
	"name" varchar(100) NOT NULL,
	"address" varchar(150) NOT NULL,
	"number" varchar(20) NOT NULL,
	"age" integer NOT NULL,
	CONSTRAINT "client_user_id_unique" UNIQUE("user_id")
);
--> statement-breakpoint
CREATE TABLE "plan" (
	"id" serial PRIMARY KEY NOT NULL,
	"pname" varchar(250) NOT NULL,
	"duration_days" integer NOT NULL,
	"price" numeric(10, 5) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "staff" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer,
	"name" varchar(120) NOT NULL,
	"address" varchar(100) NOT NULL,
	"phone" varchar(100) NOT NULL,
	"age" integer NOT NULL,
	CONSTRAINT "staff_user_id_unique" UNIQUE("user_id")
);
--> statement-breakpoint
CREATE TABLE "subscription" (
	"id" serial PRIMARY KEY NOT NULL,
	"client_id" integer NOT NULL,
	"plan_id" integer NOT NULL,
	"start_Date" timestamp NOT NULL,
	"end_Date" timestamp NOT NULL,
	"status" "status" NOT NULL,
	CONSTRAINT "subscription_client_id_unique" UNIQUE("client_id"),
	CONSTRAINT "subscription_plan_id_unique" UNIQUE("plan_id")
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"email" varchar(255) NOT NULL,
	"password_hash" text NOT NULL,
	"role" "role" NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "client" ADD CONSTRAINT "client_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "staff" ADD CONSTRAINT "staff_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "subscription" ADD CONSTRAINT "subscription_client_id_client_id_fk" FOREIGN KEY ("client_id") REFERENCES "public"."client"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "subscription" ADD CONSTRAINT "subscription_plan_id_plan_id_fk" FOREIGN KEY ("plan_id") REFERENCES "public"."plan"("id") ON DELETE no action ON UPDATE no action;