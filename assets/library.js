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

window.POSTS = [1, 2, 3].map(n => ({
  id: 'writing-' + n, t: 'Writing ' + n, date: '2026-0' + (n + 3), tags: ['tag ' + n], c: ['neuro', 'methods', 'philosophy'][n - 1],
  tldr: 'One-line summary.', links: ['book-' + n, 'photo-' + n], placeholder: true
}));

window.BOOKS = [1, 2, 3].map(n => ({
  id: 'book-' + n, t: 'Book ' + n, a: 'Author', read: '2026-0' + (n + 3), tags: ['tag ' + n], c: ['science', 'mind', 'fiction'][n - 1],
  note: 'Short note.', links: n < 3 ? ['book-' + (n + 1)] : [], placeholder: true
}));

window.PHOTOS = [1, 2, 3].map(n => ({
  id: 'photo-' + n, t: 'Photo ' + n, date: '2026-0' + (n + 3), tags: ['tag ' + n], c: ['scifi', 'fiction', 'science'][n - 1],
  links: n < 3 ? ['photo-' + (n + 1)] : [], placeholder: true
}));
