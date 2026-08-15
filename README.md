# Personal Website

Source for [madhavkhoslaa.github.io](https://madhavkhoslaa.github.io/), built with [Hugo](https://gohugo.io/) using the bundled `termrice` theme (`themes/termrice`).

## Clone

```
git clone git@github.com:madhavkhoslaa/madhavkhoslaa.github.io.git
```

The theme lives directly in this repo (`themes/termrice`), not as a submodule, so no `--recursive` flag is needed.

## Requirements

- [Hugo extended](https://gohugo.io/installation/) v0.100.0 or newer.

## Build & preview

Run a local dev server with live reload:

```
hugo serve
```

Then open `http://localhost:1313`. To preview on another device (e.g. your phone) on the same network:

```
hugo serve --bind 0.0.0.0
```

and browse to `http://<your-machine-lan-ip>:1313`.

To produce the static production build (output goes to `public/`):

```
hugo --minify
```

## Adding a blog post

Live posts live in `content/posts/`. Add a new Markdown file there, e.g. `content/posts/my-new-post.md`:

```markdown
---
title: "My New Post"
date: 2026-08-15T12:00:00+05:30
draft: false
description: "A short summary used for previews and meta tags."
tags: [tag-one, tag-two]
---

Post content goes here.
```

It'll automatically show up on the home page, `/posts/`, and in `/tags/` for any tags used (tags are only sourced from `content/posts/` — archive/draft tags don't appear there).

## Archiving a post

Older posts you want to keep but no longer treat as "current" live in `content/archive/`. Just move the file:

```
git mv content/posts/my-old-post.md content/archive/my-old-post.md
```

Archived posts still render at `/archive/<slug>/` and show up on `/archive/`, but they won't appear in the homepage feed or in `/tags/`.

## Drafts

Work-in-progress posts live in `content/draft/`. They're listed under `/draft/` but, like the archive, are excluded from the homepage feed and tags. Move a post to `content/posts/` once it's ready to publish.

## Project layout

- `content/posts/` — live blog posts
- `content/archive/` — old/retired posts
- `content/draft/` — work-in-progress posts
- `content/about.md` — About page
- `themes/termrice/` — the site's theme (layouts in `layouts/`, styles in `static/css/rice.css`)
- `config.toml` — site config, nav menu, social links
