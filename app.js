'use strict';

const menuToggle = document.querySelector('.menu-toggle');
const navigation = document.getElementById('nav-menu');
const mobileQuery = window.matchMedia('(max-width: 760px)');

function closeMenu() {
  menuToggle.setAttribute('aria-expanded', 'false');
  menuToggle.setAttribute('aria-label', 'Open navigation');
  navigation.classList.remove('open');
}

menuToggle.addEventListener('click', () => {
  const expanded = menuToggle.getAttribute('aria-expanded') !== 'true';
  menuToggle.setAttribute('aria-expanded', String(expanded));
  menuToggle.setAttribute('aria-label', expanded ? 'Close navigation' : 'Open navigation');
  navigation.classList.toggle('open', expanded);
});
navigation.addEventListener('click', (event) => {
  if (event.target.closest('a')) closeMenu();
});
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && menuToggle.getAttribute('aria-expanded') === 'true') {
    closeMenu();
    menuToggle.focus();
  }
});
document.addEventListener('click', (event) => {
  if (!event.target.closest('.navigation')) closeMenu();
});
mobileQuery.addEventListener('change', closeMenu);

if ('IntersectionObserver' in window) {
  const links = [...document.querySelectorAll('.nav-link')];
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      links.forEach((link) => {
        const active = link.hash === `#${entry.target.id}`;
        link.classList.toggle('active', active);
        if (active) link.setAttribute('aria-current', 'location');
        else link.removeAttribute('aria-current');
      });
    });
  }, { rootMargin: '-15% 0px -55% 0px', threshold: 0 });
  document.querySelectorAll('main section[id]').forEach((section) => observer.observe(section));
}

document.getElementById('year').textContent = new Date().getFullYear();
const emailAddress = 'falgunpatel.fv@proton.me';
const copyButton = document.querySelector('.copy-email');
let copyReset;
copyButton.addEventListener('click', async () => {
  const label = copyButton.querySelector('span');
  const status = document.getElementById('copy-status');
  try {
    await navigator.clipboard.writeText(emailAddress);
    label.textContent = 'Email address copied';
    status.textContent = 'Email address copied to clipboard.';
  } catch {
    label.textContent = 'Select the email address above to copy';
    status.textContent = 'Clipboard unavailable. Select and copy the email address above.';
  }
  clearTimeout(copyReset);
  copyReset = setTimeout(() => { label.textContent = 'Copy email address'; }, 4000);
});

document.getElementById('contact-form').addEventListener('submit', (event) => {
  event.preventDefault();
  const form = event.currentTarget;
  const status = document.getElementById('form-status');
  if (!form.reportValidity()) return;
  const fields = new FormData(form);
  const name = fields.get('name').trim();
  const email = fields.get('email').trim();
  const message = fields.get('message').trim();
  if (!name || !message) {
    status.textContent = 'Please add your name and a message before creating a draft.';
    return;
  }
  const subject = `${fields.get('subject')} — ${name}`;
  const body = `Hi Falgun,\n\n${message}\n\nBest,\n${name}\n${email}`;
  window.location.href = `mailto:${emailAddress}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  status.textContent = 'Your draft was requested in your email app. If it does not open, email me directly using the address alongside this form.';
});
