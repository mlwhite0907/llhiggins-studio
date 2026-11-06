(() => {
  const link = document.getElementById('email-link');
  const status = document.getElementById('contact-status');
  if (!link || !status) return;

  // The address is separate private data, not part of the source checkout.
  fetch('./contact.json', { cache: 'no-store' })
    .then(response => {
      if (!response.ok) throw new Error('Contact is unavailable');
      return response.json();
    })
    .then(data => {
      if (typeof data.form_url === 'string' && data.form_url.trim()) {
        const url = new URL(data.form_url.trim());
        if (url.protocol !== 'https:' || url.hostname !== 'docs.google.com' || url.port || url.username || url.password || url.search || url.hash || !/^\/forms\/d\/e\/[A-Za-z0-9_-]+\/viewform$/.test(url.pathname)) throw new Error('Invalid contact form');
        link.href = url.href;
        link.hidden = false;
        status.textContent = 'Send a message using our contact form.';
        return;
      }
      const email = typeof data.email === 'string' ? data.email.trim() : '';
      if (email.length > 254 || !/^[A-Za-z0-9.!#$%&'*+/=?^_`{|}~-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(email)) throw new Error('Invalid contact');
      link.href = 'mailto:' + email + '?subject=' + encodeURIComponent('LLHiggins project inquiry');
      link.hidden = false;
      status.textContent = email;
    })
    .catch(() => {
      link.hidden = true;
      status.textContent = 'Contact details are being prepared.';
    });
})();
