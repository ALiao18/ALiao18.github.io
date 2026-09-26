(function () {
  var t = localStorage.getItem('al-theme');
  if (!t) t = matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  document.documentElement.dataset.theme = t;
  document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('.theme').forEach(function (b) {
      b.addEventListener('click', function () {
        var n = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
        document.documentElement.dataset.theme = n; localStorage.setItem('al-theme', n);
        window.dispatchEvent(new Event('themechange'));
      });
    });
    if (window.renderMathInElement) renderMathInElement(document.body, { delimiters: [{ left: '$$', right: '$$', display: true }, { left: '\\(', right: '\\)', display: false }] });
  });
})();
