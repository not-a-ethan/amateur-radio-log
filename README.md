# Ham Radio Log

This project is a digital log book for contacts you make on ham bands.

> NOTE: DO NOT USE. This is not finished and is EXTREMLY INSECURE
> There is no security, email verififcation, NOTHING. Treat anything entered on this website as fully public as if it was on the front page of every website and social meadia

## What is Ham and stuff?

Ham radio is another name for Amateur radio.
A contact is somebody you interacted with over ham radio

## Dev stuff

### Stack

- Nextjs
- HeroUI
- BetterAuth
- Postgresql

### Env Vars

```
BETTER_AUTH_SECRET=<generate using `openssl rand -base64 32`>
BETTER_AUTH_URL=<BASE URL including protocol>

PGHOST=
PGPORT=
PGDATABASE=
PGPASSWORD=
```


### Database

```sql
CREATE TABLE "profile" (
  "userid" text PRIMARY KEY,
  "callsign" text NOT NULL UNIQUE,
  "country" text NOT NULL
);

CREATE TABLE "contacts" (
  "id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "contacts_id_seq"),
  "startdate" integer NOT NULL,
  "enddate" integer NOT NULL,
  "callsign" text NOT NULL,
  "freq" integer NOT NULL,
  "mode" text NOT NULL,
  "power" integer NOT NULL,
  "country" text NOT NULL,
  "userid" text NOT NULL,
  "comments" text
);
```