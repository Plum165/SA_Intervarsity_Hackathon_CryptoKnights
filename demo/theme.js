document.addEventListener('DOMContentLoaded', () => {
  const themeSelect = document.getElementById('theme-select');
  const customPicker = document.getElementById('custom-theme-picker');
  const customBg = document.getElementById('custom-bg');
  const customPrimary = document.getElementById('custom-primary');
  const customSecondary = document.getElementById('custom-secondary');
  const customText = document.getElementById('custom-text');
  const applyCustomBtn = document.getElementById('apply-custom-theme');

  // -------- Apply Theme Function --------
  const applyTheme = (theme) => {
    // Remove old theme classes
    document.body.classList.forEach(cls => {
      if (cls.startsWith('theme-')) document.body.classList.remove(cls);
    });

    // Apply selected theme
    document.body.classList.add(theme);

    // Show custom picker if 'theme-custom' is selected
    if (theme === 'theme-custom') {
      customPicker.style.display = 'block';
    } else {
      customPicker.style.display = 'none';
    }
  };

  // -------- Load saved theme --------
  const savedTheme = localStorage.getItem('selectedTheme') || 'theme-default';
  applyTheme(savedTheme);
  themeSelect.value = savedTheme;

  // -------- Theme dropdown change --------
  themeSelect.addEventListener('change', (e) => {
    const selectedTheme = e.target.value;
    applyTheme(selectedTheme);
    localStorage.setItem('selectedTheme', selectedTheme);
  });

  // -------- Apply custom theme colors --------
  applyCustomBtn.addEventListener('click', () => {
    const bg = customBg.value;
    const primary = customPrimary.value;
    const secondary = customSecondary.value;
    const text = customText.value;

    // Set CSS variables for custom theme
    document.body.style.setProperty('--bg-color', bg);
    document.body.style.setProperty('--primary-accent', primary);
    document.body.style.setProperty('--secondary-accent', secondary);
    document.body.style.setProperty('--text-color', text);

    // Save custom theme values to localStorage
    localStorage.setItem('customTheme', JSON.stringify({ bg, primary, secondary, text }));
  });

  // -------- Load saved custom theme values --------
  const savedCustom = JSON.parse(localStorage.getItem('customTheme'));
  if (savedCustom) {
    customBg.value = savedCustom.bg;
    customPrimary.value = savedCustom.primary;
    customSecondary.value = savedCustom.secondary;
    customText.value = savedCustom.text;

    // If custom theme was selected, apply saved colors
    if (savedTheme === 'theme-custom') {
      customPicker.style.display = 'block';
      applyCustomBtn.click(); // Apply saved colors
    }
  }

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

  // -------- Show first page by default --------
  if (pages.length > 0) pages[0].classList.add('active');
});
