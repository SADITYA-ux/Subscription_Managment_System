import {pgTable , serial , varchar , pgEnum ,text , integer ,  decimal , timestamp} from "drizzle-orm/pg-core";

export const Role = pgEnum("role",["Admin" , "Client" , "Staff"]);
export const subStatus = pgEnum("status",["Active" , "Pending" , "Rejected"]);

export const users = pgTable("users",{
    id :  serial("id").primaryKey(),
    email : varchar("email", {length : 255}).notNull().unique(),
    password_hash : text("password_hash").notNull(),
    role : Role("role").notNull()
});

export const client = pgTable("client", {
    id : serial("id").primaryKey(),
    userid : integer("user_id").references(() => users.id).unique().notNull(),
    name : varchar("name" , {length : 100}).notNull(),
    address : varchar("address", {length : 150}).notNull(),
    number : varchar("number" , {length : 20}).notNull(),
    age : integer("age").notNull()
});

export const staff = pgTable("staff", {
    id : serial("id").primaryKey(),
    userid : integer("user_id").references( () => users.id).unique().notNull(),
    name : varchar("name", {length : 120}).notNull(),
    address : varchar("address" , {length : 100}).notNull(),
    phone : varchar("phone", {length : 100}).notNull(),
    age : integer("age").notNull()
});

export const plan = pgTable("plan" , {
    id : serial("id").primaryKey(),
    pname : varchar("pname" , {length : 250}).notNull(),
    duration : integer("duration_days").notNull(),
    price : decimal("price" , {precision: 10 , scale : 5}).notNull()
});

export const subscription = pgTable("subscription", {
    id : serial("id").primaryKey(),
    clientid : integer("client_id").references(() => client.id).notNull().notNull(),
    planid : integer("plan_id").references( () => plan.id).notNull(),
    endDate : timestamp("end_Date").notNull(),
    status : subStatus("status").notNull()
});

export const payment = pgTable("payment" , {
    id : serial("id").primaryKey(),
    subid : integer("sub_id").references(() => subscription.id).notNull().notNull(),
    amount : decimal("price" , {precision: 10 , scale : 5}).notNull(),
    paymentdate : varchar("payment_date" , {length : 100}).notNull(),
    portal : varchar("portal").notNull(),
    accountno : varchar("account_no" , {length : 150}).notNull()
});
