document.addEventListener('DOMContentLoaded', () => {
  // ----------- User Points -----------
  let userPoints = parseInt(localStorage.getItem("userPoints")) || 50;
  const pointsDisplay = document.getElementById("pointsDisplay");
  const updatePointsDisplay = () => { if (pointsDisplay) pointsDisplay.textContent = userPoints; };
  updatePointsDisplay();

  function addPoints(amount) {
    userPoints += amount;
    localStorage.setItem("userPoints", userPoints);
    updatePointsDisplay();
  }

  // ----------- Budget Mode Switcher -----------
  const modeSelect = document.getElementById("budgetMode");
  const groceriesInputs = document.getElementById("groceriesInputs");
  const candySection = document.getElementById("candyAnalysisSection");
  const recommendationsSection = document.getElementById("generalModeRecommendations");

  function switchMode(mode) {
    if (mode === "groceries") {
      groceriesInputs.style.display = "block";
      candySection.style.display = "block";
      recommendationsSection.style.display = "none";
    } else {
      groceriesInputs.style.display = "none";
      candySection.style.display = "none";
      recommendationsSection.style.display = "block";
    }
  }
  modeSelect.addEventListener("change", e => switchMode(e.target.value));
  switchMode(modeSelect.value);

  // ----------- PDF Input Simulation (JSON instead) -----------
  const pdfInput = document.getElementById("pdfInput");
  const pdfList = document.getElementById("pdfList");

  pdfInput.addEventListener("change", e => {
    loadReceiptJSON(); // simulate “uploading PDF” via JSON
    pdfInput.value = ""; // reset input for demo
  });

  async function loadReceiptJSON() {
    try {
      const response = await fetch("../../assets/data/receipt.json"); // offline JSON file
      const receiptData = await response.json();

      pdfList.innerHTML = "";
      receiptData.items.forEach(item => {
        let text = item.name;
        if (item.quantity) text += ` (${item.quantity} × R${item.unitPrice.toFixed(2)}) = R${item.totalPrice.toFixed(2)}`;
        if (item.discount) text += ` - Promo Discount R${item.discount.toFixed(2)}`;
        const li = document.createElement("li");
        li.textContent = text;
        pdfList.appendChild(li);
      });
      const totalLi = document.createElement("li");
      totalLi.textContent = `TOTAL: R${receiptData.total.toFixed(2)}`;
      pdfList.appendChild(totalLi);

      addPoints(100);
      updateCandyAnalysis(receiptData.items);
    } catch (err) {
      console.error("Failed to load receipt JSON:", err);
      pdfList.innerHTML = "<li>Failed to load receipt data.</li>";
    }
  }

  // ----------- Candy/Snack Analysis -----------
  const candySummary = document.getElementById("candySummary");
  function updateCandyAnalysis(items) {
    if (!candySummary) return;
    const candyItems = items.filter(i => /candy|choc|kit kat|cadbury|galaxy/i.test(i.name));
    if (!candyItems.length) {
      candySummary.innerHTML = "<p>No candy/snack items found.</p>";
      return;
    }
    candySummary.innerHTML = "";
    candyItems.forEach(i => {
      let text = i.name;
      if (i.quantity) text += ` (${i.quantity} × R${i.unitPrice.toFixed(2)}) = R${i.totalPrice.toFixed(2)}`;
      if (i.discount) text += ` - Promo Discount R${i.discount.toFixed(2)}`;
      const p = document.createElement("p");
      p.textContent = text;
      candySummary.appendChild(p);
    });
  }

  // ----------- Budget Form -----------
  const budgetForm = document.getElementById("budgetForm");
  const customBudget = document.getElementById("customBudget");
  budgetForm.addEventListener("submit", e => {
    e.preventDefault();
    const name = document.getElementById("budgetName").value.trim();
    const type = document.getElementById("incomeExpense").value;
    const category = document.getElementById("fixedFlexible").value;
    const amount = parseFloat(document.getElementById("budgetAmount").value);

    if (!name || isNaN(amount)) return;

    const entry = document.createElement("p");
    entry.textContent = `${name} (${type}, ${category}): R${amount.toFixed(2)}`;
    customBudget.appendChild(entry);

    addPoints(50);
    e.target.reset();
    updateCharts();
  });

  document.getElementById("clearBudgetBtn").addEventListener("click", () => {
    customBudget.innerHTML = "<p>No budgets added yet.</p>";
    updateCharts();
  });

  document.getElementById("checkBudgetBtn").addEventListener("click", () => {
    alert("Budget check coming soon: will compare against 60/20/20 rule!");
    addPoints(20);
  });

  // ----------- Charts (Chart.js) -----------
  const ctxIncomeExpense = document.getElementById("incomeExpenseChart").getContext("2d");
  const ctxFixedFlexible = document.getElementById("fixedFlexibleChart").getContext("2d");
  const ctxBudgetSplit = document.getElementById("budgetSplitChart").getContext("2d");

  window.incomeExpenseChart = new Chart(ctxIncomeExpense, {
    type: 'pie',
    data: { labels: ["Income", "Expenses"], datasets: [{ data: [0,0], backgroundColor: ["#4caf50","#f44336"] }] },
    options: { responsive: true }
  });

  window.fixedFlexibleChart = new Chart(ctxFixedFlexible, {
    type: 'pie',
    data: { labels: ["Fixed", "Flexible"], datasets: [{ data: [0,0], backgroundColor: ["#2196f3","#ff9800"] }] },
    options: { responsive: true }
  });

  window.budgetSplitChart = new Chart(ctxBudgetSplit, {
    type: 'pie',
    data: { labels: ["Needs (60%)", "Other (20%)", "Savings (20%)"], datasets: [{ data: [0,0,0], backgroundColor: ["#3f51b5","#9c27b0","#00bcd4"] }] },
    options: { responsive: true }
  });

  function updateCharts() {
    let income = 0, expenses = 0, fixed = 0, flexible = 0, totalAmount = 0;
    customBudget.querySelectorAll("p").forEach(p => {
      const match = p.textContent.match(/: R([\d.]+)/);
      if (!match) return;
      const amount = parseFloat(match[1]);
      totalAmount += amount;
      if (p.textContent.includes("income")) income += amount;
      else expenses += amount;
      if (p.textContent.includes("fixed")) fixed += amount;
      else if (p.textContent.includes("flexible")) flexible += amount;
    });

    window.incomeExpenseChart.data.datasets[0].data = [income, expenses];
    window.incomeExpenseChart.update();

    window.fixedFlexibleChart.data.datasets[0].data = [fixed, flexible];
    window.fixedFlexibleChart.update();

    // 60/20/20 split
    const needs = totalAmount * 0.6;
    const other = totalAmount * 0.2;
    const savings = totalAmount * 0.2;
    window.budgetSplitChart.data.datasets[0].data = [needs, other, savings];
    window.budgetSplitChart.update();
  }



  // ----------- Charts (Chart.js) -----------
 
  window.incomeExpenseChart = new Chart(ctxIncomeExpense, {
    type: 'pie',
    data: { labels: ["Income", "Expenses"], datasets: [{ data: [0,0], backgroundColor: ["#4caf50","#f44336"] }] },
    options: { responsive: true }
  });

  window.fixedFlexibleChart = new Chart(ctxFixedFlexible, {
    type: 'pie',
    data: { labels: ["Fixed", "Flexible"], datasets: [{ data: [0,0], backgroundColor: ["#2196f3","#ff9800"] }] },
    options: { responsive: true }
  });

  window.budgetSplitChart = new Chart(ctxBudgetSplit, {
    type: 'pie',
    data: { labels: ["Needs (60%)", "Other (20%)", "Savings (20%)"], datasets: [{ data: [0,0,0], backgroundColor: ["#3f51b5","#9c27b0","#00bcd4"] }] },
    options: { responsive: true }
  });

  function updateCharts() {
    let income = 0, expenses = 0, fixed = 0, flexible = 0, totalAmount = 0;
    customBudget.querySelectorAll("p").forEach(p => {
      const match = p.textContent.match(/: R([\d.]+)/);
      if (!match) return;
      const amount = parseFloat(match[1]);
      totalAmount += amount;
      if (p.textContent.includes("income")) income += amount;
      else expenses += amount;
      if (p.textContent.includes("fixed")) fixed += amount;
      else if (p.textContent.includes("flexible")) flexible += amount;
    });

    window.incomeExpenseChart.data.datasets[0].data = [income, expenses];
    window.incomeExpenseChart.update();

    window.fixedFlexibleChart.data.datasets[0].data = [fixed, flexible];
    window.fixedFlexibleChart.update();

    // 60/20/20 split
    const needs = totalAmount * 0.6;
    const other = totalAmount * 0.2;
    const savings = totalAmount * 0.2;
    window.budgetSplitChart.data.datasets[0].data = [needs, other, savings];
    window.budgetSplitChart.update();
  }
});
