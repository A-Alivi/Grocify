CREATE TABLE "grocery_items" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"category" text NOT NULL,
	"quantity" integer NOT NULL,
	"is_purchased" boolean DEFAULT false NOT NULL,
	"priority" text DEFAULT 'default' NOT NULL,
	"created_at" bigint NOT NULL,
	"updated_at" bigint NOT NULL
);
