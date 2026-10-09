CREATE TABLE `feedback` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`rating` integer NOT NULL,
	`message` text,
	`page` text NOT NULL,
	`created_at` text NOT NULL
);
