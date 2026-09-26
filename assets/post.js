(function () {
  var t = localStorage.getItem('al-theme');
  if (!t) t = matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  document.documentElement.dataset.theme = t;
  var BASE = '../';
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  // [[id]] / [[id|text]] -> links
  function wikify(root, by, N) {
    var walk = document.createTreeWalker(root, NodeFilter.SHOW_TEXT), hits = [], n;
    while ((n = walk.nextNode())) if (n.nodeValue.indexOf('[[') >= 0) hits.push(n);
    hits.forEach(function (tn) {
      var span = document.createElement('span');
      span.innerHTML = esc(tn.nodeValue).replace(/\[\[([^\]|]+)(?:\|([^\]]+))?\]\]/g, function (_, id, txt) {
        id = id.trim(); var j = by[id];
        if (j == null) return '<span class="wl missing" title="No item with id ' + esc(id) + '">' + esc(txt || id) + '</span>';
        return '<a class="wl" href="' + SiteGraph.hrefFor(N[j], BASE) + '">' + esc(txt || N[j].t) + '</a>';
      });
      tn.parentNode.replaceChild(span, tn);
    });
  }
  document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('.theme').forEach(function (b) {
      b.addEventListener('click', function () {
        var n = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
        document.documentElement.dataset.theme = n; localStorage.setItem('al-theme', n);
        window.dispatchEvent(new Event('themechange'));
      });
    });
    if (window.SiteGraph) {
      var N = SiteGraph.nodes(), by = {};
      N.forEach(function (n, j) { by[n.id] = j; });
      var prose = document.querySelector('.prose');
      if (prose) wikify(prose, by, N);
      var file = location.pathname.split('/').pop();
      var me = N.findIndex(function (n) { return n.kind === 'posts' && n.it.href && n.it.href.split('/').pop() === file; });
      if (me >= 0) SiteGraph.build(BASE).then(function (G) {
        var nb = G.adj[me]; if (!nb.length) return;
        var KN = { posts: 'writing', books: 'book', photos: 'photo' };
        var box = document.createElement('div'); box.className = 'backlinks';
        box.innerHTML = '<div class="k">Linked</div>' + nb.map(function (j) { var x = G.nodes[j]; return '<a href="' + SiteGraph.hrefFor(x, BASE) + '"><span>' + esc(x.t) + '</span><span class="kd">' + KN[x.kind] + '</span></a>'; }).join('');
        var end = document.querySelector('.end'); end.parentNode.insertBefore(box, end);
      });
    }
    if (window.renderMathInElement) renderMathInElement(document.body, { delimiters: [{ left: '$$', right: '$$', display: true }, { left: '\\(', right: '\\)', display: false }] });
  });
})();
