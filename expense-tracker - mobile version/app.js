let expenses = [
    { category: 'Food', note: 'Dinner at KFC', amount: 2.49, date: '11/06/25' },
    { category: 'Shopping', note: '', amount: 200, date: '11/06/25' },
    { category: 'Travel', note: 'Bali Tour', amount: 809.01, date: '02/06/25' },
    { category: 'Bills', note: 'AB Bills', amount: 249.5, date: '04/06/25' }
];

let totalBalance = 2450;
let selectedCategoryValue = '';

function showMain() {
    document.getElementById('mainPage').classList.remove('hidden');
    document.getElementById('addExpensePage').classList.add('hidden');
    document.getElementById('historyPage').classList.add('hidden');
    document.getElementById('successPage').classList.add('hidden');
    updateBalance();
}

function showAddExpense() {
    document.getElementById('mainPage').classList.add('hidden');
    document.getElementById('addExpensePage').classList.remove('hidden');
    document.getElementById('expenseForm').reset();
    document.getElementById('selectedCategory').textContent = 'Select category';
    selectedCategoryValue = '';
}

function showHistory() {
    document.getElementById('mainPage').classList.add('hidden');
    document.getElementById('historyPage').classList.remove('hidden');
    renderExpenses();
}

function showSuccess() {
    document.getElementById('addExpensePage').classList.add('hidden');
    document.getElementById('successPage').classList.remove('hidden');
}

function toggleDropdown() {
    document.getElementById('dropdownOptions').classList.toggle('active');
}

function selectCategory(category) {
    selectedCategoryValue = category;
    document.getElementById('selectedCategory').textContent = category;
    document.getElementById('dropdownOptions').classList.remove('active');
}

document.getElementById('expenseForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const amount = parseFloat(document.getElementById('amount').value);
    const note = document.getElementById('note').value;
    
    if (!selectedCategoryValue) {
        alert('Please select a category');
        return;
    }

    const today = new Date();
    const dateStr = `${String(today.getDate()).padStart(2, '0')}/${String(today.getMonth() + 1).padStart(2, '0')}/${String(today.getFullYear()).slice(-2)}`;

    expenses.unshift({
        category: selectedCategoryValue,
        note: note,
        amount: amount,
        date: dateStr
    });

    totalBalance -= amount;
    
    showSuccess();
});

function updateBalance() {
    document.getElementById('totalBalance').textContent = `$${totalBalance.toLocaleString()}`;
}

function renderExpenses() {
    const expensesList = document.getElementById('expensesList');
    const totalSpent = expenses.reduce((sum, exp) => sum + exp.amount, 0);
    
    document.querySelector('.spent-card h3').textContent = `Spent: $${totalSpent.toLocaleString()}`;
    
    expensesList.innerHTML = expenses.map(exp => `
        <div class="expense-item">
            <div class="expense-info">
                <h4>${exp.category}</h4>
                <p>${exp.note}</p>
            </div>
            <div class="expense-amount">
                <h4>$${exp.amount.toFixed(2)}</h4>
                <p>${exp.date}</p>
            </div>
        </div>
    `).join('');
}

// Close dropdown when clicking outside
document.addEventListener('click', function(e) {
    if (!e.target.closest('.dropdown-custom')) {
        document.getElementById('dropdownOptions').classList.remove('active');
    }
});

// Initialize
updateBalance();
