# Andrew Liao — personal site

Static site. No build step, so it can be hosted on GitHub Pages as is.

## Deploy
1. Create a public repo named `ALiao18.github.io`.
2. Put the contents of this folder at the top level of the repo (`index.html` at the top level).
3. Settings → Pages → Source: "Deploy from a branch", Branch: `main`, folder `/ (root)`.
4. The site goes live at https://aliao18.github.io in 1–2 minutes.

## Editing
- Books and posts: `assets/library.js` (one entry each).
- New post: copy a file in `writings/`, edit it, then add an entry to `window.POSTS`.
- Portrait: add `portrait.jpg` at the top level; it appears on About automatically.
- Resume: replace `resume.pdf`.
