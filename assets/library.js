// Site content. Each list shows "Coming soon!" while empty.
//
// Every entry needs a unique `id`. Link any two items (posts, books, photos) in either of two ways:
//   1. links: ['other-id', ...] on the entry below
//   2. inside a post's HTML, write [[other-id]] or [[other-id|link text]]
//      (picked up automatically when the site is served, e.g. on GitHub Pages)
// Linked items are joined in the graphs and on the main manifold; posts list them under "Linked".
//
//   POSTS:  { id, t, date:'YYYY-MM', href:'writings/x.html', tags:[], c, tldr, links:[] }
//           (copy writings/_template.html to start a post)
//   BOOKS:  { id, t, a: author, read:'YYYY-MM', tags:[], c, note, links:[] }
//   PHOTOS: { id, t, src:'photos/x.jpg', date:'YYYY-MM', tags:[], c, links:[] }
//   xyz (optional): [pc1, pc2, pc3] from real embeddings, used by the PCA view.
//
// Entries marked placeholder: true are layout stand-ins. While a list has only placeholders,
// its section also shows "Coming soon!". Delete them when you add real entries.

window.POSTS = [];

window.BOOKS = [];

// St. George Marathon & Zion trip, Oct 2026. Linked in story order: Zion → race-morning start → on the course.
window.PHOTOS = [
  { id: 'zion-dusk', t: 'Zion at dusk', src: 'photos/zion-dusk.jpg', date: '2026-10', tags: ['zion'], c: 'landscape', links: ['night-sky'] },
  { id: 'night-sky', t: 'Milky Way', src: 'photos/night-sky.jpg', date: '2026-10', tags: ['zion'], c: 'landscape', links: ['start-wait'] },
  { id: 'start-wait', t: 'Waiting for the start', src: 'photos/start-wait.jpg', date: '2026-10', tags: ['st george marathon'], c: 'running', links: ['start-fire'] },
  { id: 'start-fire', t: 'Bonfire at the start line', src: 'photos/start-fire.jpg', date: '2026-10', tags: ['st george marathon'], c: 'running', links: ['on-course'] },
  { id: 'on-course', t: 'On the course', src: 'photos/on-course.jpg', date: '2026-10', tags: ['st george marathon'], c: 'running', links: [] }
];
