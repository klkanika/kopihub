CREATE TABLE public.auth (
	id serial NOT NULL,
	"token" varchar NULL,
	cookie varchar NULL,
	last_update timestamptz(0) NULL
);