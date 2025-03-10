if (window.location.hostname === 'localhost') {
  new EventSource(`http://localhost:${SERVE_PORT}`).addEventListener('change', () =>
    location.reload()
  );
}
