pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.5.141/pdf.worker.min.js';

document.addEventListener('DOMContentLoaded', () => {
  // ----------- Load User Data -----------
  let userPoints = parseInt(localStorage.getItem("userPoints")) || 50;
  let ownedThemes = JSON.parse(localStorage.getItem("ownedThemes")) || ["theme-default"];
  let ownedCoupons = JSON.parse(localStorage.getItem("ownedCoupons")) || [];

  // ----------- DOM Elements -----------
  const pointsDisplay = document.getElementById("userPoints");
  const themeSelect = document.getElementById('theme-select');
  const customPicker = document.getElementById('custom-theme-picker');
  const customBg = document.getElementById('custom-bg');
  const customPrimary = document.getElementById('custom-primary');
  const customSecondary = document.getElementById('custom-secondary');
  const customText = document.getElementById('custom-text');
  const applyCustomBtn = document.getElementById('apply-custom-theme');
  const addPointsBtn = document.getElementById("addPointsBtn");
  const ownedThemesList = document.getElementById("ownedThemesList");
  const ownedCouponsList = document.getElementById("ownedCouponsList");






  // ----------- Update Points Display -----------
  const updatePointsDisplay = () => {
    if (pointsDisplay) pointsDisplay.textContent = userPoints;
  };
  updatePointsDisplay();

  // ----------- Update Rewards Display -----------
  const updateRewardsDisplay = () => {
    if (ownedThemesList) {
      ownedThemesList.innerHTML = "";
      ownedThemes.forEach(theme => {
        const li = document.createElement("li");
        li.textContent = theme.replace("theme-", "").replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase());
        ownedThemesList.appendChild(li);
      });
    }

    if (ownedCouponsList) {
      ownedCouponsList.innerHTML = "";
      ownedCoupons.forEach(coupon => {
        const li = document.createElement("li");
        li.textContent = coupon.replace(/([a-zA-Z]+)(\d+)/, "$1 - $2% Off");
        ownedCouponsList.appendChild(li);
      });
    }
  };
  updateRewardsDisplay();

  // ----------- Add Points Button -----------
  if (addPointsBtn) {
    addPointsBtn.addEventListener("click", () => {
      userPoints += 100;
      localStorage.setItem("userPoints", userPoints);
      updatePointsDisplay();
    });
  }

  // ----------- Apply Theme Function -----------
  const applyTheme = (theme) => {
    if (!ownedThemes.includes(theme)) {
      alert("You don’t own this theme yet! Unlock it in the Rewards Shop.");
      return;
    }
    document.body.classList.forEach(cls => {
      if (cls.startsWith('theme-')) document.body.classList.remove(cls);
    });
    document.body.classList.add(theme);
    if (theme === 'theme-custom') {
      customPicker.style.display = 'block';
    } else {
      customPicker.style.display = 'none';
    }
    localStorage.setItem("selectedTheme", theme);
  };

  // ----------- Populate Theme Dropdown -----------
  const populateThemeDropdown = () => {
    if (themeSelect) {
      themeSelect.innerHTML = '';
      ownedThemes.forEach(theme => {
        const opt = document.createElement("option");
        opt.value = theme;
        opt.textContent = theme.replace("theme-", "").replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase());
        themeSelect.appendChild(opt);
      });
      const savedTheme = localStorage.getItem("selectedTheme");
      if (savedTheme && ownedThemes.includes(savedTheme)) {
        themeSelect.value = savedTheme;
        applyTheme(savedTheme);
      } else if (ownedThemes.length > 0) {
        themeSelect.value = ownedThemes[0];
        applyTheme(ownedThemes[0]);
      }
      themeSelect.addEventListener('change', (e) => {
        applyTheme(e.target.value);
      });
    }
  };
  populateThemeDropdown();

  // ----------- Apply Custom Theme -----------
  if (applyCustomBtn) {
    applyCustomBtn.addEventListener('click', () => {
      const bg = customBg.value;
      const primary = customPrimary.value;
      const secondary = customSecondary.value;
      const text = customText.value;
      document.body.style.setProperty('--bg-color', bg);
      document.body.style.setProperty('--primary-accent', primary);
      document.body.style.setProperty('--secondary-accent', secondary);
      document.body.style.setProperty('--text-color', text);
      localStorage.setItem('customTheme', JSON.stringify({ bg, primary, secondary, text }));
      alert("Custom theme applied!");
    });
    const savedCustom = JSON.parse(localStorage.getItem('customTheme'));
    if (savedCustom) {
      customBg.value = savedCustom.bg;
      customPrimary.value = savedCustom.primary;
      customSecondary.value = savedCustom.secondary;
      customText.value = savedCustom.text;
      if (localStorage.getItem("selectedTheme") === 'theme-custom') {
        customPicker.style.display = 'block';
        applyCustomBtn.click();
      }
    }
  }

  // ----------- Rewards Shop Buy Buttons -----------
  const updateShopButtons = () => {
    document.querySelectorAll(".buy-btn").forEach(btn => {
      const li = btn.closest("li");
      const theme = li.dataset.theme;
      const coupon = li.dataset.coupon;
      if ((theme && ownedThemes.includes(theme)) || (coupon && ownedCoupons.includes(coupon))) {
        btn.disabled = true;
        btn.textContent = "Owned";
        li.style.opacity = 0.5;
      } else {
        btn.disabled = false;
        btn.textContent = "Buy";
        li.style.opacity = 1;
      }
    });
  };
  updateShopButtons();

  document.querySelectorAll(".buy-btn").forEach(btn => {
    btn.addEventListener("click", (e) => {
      const li = e.target.closest("li");
      const cost = parseInt(li.dataset.cost);
      const theme = li.dataset.theme;
      const coupon = li.dataset.coupon;
      if (userPoints < cost) {
        alert("Not enough points to buy this!");
        return;
      }
      userPoints -= cost;
      localStorage.setItem("userPoints", userPoints);
      updatePointsDisplay();
      if (theme && !ownedThemes.includes(theme)) {
        ownedThemes.push(theme);
        localStorage.setItem("ownedThemes", JSON.stringify(ownedThemes));
        alert(`You unlocked ${theme.replace("theme-", "").replace(/-/g," ").replace(/\b\w/g,c=>c.toUpperCase())}!`);
        populateThemeDropdown();
      }
      if (coupon && !ownedCoupons.includes(coupon)) {
        ownedCoupons.push(coupon);
        localStorage.setItem("ownedCoupons", JSON.stringify(ownedCoupons));
        alert(`You unlocked a coupon: ${coupon}!`);
      }
      updateRewardsDisplay();
      updateShopButtons();
    });
  });

  // ----------- Page Switching -----------
  const navLinks = document.querySelectorAll("nav a");
  const pages = document.querySelectorAll(".page");
  navLinks.forEach(link => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const target = link.dataset.page;
      navLinks.forEach(l => l.classList.remove("active"));
      link.classList.add("active");
      pages.forEach(p => {
        if (p.id === target) p.classList.add("active");
        else p.classList.remove("active");
      });
    });
  });
  if (pages.length > 0) pages[0].classList.add('active');

  // ----------- Portfolio Chart -----------
  const portfolioCtx = document.getElementById('portfolioChart');
  if (portfolioCtx) {
    new Chart(portfolioCtx.getContext('2d'), {
      type: 'doughnut',
      data: {
        labels: ['FNB Shares (2000 ZAR)', 'Remaining Cash (3000 ZAR)'],
        datasets: [{
          data: [2000, 3000],
          backgroundColor: ['#6f42c1', '#3b0066'],
          borderColor: ['#fff', '#fff'],
          borderWidth: 2
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { position: 'bottom', labels: { color: '#fff', font: { size: 14 } } },
          tooltip: { callbacks: { label: ctx => ctx.label + ': ZAR ' + ctx.parsed } }
        }
      }
    });
  }

  
});
