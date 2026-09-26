// Builds the link graph shared by the home page and post pages.
// Edges come from `links: [...]` in library.js and from [[id]] / [[id|text]] inside post HTML.
window.SiteGraph = (function () {
  var KINDS = { posts: 'POSTS', books: 'BOOKS', photos: 'PHOTOS' };
  var RX = /\[\[([^\]|]+)(?:\|([^\]]+))?\]\]/g;
  function nodes() {
    var out = [];
    Object.keys(KINDS).forEach(function (k) {
      (window[KINDS[k]] || []).forEach(function (it, i) { out.push({ id: it.id || (k + '-' + i), kind: k, i: i, t: it.t, it: it }); });
    });
    return out;
  }
  function build(base) {
    var N = nodes(), by = {}, E = {};
    N.forEach(function (n, j) { by[n.id] = j; });
    function add(a, b) { if (a == null || b == null || a === b) return; var lo = Math.min(a, b), hi = Math.max(a, b); E[lo + ',' + hi] = [lo, hi]; }
    N.forEach(function (n, j) { (n.it.links || []).forEach(function (id) { add(j, by[id]); }); });
    var jobs = N.filter(function (n) { return n.kind === 'posts' && n.it.href; }).map(function (n) {
      return fetch(base + n.it.href).then(function (r) { return r.ok ? r.text() : ''; }).then(function (tx) {
        var m; RX.lastIndex = 0; while ((m = RX.exec(tx))) add(by[n.id], by[m[1].trim()]);
      }).catch(function () {});
    });
    return Promise.all(jobs).then(function () {
      var edges = Object.keys(E).map(function (k) { return E[k]; }), adj = N.map(function () { return []; });
      edges.forEach(function (e) { adj[e[0]].push(e[1]); adj[e[1]].push(e[0]); });
      return { nodes: N, edges: edges, adj: adj, byId: by };
    });
  }
  // Where a node lives. base = '' from index.html, '../' from a post.
  function hrefFor(n, base) {
    if (n.kind === 'posts' && n.it.href) return base + n.it.href;
    if (n.kind === 'photos' && n.it.src) return base + n.it.src;
    return base + 'index.html#' + ({ posts: 'w-', books: 'b-', photos: 'p-' })[n.kind] + n.id;
  }
  return { build: build, nodes: nodes, hrefFor: hrefFor, RX: RX };
})();
