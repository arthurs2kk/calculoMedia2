import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const feedback = sqliteTable("feedback", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  rating: integer("rating").notNull(),
  message: text("message"),
  page: text("page").notNull(),
  createdAt: text("created_at").notNull(),
});
