let transactions = [];

try {
  const saved = JSON.parse(localStorage.getItem('transactions'));

  if (Array.isArray(saved)) {
    transactions = saved;
  }
} catch (error) {
  console.error('Could not load saved transactions:', error);
}

const themeToggle = document.getElementById('themeToggle');

function setToggleIcon() {
  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
  themeToggle.innerHTML = isDark
    ? '<i class="fa-solid fa-sun"></i>'
    : '<i class="fa-solid fa-moon"></i>';
}

themeToggle.addEventListener('click', () => {
  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
  const next = isDark ? 'light' : 'dark';

  document.documentElement.setAttribute('data-theme', next);
  localStorage.setItem('theme', next);
  setToggleIcon();
});


function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, char => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  })[char]);
}
const categoryLabels = {
  food: 'Food & Dining',
  transport: 'Transport',
  shopping: 'Shopping',
  bills: 'Bills & Utilities',
  entertainment: 'Entertainment',
  health: 'Health',
  education: 'Education',
  housing: 'Housing & Rent',
  'personal-care': 'Personal Care',
  other: 'Other',
  salary: 'Salary',
  freelance: 'Freelance',
  business: 'Business',
  investment: 'Investment',
  gift: 'Gift',
  refund: 'Refund'
};

function getCategoryLabel(slug) {
  return categoryLabels[slug] || slug;
}

const tablebody = document.getElementById('tablebody');
const mobileTransactions = document.getElementById('mobileTransactions');

function displayTransactionList() {

  tablebody.innerHTML = '';
  mobileTransactions.innerHTML = '';

  if (transactions.length === 0) {
    tablebody.innerHTML = `
    <tr>
      <td colspan="5" class="px-4 py-12 text-center">
        <div class="flex flex-col items-center">

          <div class="w-12 h-12 rounded-2xl flex items-center justify-center mb-4"
               style="background: var(--chip); border: 1px solid var(--card-border);">
            <i class="fa-solid fa-receipt text-xl" style="color: #F26B1D;"></i>
          </div>

         <p class="text-sm font-semibold" style="color: var(--text);">
            No transactions yet
          </p>

        <p class="text-xs mt-2" style="color: var(--muted);">
            Your income and expenses will appear here.
          </p>

          <a href="./transactionform.html"
             class="mt-5 px-4 py-2 rounded-lg text-sm font-medium text-white transition"
             style="background: #F26B1D;"
             onmouseover="this.style.background='#E96524'"
             onmouseout="this.style.background='#F26B1D'">
            <i class="fa-solid fa-plus mr-1"></i>
            Add transaction
          </a>

        </div>
      </td>
    </tr>
  `;
    mobileTransactions.innerHTML = `
  <div class="p-8 text-center text-gray-500">
    No transactions yet.
  </div>
`;

    return;
  }
const selectedType = document.getElementById('typeFilter').value;
const selectedCategory = document.getElementById('categoryFilter').value;

const startDate = document.getElementById('startDate').value;
const endDate = document.getElementById('endDate').value;

const filteredTransactions = transactions.filter(trans => {

  const matchesType =
    selectedType === 'all' || trans.type === selectedType;

  const matchesCategory =
    selectedCategory === 'all' || trans.category === selectedCategory;

  const matchesStartDate =
    !startDate || trans.date >= startDate;

  const matchesEndDate =
    !endDate || trans.date <= endDate;

  return matchesType && matchesCategory &&
         matchesStartDate && matchesEndDate;
});

if (filteredTransactions.length === 0) {
  tablebody.innerHTML = `
    <tr>
      <td colspan="5" class="px-4 py-8 text-center text-sm"
          style="color: var(--muted);">
        No matching transactions found.
      </td>
    </tr>
  `;

  mobileTransactions.innerHTML = `
    <div class="p-8 text-center text-sm" style="color: var(--muted);">
      No matching transactions found.
    </div>
  `;

  return;
}

const sortOption = document.getElementById('sortFilter').value;
const sortedTransactions = [...filteredTransactions];

if (sortOption === 'newest') {
  sortedTransactions.sort((a, b) => b.date.localeCompare(a.date));
}
else if (sortOption === 'oldest') {
  sortedTransactions.sort((a, b) => a.date.localeCompare(b.date));
}
else if (sortOption === 'highToLow') {
  sortedTransactions.sort((a, b) => Number(b.amount) - Number(a.amount));
}
else if (sortOption === 'lowToHigh') {
  sortedTransactions.sort((a, b) => Number(a.amount) - Number(b.amount));
}

sortedTransactions.forEach(trans => {

    const isIncome = trans.type === 'income';
    mobileTransactions.innerHTML += `
<div class="rounded-xl border border-orange-100 border-l-4 border-l-orange-700 bg-white p-4 shadow-sm">

    <div class="flex items-start justify-between gap-3">
      <div class="min-w-0">
        <h3 class="font-semibold text-gray-900 truncate">
          ${escapeHTML(trans.description)}
        </h3>
        <p class="mt-1 text-xs text-gray-500">
          ${escapeHTML(getCategoryLabel(trans.category))}
        </p>
      </div>

      <p class="font-semibold whitespace-nowrap ${isIncome ? 'text-emerald-600' : 'text-orange-800'}">
        ${isIncome ? '+' : '-'}₹${Number(trans.amount).toLocaleString('en-IN')}
      </p>
    </div>

    <div class="mt-4 flex items-center justify-between">
      <div class="flex items-center gap-2">
        <span class="rounded-full px-2.5 py-1 text-xs font-medium
          ${isIncome ? 'text-emerald-600' : 'text-orange-600'}">
          ${isIncome ? 'Income' : 'Expense'}
        </span>

        <span class="text-xs text-gray-500">
          ${escapeHTML(trans.date)}
        </span>
      </div>

      <div class="flex items-center gap-2">

  <a
    href="./transactionform.html?id=${trans.id}"
    class="inline-flex items-center justify-center w-8 h-8 rounded-lg
      text-gray-400 hover:text-green-700 hover:bg-green-50
      transition-colors duration-200"
    title="Edit transaction"
  >
    <i class="fa-solid fa-pen text-xs"></i>
  </a>

  <button
    onclick="deleteTransaction(${trans.id})"
    class="inline-flex items-center justify-center w-8 h-8 rounded-lg
      text-gray-400 hover:text-red-600 hover:bg-red-50
      transition-colors duration-200"
    title="Delete transaction"
  >
    <i class="fa-solid fa-trash text-xs"></i>
  </button>

</div>
    </div>

  </div>
`;

    tablebody.innerHTML += `
      <tr  class=" group border-b border-gray-100 last:border-b-0  transition-colors duration-200">


        <!-- Description -->
        <td class="p-4">
          <div class="flex items-center gap-3">

            <div class="w-9 h-9 rounded-xl flex items-center justify-center
              ${isIncome
        ? 'bg-emerald-50 text-emerald-700'
        : 'bg-gray-100 text-gray-500'}">

              <i class="fa-solid ${isIncome
        ? 'fa-arrow-down'
        : 'fa-arrow-up'} text-xs"></i>

            </div>

            <div>
              <p class="text-sm font-semibold text-gray-800">
                ${escapeHTML(trans.description)}
              </p>

              <p class="text-xs text-gray-400 mt-0.5">
                ${escapeHTML(getCategoryLabel(trans.category))}
              </p>
            </div>

          </div>
        </td>

        <td class="p-4">
          <span class="text-sm font-semibold
            ${isIncome ? 'text-emerald-700' : 'text-gray-800'}">
            ${isIncome ? '+' : '-'}₹${Number(trans.amount).toLocaleString('en-IN')}
          </span>
        </td>

        <td class="p-4">

          <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full
            text-xs font-medium
            ${isIncome
        ? 'bg-emerald-50 text-emerald-700'
        : 'bg-red-50 text-red-600'}">

            <span class="w-1.5 h-1.5 rounded-full
              ${isIncome ? 'bg-emerald-600' : 'bg-red-500'}">
            </span>

            ${isIncome ? 'Income' : 'Expense'}

          </span>

        </td>

        <td class="p-4 text-sm text-gray-500">
          ${escapeHTML(trans.date)}
        </td>

        <td class="p-4">
          <div class="flex items-center gap-2">
            <a
              href="./transactionform.html?id=${trans.id}"
              class="inline-flex items-center justify-center w-8 h-8 rounded-lg
                text-gray-400 hover:text-green-700 hover:bg-green-50
                transition-colors duration-200"
              title="Edit transaction"
            >
              <i class="fa-solid fa-pen text-xs"></i>
            </a>

            <button
              onclick="deleteTransaction(${trans.id})"
              class="inline-flex items-center justify-center w-8 h-8 rounded-lg
                text-gray-400 hover:text-red-600 hover:bg-red-50
                transition-colors duration-200"
              title="Delete transaction"
            >
              <i class="fa-solid fa-trash text-xs"></i>
            </button>

          </div>

        </td>

      </tr>
    `;
  });
}
document.getElementById('typeFilter').addEventListener('change', displayTransactionList);
document.getElementById('categoryFilter').addEventListener('change', displayTransactionList);
document.getElementById('startDate').addEventListener('change', displayTransactionList);
document.getElementById('endDate').addEventListener('change', displayTransactionList);
document.getElementById('sortFilter').addEventListener('change', displayTransactionList);

function calculateTransactions() {
  const balance = document.getElementById('balance');
  const totalincome = document.getElementById('totalincome');
  const totalexpense = document.getElementById('totalexpense');

  const incomings = transactions.filter(trans => trans.type === 'income');
  const expenses = transactions.filter(trans => trans.type === 'expense');

  const incomeResult = Math.round(incomings.reduce((sum, trans) => sum + Number(trans.amount), 0) * 100) / 100;
  const expenseResult = Math.round(expenses.reduce((sum, trans) => sum + Number(trans.amount), 0) * 100) / 100;
  const totalBalance = Math.round((incomeResult - expenseResult) * 100) / 100;

  if (totalincome) {
    totalincome.textContent = `₹${incomeResult.toLocaleString('en-IN')}`;
  }

  if (totalexpense) {
    totalexpense.textContent = `₹${expenseResult.toLocaleString('en-IN')}`;
  }

  if (balance) {
    balance.textContent =
      `${totalBalance < 0 ? '-' : ''}₹${Math.abs(totalBalance).toLocaleString('en-IN')}`;
  }
  const card = document.querySelector('.balance-card');
  const negative = totalBalance < 0;

  if (card) {
    const description = card.querySelector('.summary-description');

    if (description) {
      description.textContent = negative
        ? "You've spent more than you've received"
        : 'Your current available balance';
    }
    card.querySelector('.summary-status').innerHTML =
      `<i class="fa-solid fa-circle"></i> ${negative ? 'Overspent' : 'Available'}`;
  }


}


function deleteTransaction(id) {
  if (!confirm('Delete this transaction?')) return;

  transactions = transactions.filter(
    trans => trans.id != id
  );

  try {
    localStorage.setItem('transactions', JSON.stringify(transactions));
  } catch (error) {
    console.error('Could not save:', error);
    alert('Unable to delete. Please check your browser storage.');
    return;
  }

  calculateTransactions();
  displayTransactionList();
  displaySpendingChart();
  displayCategoryChart();
}


function getMonthlySpending() {
  const monthlySpending = {};
  const today = new Date();
  for (let i = 5; i >= 0; i--) {
    const date = new Date(
      today.getFullYear(),
      today.getMonth() - i,
      1
    );

    const month = date.toLocaleString('default', {
      month: 'short'
    });

    const year = date.getFullYear();

    const key = `${year}-${date.getMonth()}`;

    monthlySpending[key] = {
      label: `${month} ${year}`,
      amount: 0
    };
  }

  transactions
    .filter(trans => trans.type === 'expense')
    .forEach(trans => {
      const [tYear, tMonth] = String(trans.date).split('-').map(Number);
      const key = `${tYear}-${tMonth - 1}`;
      if (monthlySpending[key]) {
        monthlySpending[key].amount += Number(trans.amount);
      }
    });

  return monthlySpending;
}
const lineRevealPlugin = {
  id: 'lineReveal',
  beforeInit(chart) {
    chart.revealProgress = 0;
  },
  beforeDatasetsDraw(chart) {
    if (chart.config.type !== 'line') {
      return;
    }
    const { ctx, chartArea } = chart;
    if (!chartArea) {
      return;
    }
    ctx.save();
    const paddingX = 12;
    const paddingY = 20;
    const revealWidth =
      (chartArea.width + paddingX * 2) *
      chart.revealProgress;
    ctx.beginPath();
    ctx.rect(
      chartArea.left - paddingX,
      chartArea.top - paddingY,
      revealWidth,
      chartArea.height + paddingY * 2
    );
    ctx.clip();
    chart._lineRevealSaved = true;
  },

  afterDatasetsDraw(chart) {
    if (chart.config.type !== 'line') {
      return;
    }
    if (!chart._lineRevealSaved) {
      return;
    }

    chart.ctx.restore();
    chart._lineRevealSaved = false;
  }
};

Chart.register(lineRevealPlugin);


let spendingChartInstance = null;

function displaySpendingChart() {
  const emptyState = document.getElementById('spendingEmptyState');
  const chartCanvas = document.getElementById('spendingChart');

  if (!chartCanvas) return;

  const hasExpenses = transactions.some(
    trans => trans.type === 'expense' && Number(trans.amount) > 0
  );

  if (emptyState) {
    emptyState.hidden = hasExpenses;
  }

  chartCanvas.style.display = hasExpenses ? 'block' : 'none';


  if (spendingChartInstance) {
    spendingChartInstance.destroy();
    spendingChartInstance = null;
  }


  if (!hasExpenses) {
    return;
  }

  const monthlySpending = getMonthlySpending();
  const months = Object.values(monthlySpending);

  const labels = months.map(month => month.label);
  const amounts = months.map(month => month.amount);

  const ctx = chartCanvas.getContext('2d');

  spendingChartInstance = new Chart(ctx, {
    type: 'line',

    data: {
      labels: labels,

      datasets: [{
        label: 'Spending',
        data: amounts,

        borderWidth: 3,

        borderColor: function (context) {
          const chart = context.chart;
          const { ctx, chartArea } = chart;

          if (!chartArea) return '#176B5B';

          const gradient = ctx.createLinearGradient(
            chartArea.left, 0, chartArea.right, 0
          );

          gradient.addColorStop(0, '#C2540F');
          gradient.addColorStop(0.5, '#F26B1D');
          gradient.addColorStop(1, '#FB923C');

          return gradient;
        },

        backgroundColor: function (context) {
          const chart = context.chart;
          const { ctx, chartArea } = chart;

          if (!chartArea) {
            return 'rgba(23, 107, 91, 0.08)';
          }

          const gradient = ctx.createLinearGradient(
            0, chartArea.top, 0, chartArea.bottom
          );

          gradient.addColorStop(0, 'rgba(242, 107, 29, 0.22)');
          gradient.addColorStop(0.55, 'rgba(242, 107, 29, 0.07)');
          gradient.addColorStop(1, 'rgba(242, 107, 29, 0.00)');

          return gradient;
        },

        fill: true,
        tension: 0.42,

        pointRadius: 4,
        pointHoverRadius: 7,

        pointBackgroundColor: '#FFFFFF',
        pointBorderColor: '#F26B1D',
        pointHoverBackgroundColor: '#F26B1D',
        pointHoverBorderColor: '#FFFFFF',
        pointHoverBorderWidth: 3
      }]
    },

    options: {
      responsive: true,
      maintainAspectRatio: false,

      interaction: {
        intersect: false,
        mode: 'index'
      },

      animation: false,

      plugins: {
        legend: {
          display: false
        },

        tooltip: {
          backgroundColor: '#2B1A12',
          titleColor: '#FFFFFF',
          bodyColor: '#FFD9BD',

          padding: 12,
          cornerRadius: 10,
          displayColors: false,

          titleFont: {
            family: 'Outfit',
            size: 12,
            weight: '600'
          },

          bodyFont: {
            family: 'Outfit',
            size: 14,
            weight: '600'
          },

          callbacks: {
            label: function (context) {
              return `₹${Number(context.raw).toLocaleString('en-IN')}`;
            }
          }
        }
      },

      scales: {
        y: {
          beginAtZero: true,

          border: {
            display: false
          },

          ticks: {
            color: '#8A6A58',

            font: {
              family: 'Outfit',
              size: 11
            },

            padding: 8,

            callback: function (value) {
              return '₹' + Number(value).toLocaleString('en-IN');
            }
          },

          grid: {
            color: 'rgba(122, 46, 14, 0.08)',
            drawTicks: false
          }
        },

        x: {
          border: {
            display: false
          },

          ticks: {
            color: '#8A6A58',

            font: {
              family: 'Outfit',
              size: 11
            },

            padding: 8
          },

          grid: {
            display: false
          }
        }
      }
    }
  });

  const chart = spendingChartInstance;
  const duration = 1600;
  const startTime = performance.now();

  function revealLine(now) {
    if (spendingChartInstance !== chart) return;

    const progress = Math.min(
      (now - startTime) / duration,
      1
    );

    const easedProgress = 1 - Math.pow(1 - progress, 4);

    chart.revealProgress = easedProgress;
    chart.draw();

    if (progress < 1) {
      requestAnimationFrame(revealLine);
    }
  }

  requestAnimationFrame(revealLine);
}


let categoryChartInstance = null;


function displayCategoryChart() {


  const categoryCanvas =
    document.getElementById("categoryChart");

  if (!categoryCanvas) return;

  categoryCanvas.onmouseleave = function () {
    const infoCard =
      document.getElementById("categoryInfoCard");

    if (infoCard) {
      infoCard.classList.remove("active");
    }

    if (categoryChartInstance) {
      categoryChartInstance.setActiveElements([]);
      categoryChartInstance.draw();
    }
  };

  const categoryData = {};

  transactions
    .filter(transaction => transaction.type === "expense")
    .forEach(transaction => {
      const category = transaction.category;

      if (!categoryData[category]) {
        categoryData[category] = 0;
      }

      categoryData[category] += Number(transaction.amount);
    });

  const labels = Object.keys(categoryData).map(getCategoryLabel);
  const values = Object.values(categoryData);

  const categoryEmptyState = document.getElementById(
    "categoryEmptyState"
  );

  const hasCategoryData = values.some(amount => amount > 0);

  if (categoryEmptyState) {
    categoryEmptyState.hidden = hasCategoryData;
  }

  categoryCanvas.style.display =
    hasCategoryData ? "block" : "none";

  const categoryColors = [
    "#E96524",
    "#B83B2E",
    "#F5B544",
    "#718A72",
    "#D98265",
    "#8C604A",
    "#E9C9A5",
    "#A84D37",
    "#6B8E9B",
    "#B5838D"
  ];

  if (!hasCategoryData) {
    renderCategoryLegend([], categoryColors);

    if (categoryChartInstance) {
      categoryChartInstance.destroy();
      categoryChartInstance = null;
    }
        categoryCanvas.style.display = "none";

    const infoCard =
      document.getElementById("categoryInfoCard");

    if (infoCard) {
      infoCard.classList.remove("active");
    }

    return;
  }

  renderCategoryLegend(labels, categoryColors);

  if (!categoryChartInstance) {
    categoryChartInstance = new Chart(categoryCanvas, {
      type: "doughnut",

      data: {
        labels: labels,
        datasets: [{
          data: values,
          backgroundColor: categoryColors,
          borderWidth: 4,
          borderColor: "#FFFFFF",
          hoverOffset: 14,
          spacing: 2
        }]
      },

      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: "74%",

        rotation: -90,
        circumference: 0,
        animation: false,

        plugins: {
          legend: {
            display: false
          },

          tooltip: {
            enabled: false
          }
        },

        interaction: {
          mode: "nearest",
          intersect: true
        },

        onHover: function (event, elements) {
          const chart = categoryChartInstance;

          const infoCard = document.getElementById(
            "categoryInfoCard"
          );

          if (!chart || !infoCard) return;

          let index = elements.length > 0
            ? elements[0].index
            : -1;

          if (
            index === -1 &&
            chart.data.labels.length === 1
          ) {
            const arc =
              chart.getDatasetMeta(0).data[0];

            if (arc) {
              const dx = event.x - arc.x;
              const dy = event.y - arc.y;

              const distance = Math.sqrt(
                dx * dx + dy * dy
              );

              if (
                distance >= arc.innerRadius &&
                distance <= arc.outerRadius
              ) {
                index = 0;
              }
            }
          }

          if (index === -1) {
            infoCard.classList.remove("active");
            chart.setActiveElements([]);
            chart.draw();
            return;
          }

          const currentLabels = chart.data.labels;
          const currentValues =
            chart.data.datasets[0].data;

          const colors =
            chart.data.datasets[0].backgroundColor;

          chart.setActiveElements([
            {
              datasetIndex: 0,
              index: index
            }
          ]);

          chart.draw();

          showCategoryInfo(
            currentLabels[index],
            currentValues[index],
            currentValues,
            Array.isArray(colors)
              ? colors[index]
              : colors
          );

          positionCategoryInfo({ index: index });
        }
      }
    });

    const chart = categoryChartInstance;
    const duration = 1800;

    chart.options.animation = {
      duration: duration,
      easing: "easeOutCubic"
    };

    chart.options.rotation = -90;
    chart.options.circumference = 0;

    chart.update("none");

    setTimeout(() => {
      chart.options.rotation = 270;
      chart.options.circumference = 360;
      chart.update();
    }, 50);

    return;
  }

  const chart = categoryChartInstance;
  chart.data.labels = labels;
  chart.data.datasets[0].data = values;
  chart.data.datasets[0].backgroundColor = categoryColors;
  chart.options.rotation = -90;
  chart.options.circumference = 0;
  chart.options.animation = false;

  chart.update("none");

  setTimeout(() => {
    chart.options.animation = {
      duration: 1800,
      easing: "easeOutCubic"
    };

    chart.options.rotation = 270;
    chart.options.circumference = 360;

    chart.update();
  }, 50);
}

function showCategoryInfo(category, amount, allValues, color) {

  const infoCard =
    document.getElementById("categoryInfoCard");

  const categoryElement =
    document.getElementById("infoCardCategory");

  const amountElement =
    document.getElementById("infoCardAmount");

  const percentageElement =
    document.getElementById("infoCardPercentage");

  const dot =
    document.getElementById("infoCardDot");

  const total =
    allValues.reduce((sum, value) => sum + value, 0);

  const percentage =
    total === 0
      ? 0
      : Math.round((amount / total) * 100);

  categoryElement.textContent = category;

  amountElement.textContent =
    `₹${amount.toLocaleString("en-IN")}`;

  percentageElement.textContent =
    `${percentage}% of spending`;

  dot.style.backgroundColor = color;

  infoCard.classList.add("active");
}

function positionCategoryInfo(element) {

  const infoCard =
    document.getElementById("categoryInfoCard");

  const stage =
    document.querySelector(".category-chart-stage");

  if (!infoCard || !stage || !element) return;

  const meta =
    categoryChartInstance.getDatasetMeta(0);

  const arc =
    meta.data[element.index];

  if (!arc) return;

  const angle =
    arc.endAngle - arc.startAngle >= Math.PI * 2 - 0.01
      ? -Math.PI / 2
      : (arc.startAngle + arc.endAngle) / 2;
  const radius =
    arc.outerRadius + 35;

  const x =
    arc.x + Math.cos(angle) * radius;

  const y =
    arc.y + Math.sin(angle) * radius;

  const cardWidth =
    infoCard.offsetWidth;

  const cardHeight =
    infoCard.offsetHeight;

  const padding = 12;

  const safeX = Math.max(
    cardWidth / 2 + padding,
    Math.min(
      x,
      stage.clientWidth - cardWidth / 2 - padding
    )
  );

  const safeY = Math.max(
    cardHeight / 2 + padding,
    Math.min(
      y,
      stage.clientHeight - cardHeight / 2 - padding
    )
  );

  infoCard.style.left = `${safeX}px`;
  infoCard.style.top = `${safeY}px`;
}


function renderCategoryLegend(labels, colors) {
  const legend = document.getElementById("categoryLegend");

  if (!legend) return;

  legend.innerHTML = "";

  labels.forEach((label, index) => {
    const item = document.createElement("div");
    item.className = "category-legend-item";

    const dot = document.createElement("span");
    dot.className = "category-legend-dot";
    dot.style.backgroundColor = colors[index];

    const name = document.createElement("span");
    name.className = "category-legend-name";
    name.textContent = label;

    item.append(dot, name);
    legend.appendChild(item);
  });
}


const menuToggle = document.getElementById('menuToggle');
const mainNav = document.getElementById('mainNav');

if (menuToggle && mainNav) {
  menuToggle.addEventListener('click', () => {
    const isOpen = mainNav.classList.toggle('is-open');

    menuToggle.setAttribute('aria-expanded', String(isOpen));
    menuToggle.setAttribute(
      'aria-label',
      isOpen ? 'Close navigation menu' : 'Open navigation menu'
    );

    menuToggle.innerHTML = isOpen
      ? '<i class="fa-solid fa-xmark"></i>'
      : '<i class="fa-solid fa-bars"></i>';
  });

  mainNav.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      mainNav.classList.remove('is-open');
      menuToggle.setAttribute('aria-expanded', 'false');
      menuToggle.setAttribute('aria-label', 'Open navigation menu');
      menuToggle.innerHTML = '<i class="fa-solid fa-bars"></i>';
    });
  });
}


setToggleIcon();
calculateTransactions();
displayTransactionList();
displaySpendingChart();
displayCategoryChart();
