
const header = document.querySelector('.site-header');
const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');

const handleHeader = () => {
  if (!header) return;
  header.classList.toggle('scrolled', window.scrollY > 18);
};

handleHeader();
window.addEventListener('scroll', handleHeader);

if (menuToggle && navLinks) {
  menuToggle.addEventListener('click', () => {
    const expanded = menuToggle.getAttribute('aria-expanded') === 'true';
    menuToggle.setAttribute('aria-expanded', String(!expanded));
    navLinks.classList.toggle('open');
  });

  navLinks.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      menuToggle.setAttribute('aria-expanded', 'false');
    });
  });
}

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.16 }
);

document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));

const quoteForm = document.querySelector('[data-quote-form]');
if (quoteForm) {
  const status = quoteForm.querySelector('.form-status');

  quoteForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const formData = new FormData(quoteForm);
    const payload = Object.fromEntries(formData.entries());

    status.textContent = 'Submitting your request...';

    try {
      const response = await fetch('/api/quote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error('Request failed');
      const data = await response.json();
      status.textContent = data.message || 'Quote request sent successfully.';
      quoteForm.reset();
    } catch (error) {
      status.textContent = 'Form UI is ready. To collect entries, run the Flask app and submit again.';
    }
  });
}
