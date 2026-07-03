// Scroll-based fade-in animation
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));

// Card mouse glow effect
document.querySelectorAll('.project-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    card.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
    card.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
  });
});

// Copy-to-clipboard for raw file buttons
document.querySelectorAll('[data-copy-file]').forEach(btn => {
  const original = btn.textContent;
  btn.addEventListener('click', async () => {
    try {
      const res = await fetch(btn.getAttribute('data-copy-file'));
      const text = await res.text();
      await navigator.clipboard.writeText(text);
      btn.textContent = 'Copied!';
    } catch (e) {
      btn.textContent = 'Copy failed';
    }
    setTimeout(() => { btn.textContent = original; }, 2000);
  });
});
