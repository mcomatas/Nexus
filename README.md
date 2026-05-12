<div align="center">

# Nexus

**A social platform to rate, log, and discover games — inspired by [Letterboxd](https://letterboxd.com).**

[![Watch the demo](https://img.shields.io/badge/▶_Watch_the_demo-FF0000?style=for-the-badge&logo=youtube&logoColor=white)](https://youtu.be/REPLACE_WITH_VIDEO_ID)

[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Prisma](https://img.shields.io/badge/Prisma-6-2D3748?logo=prisma&logoColor=white)](https://www.prisma.io/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-336791?logo=postgresql&logoColor=white)](https://www.postgresql.org/)

</div>

---

## Overview

Nexus is a fullstack web app where players can track the games they've played, rate and review them, showcase favorites on their profile, and see what their friends are playing. Game data is sourced from the [IGDB API](https://www.igdb.com/api), and a custom *popularity score* blends IGDB activity with live [Steam](https://store.steampowered.com/) peak-player counts.

## Preview

A full walkthrough is available in the [demo video](https://youtu.be/REPLACE_WITH_VIDEO_ID). Quick looks below:

![Nexus demo](https://i.imgur.com/dXkQPJL.gif)

<details>
<summary>More previews</summary>

![Profile preview](https://i.imgur.com/k2q1M8z.gif)
![Game page preview](https://i.imgur.com/GssdHwk.gif)

</details>

## Features

- **Game discovery** — search and browse a catalog backed by IGDB, ranked by a live popularity score
- **Reviews & ratings** — leave a rating and written review on any game; one review per user per title
- **Personal profile** — public profile page with currently-playing, played-games library, and a four-slot favorites showcase
- **Authentication** — email/password sign-in with email verification via [Better Auth](https://better-auth.com) and [Resend](https://resend.com/)
- **Avatar uploads** — image uploads handled through [UploadThing](https://uploadthing.com/)
- **Responsive UI** — built mobile-first with Tailwind CSS

## Tech Stack

| Layer | Tools |
| --- | --- |
| Framework | Next.js 16 (App Router), React 19, TypeScript |
| Styling | Tailwind CSS v4, styled-components |
| Database | PostgreSQL via Prisma ORM |
| Auth | Better Auth (with Resend for transactional email) |
| Data fetching | SWR |
| Uploads | UploadThing |
| External APIs | IGDB, Steam |

## Architecture Notes

- **Server actions & route handlers** power most mutations (reviews, profile updates, game logging), keeping client bundles lean
- **Composite popularity score** combines IGDB metadata with Steam's `GetCurrentPlayerCount` to surface games people are actually playing right now
- **Schema-first data layer** — Prisma models for `User`, `Game`, `Review`, plus session/account tables managed by Better Auth

---

<div align="center">

Built by [Michael Comatas](https://github.com/mcomatas) · [LICENSE](./LICENSE)

</div>
