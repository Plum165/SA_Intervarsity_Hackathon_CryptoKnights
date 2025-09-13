document.addEventListener('DOMContentLoaded', () => {
  const themeSelect = document.getElementById('theme-select');

  // -------- Theme Switching --------
  const applyTheme = (theme) => {
    // Remove any old theme
    document.body.classList.forEach(cls => {
      if (cls.startsWith('theme-')) {
        document.body.classList.remove(cls);
      }
    });
    // Add the selected theme
    document.body.classList.add(theme);
  };

  // Load saved theme from localStorage
  const savedTheme = localStorage.getItem('selectedTheme');
  if (savedTheme) applyTheme(savedTheme);
  themeSelect.value = savedTheme || 'theme-default';

  // On theme change
  themeSelect.addEventListener('change', (e) => {
    const selectedTheme = e.target.value;
    applyTheme(selectedTheme);
    localStorage.setItem('selectedTheme', selectedTheme);
  });

  // -------- Page Switching --------
  const navLinks = document.querySelectorAll("nav a");
  const pages = document.querySelectorAll(".page");

  navLinks.forEach(link => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const target = link.getAttribute("data-page");

      // Switch active link
      navLinks.forEach(l => l.classList.remove("active"));
      link.classList.add("active");

      // Show the target page, hide others
      pages.forEach(p => {
        if (p.id === target) p.classList.add("active");
        else p.classList.remove("active");
      });
    });
  });
});
