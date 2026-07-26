/* global localStorage, document, matchMedia */
try {
  const stored = JSON.parse(localStorage.getItem('snr.ui-preferences.v1') || 'null');
  const selected = stored && stored.theme;
  const theme =
    selected === 'system'
      ? matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light'
      : selected;
  if (theme === 'dark' || theme === 'light') document.documentElement.dataset.theme = theme;
} catch (error) {
  void error;
}
