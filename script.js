const expenses = [];
const chartColors = ['#4f46e5', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#14b8a6'];

const form = document.getElementById('expense-form');
const nameInput = document.getElementById('name');
const categoryInput = document.getElementById('category');
const amountInput = document.getElementById('amount');
const totalAmount = document.getElementById('total-amount');
const topCategory = document.getElementById('top-category');
const expenseCount = document.getElementById('expense-count');
const categorySummary = document.getElementById('category-summary');
const expenseTableBody = document.getElementById('expense-table-body');
const chartCanvas = document.getElementById('expense-chart');
const ctx = chartCanvas.getContext('2d');

function drawChart(categoryTotals) {
  const entries = Object.entries(categoryTotals);
  const total = entries.reduce((sum, [, value]) => sum + value, 0);

  if (!entries.length || total === 0) {
    ctx.clearRect(0, 0, chartCanvas.width, chartCanvas.height);
    ctx.fillStyle = '#9ca3af';
    ctx.font = '16px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('No data', 150, 155);
    return;
  }

  let startAngle = -Math.PI / 2;
  ctx.clearRect(0, 0, chartCanvas.width, chartCanvas.height);

  entries.forEach(([category, value], index) => {
    const sliceAngle = (value / total) * Math.PI * 2;
    ctx.beginPath();
    ctx.moveTo(150, 150);
    ctx.arc(150, 150, 110, startAngle, startAngle + sliceAngle);
    ctx.closePath();
    ctx.fillStyle = chartColors[index % chartColors.length];
    ctx.fill();
    startAngle += sliceAngle;
  });

  ctx.beginPath();
  ctx.arc(150, 150, 55, 0, Math.PI * 2);
  ctx.fillStyle = '#ffffff';
  ctx.fill();

  ctx.fillStyle = '#111827';
  ctx.font = 'bold 18px Arial';
  ctx.textAlign = 'center';
  ctx.fillText('Total', 150, 145);
  ctx.font = 'bold 20px Arial';
  ctx.fillText(`₹${total.toFixed(2)}`, 150, 170);
}

function updateSummary() {
  const total = expenses.reduce((sum, item) => sum + item.amount, 0);
  totalAmount.textContent = `₹${total.toFixed(2)}`;
  expenseCount.textContent = expenses.length;

  const categoryTotals = {};
  expenses.forEach((item) => {
    categoryTotals[item.category] = (categoryTotals[item.category] || 0) + item.amount;
  });

  const top = Object.entries(categoryTotals).sort((a, b) => b[1] - a[1])[0];
  topCategory.textContent = top ? top[0] : '-';

  categorySummary.innerHTML = '';
  if (Object.keys(categoryTotals).length === 0) {
    categorySummary.innerHTML = '<p>No categories yet.</p>';
    drawChart({});
    return;
  }

  const maxValue = Math.max(...Object.values(categoryTotals));

  Object.entries(categoryTotals)
    .sort((a, b) => b[1] - a[1])
    .forEach(([category, value], index) => {
      const row = document.createElement('div');
      row.className = 'category-row';

      const label = document.createElement('div');
      label.className = 'category-label';
      label.textContent = category;

      const barWrap = document.createElement('div');
      barWrap.className = 'bar-wrap';

      const bar = document.createElement('div');
      bar.className = 'bar';
      bar.style.width = `${(value / maxValue) * 100}%`;
      bar.style.background = chartColors[index % chartColors.length];

      const amount = document.createElement('span');
      amount.className = 'category-value';
      amount.textContent = `₹${value.toFixed(2)}`;

      barWrap.appendChild(bar);
      row.appendChild(label);
      row.appendChild(barWrap);
      row.appendChild(amount);
      categorySummary.appendChild(row);
    });

  drawChart(categoryTotals);
}

function renderTable() {
  expenseTableBody.innerHTML = '';

  if (expenses.length === 0) {
    expenseTableBody.innerHTML = '<tr><td colspan="4">No expenses added yet.</td></tr>';
    return;
  }

  expenses.forEach((expense, index) => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${expense.name}</td>
      <td>${expense.category}</td>
      <td>₹${expense.amount.toFixed(2)}</td>
      <td><button class="delete-btn" data-index="${index}">Delete</button></td>
    `;
    expenseTableBody.appendChild(row);
  });

  document.querySelectorAll('.delete-btn').forEach((button) => {
    button.addEventListener('click', function () {
      const index = Number(this.dataset.index);
      expenses.splice(index, 1);
      updateSummary();
      renderTable();
    });
  });
}

form.addEventListener('submit', function (event) {
  event.preventDefault();

  const name = nameInput.value.trim();
  const category = categoryInput.value.trim();
  const amountVal = Number(amountInput.value);

  if (!name || !category || !amountVal || amountVal <= 0) {
    alert('Please enter valid expense details.');
    return;
  }

  expenses.push({ name, category, amount: amountVal });
  updateSummary();
  renderTable();
  form.reset();
  nameInput.focus();
});

updateSummary();
renderTable();
