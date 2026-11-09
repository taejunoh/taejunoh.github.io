(function () {
  const pageSize = 6;
  const posts = Array.from(document.querySelectorAll('.post-teaser'));
  const pagination = document.querySelector('.writing-pagination');

  if (!pagination || posts.length <= pageSize) return;

  const pageCount = Math.ceil(posts.length / pageSize);
  const requestedPage = Number.parseInt(new URLSearchParams(window.location.search).get('page'), 10);
  const currentPage = Number.isFinite(requestedPage)
    ? Math.min(Math.max(requestedPage, 1), pageCount)
    : 1;

  posts.forEach((post, index) => {
    post.hidden = Math.floor(index / pageSize) + 1 !== currentPage;
  });

  function addLink(label, page, options = {}) {
    const link = document.createElement(options.disabled ? 'span' : 'a');
    link.textContent = label;

    if (options.current) {
      link.setAttribute('aria-current', 'page');
    }

    if (options.disabled) {
      link.setAttribute('aria-disabled', 'true');
    } else {
      link.href = page === 1 ? 'writing.html' : `writing.html?page=${page}`;
    }

    pagination.append(link);
  }

  addLink('Previous', Math.max(currentPage - 1, 1), { disabled: currentPage === 1 });
  for (let page = 1; page <= pageCount; page += 1) {
    addLink(String(page), page, { current: page === currentPage });
  }
  addLink('Next', Math.min(currentPage + 1, pageCount), { disabled: currentPage === pageCount });

  pagination.hidden = false;
})();
