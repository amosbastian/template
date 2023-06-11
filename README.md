# Template

A Next.js 13 application with authentication and payments, built with PlanetScale, Drizzle ORM, Lucia, Tailwind and LemonSqueezy

## About this project

I used this as a way to play around with the new Next.js app directory, so it is more than likely that things aren't optimal / implemented correctly, so **keep this in mind if you decide to fork it**

If you encounter something that's broken, you can message me [@amosbastian](https://twitter.com/amosbastian) or create an issue here

## Features

- Nearly everything included in the Next.js app directory
- TypeScript ORM for SQL databases: [**Drizzle ORM**](https://github.com/drizzle-team/drizzle-orm)
- Authentication using [**Lucia**](https://github.com/pilcrowOnPaper/lucia)
- Database on [**PlanetScale**](https://planetscale.com/)
- UI components from [**shadcn/ui**](https://github.com/shadcn/ui)
- Blog using **MDX** and [**Contentlayer**](https://github.com/contentlayerdev/contentlayer)
- Subscriptions using [**LemonSqueezy**](https://www.lemonsqueezy.com/)
- Styled using **Tailwind CSS**
- Fetching data using RSCs and [**tRPC**](https://github.com/trpc/trpc)
- Email verification
- Teams with team member management
- RBAC using [**CASL**](https://github.com/stalniy/casl)
- Emails using [**Mailing**](https://github.com/sofn-xyz/mailing)

## Known Issues

A list of things not working or implemented right now:

1. Sometimes MySQL will complain about too many connections: restart your Next.js app and it will go away
2. Pricing plans currently aren't synced to the database, which would be ideal
3. RBAC might not work as intended and I haven't tested it enough

## Running Locally

1. Install dependencies using npm:

```sh
npm install
```

2. Copy `.env.example` to `.env` and update the variables

```sh
cp .env.example .env
```

3. Start the development server:

```sh
npx nx serve web
```

### Setting up the database

#### Local

1. Log in to MySQL

```bash
mysql -u root
```

2. Create the database

```bash
CREATE DATABASE template;
```

3. Push your schema

```bash
npx drizzle-kit mysql:push
```

#### PlanetScale

You don't have to use a local database and use PlanetScale as your only database if you want

TODO:

### Authentication

To set up GitHub OAuth you need to

1. Go to https://github.com/settings/developers

2. Click "New OAuth App"

3. Add your authorisation callback URL: http://localhost:4200/api/oauth/github

### Emails

You can run Mailing to get a preview of the email in development mode instead of actually sending an email

```bash
npx mailing
```

## License

Licensed under the [MIT license](https://github.com/amosbastian/template/blob/main/LICENSE.md).
