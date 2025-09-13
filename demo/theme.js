document.addEventListener('DOMContentLoaded', () => {
  const themeSelect = document.getElementById('theme-select');

  // Load saved theme from localStorage
  const savedTheme = localStorage.getItem('selectedTheme');
  if (savedTheme) {
    document.body.className = savedTheme;
    themeSelect.value = savedTheme;
  }

  themeSelect.addEventListener('change', (e) => {
    const selectedTheme = e.target.value;
    document.body.className = selectedTheme;
    // Save selected theme to localStorage
    localStorage.setItem('selectedTheme', selectedTheme);
  });
});