// Site content data. Each list shows "Coming soon!" while empty.
//   date / read: 'YYYY-MM' (used for the year filter)
//   tags: used for the # filters
//   xyz (optional): [pc1, pc2, pc3] from real embeddings. Without it, points sit near
//   a placeholder position for their `c` (cluster) value.
//
// Examples:
//   POSTS: { t: 'Title', date: '2026-10', href: 'writings/my-post.html', tags: ['neuro'], c: 'neuro', tldr: 'One-line summary.' }
//     (copy writings/_template.html to start a new post)
//   BOOKS: { t: 'Title', a: 'Author', read: '2026-10', tags: ['fiction'], c: 'fiction', note: 'Optional note.' }
//   PHOTOS: { t: 'Caption', src: 'photos/owls.jpg', date: '2026-10', tags: ['travel'], c: 'fiction' }

window.POSTS = [];
window.BOOKS = [];
window.PHOTOS = [];
