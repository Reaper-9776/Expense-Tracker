// Data Structure
let users = JSON.parse(localStorage.getItem('users')) || [];
let currentUser = null;
let transactions = [];

// DOM Elements
const loginPage = document.getElementById('loginPage');
const registerPage = document.getElementById('registerPage');
const mainApp = document.getElementById('mainApp');
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');
const showRegisterLink = document.getElementById('showRegister');
const showLoginLink = document.getElementById('showLogin');
const logoutBtn = document.getElementById('logoutBtn');
const userName = document.getElementById('userName');
const totalBalance = document.getElementById('totalBalance');
const addExpenseBtn = document.getElementById('addExpenseBtn');
const addIncomeBtn = document.getElementById('addIncomeBtn');
const expenseModal = document.getElementById('expenseModal');
const incomeModal = document.getElementById('incomeModal');
const closeExpenseModal = document.getElementById('closeExpenseModal');
const closeIncomeModal = document.getElementById('closeIncomeModal');
const expenseForm = document.getElementById('expenseForm');
const incomeForm = document.getElementById('incomeForm');
const recentList = document.getElementById('recentList');
const viewAllBtn = document.getElementById('viewAllBtn');
const historyPage = document.getElementById('historyPage');
const backToMainBtn = document.getElementById('backToMainBtn');
const historyList = document.getElementById('historyList');
const filterType = document.getElementById('filterType');
const filterCategory = document.getElementById('filterCategory');
const toast = document.getElementById('toast');
const themeToggle = document.getElementById('themeToggle');

// Theme Toggle
themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    const isDark = document.body.classList.contains('dark-mode');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    themeToggle.querySelector('.theme-icon').textContent = isDark ? '☀️' : '🌙';
});

// Load saved theme
const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'dark') {
    document.body.classList.add('dark-mode');
    themeToggle.querySelector('.theme-icon').textContent = '☀️';
}

// Show Toast
function showToast(message, type = 'success') {
    toast.textContent = message;
    toast.className = `toast show ${type}`;
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// Switch Pages
showRegisterLink.addEventListener('click', (e) => {
    e.preventDefault();
    loginPage.style.display = 'none';
    registerPage.style.display = 'flex';
});

showLoginLink.addEventListener('click', (e) => {
    e.preventDefault();
    registerPage.style.display = 'none';
    loginPage.style.display = 'flex';
});

// Register
registerForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const username = document.getElementById('registerUsername').value.trim();
    const password = document.getElementById('registerPassword').value;
    const confirmPassword = document.getElementById('registerConfirmPassword').value;

    if (password !== confirmPassword) {
        showToast('Passwords do not match!', 'error');
        return;
    }

    if (users.find(u => u.username.toLowerCase() === username.toLowerCase())) {
        showToast('Username already exists!', 'error');
        return;
    }

    users.push({ username, password, transactions: [] });
    localStorage.setItem('users', JSON.stringify(users));
    showToast('Account created successfully!');
    registerForm.reset();
    registerPage.style.display = 'none';
    loginPage.style.display = 'flex';
});

// Login
loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const username = document.getElementById('loginUsername').value.trim();
    const password = document.getElementById('loginPassword').value;

    const user = users.find(
        u => u.username.toLowerCase() === username.toLowerCase() && u.password === password
    );

    if (user) {
        currentUser = user;
        localStorage.setItem('currentUser', currentUser.username);
        transactions = currentUser.transactions || [];
        showMainApp();
        showToast('Welcome back!');
        loginForm.reset();
    } else {
        showToast('Invalid username or password!', 'error');
    }
});

// Logout
logoutBtn.addEventListener('click', () => {
    currentUser = null;
    transactions = [];
    localStorage.removeItem('currentUser');
    mainApp.style.display = 'none';
    historyPage.style.display = 'none';
    loginPage.style.display = 'flex';
    showToast('Logged out successfully!');
});

// Show Main App
function showMainApp() {
    loginPage.style.display = 'none';
    registerPage.style.display = 'none';
    mainApp.style.display = 'block';
    historyPage.style.display = 'none';
    userName.textContent = currentUser.username;
    updateBalance();
    displayRecentTransactions();
}

// Check Logged In User
function checkLoggedInUser() {
    const savedUsername = localStorage.getItem('currentUser');
    if (!savedUsername) return;

    const user = users.find(u => u.username === savedUsername);
    if (user) {
        currentUser = user;
        transactions = currentUser.transactions || [];
        showMainApp();
    }
}

checkLoggedInUser();

// Update Balance
function updateBalance() {
    const balance = transactions.reduce((sum, transaction) => {
        if (transaction.type === 'income') {
            return sum + transaction.amount;
        } else {
            return sum - transaction.amount;
        }
    }, 0);

    totalBalance.textContent = `$${balance.toFixed(2)}`;
}

// Display Recent Transactions
function displayRecentTransactions() {
    const recentTransactions = [...transactions].reverse().slice(0, 5);

    if (recentTransactions.length === 0) {
        recentList.innerHTML = `<p style="text-align:center; color: var(--text-secondary);">No transactions yet</p>`;
        return;
    }

    recentList.innerHTML = recentTransactions.map(transaction => createTransactionHTML(transaction)).join('');
}

// Display All Transactions
function displayAllTransactions() {
    let filteredTransactions = [...transactions];

    if (filterType.value !== 'all') {
        filteredTransactions = filteredTransactions.filter(t => t.type === filterType.value);
    }

    if (filterCategory.value !== 'all') {
        filteredTransactions = filteredTransactions.filter(t => t.category === filterCategory.value);
    }

    filteredTransactions.reverse();

    if (filteredTransactions.length === 0) {
        historyList.innerHTML = `<p style="text-align:center; color: var(--text-secondary);">No transactions found</p>`;
        return;
    }

    historyList.innerHTML = filteredTransactions.map(transaction => createTransactionHTML(transaction)).join('');
}

// Create Transaction HTML
function createTransactionHTML(transaction) {
    const sign = transaction.type === 'income' ? '+' : '-';
    const amountClass = transaction.type === 'income' ? 'positive' : 'negative';
    const date = new Date(transaction.date).toLocaleDateString();

    return `
        <div class="expense-item ${transaction.type}">
            <div class="expense-info">
                <div class="expense-category">${transaction.category}</div>
                <div class="expense-note">${transaction.note ? transaction.note : 'No note'}</div>
                <div class="expense-date">${date}</div>
            </div>
            <div class="expense-amount ${amountClass}">${sign}$${transaction.amount.toFixed(2)}</div>
            <button class="delete-btn" onclick="deleteTransaction('${transaction.id}')">Delete</button>
        </div>
    `;
}

// Save Transactions
function saveTransactions() {
    if (!currentUser) return;

    const userIndex = users.findIndex(u => u.username === currentUser.username);
    if (userIndex !== -1) {
        users[userIndex].transactions = transactions;
        currentUser = users[userIndex];
        localStorage.setItem('users', JSON.stringify(users));
    }
}

// Add Expense Modal Open/Close
addExpenseBtn.addEventListener('click', () => {
    expenseModal.classList.add('active');
});

closeExpenseModal.addEventListener('click', () => {
    expenseModal.classList.remove('active');
});

addIncomeBtn.addEventListener('click', () => {
    incomeModal.classList.add('active');
});

closeIncomeModal.addEventListener('click', () => {
    incomeModal.classList.remove('active');
});

// Close modal on outside click
window.addEventListener('click', (e) => {
    if (e.target === expenseModal) {
        expenseModal.classList.remove('active');
    }
    if (e.target === incomeModal) {
        incomeModal.classList.remove('active');
    }
});

// Add Expense
expenseForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const amount = parseFloat(document.getElementById('expenseAmount').value);
    const category = document.getElementById('expenseCategory').value;
    const note = document.getElementById('expenseNote').value.trim();

    const newTransaction = {
        id: Date.now().toString(),
        type: 'expense',
        amount: amount,
        category: category,
        note: note,
        date: new Date().toISOString()
    };

    transactions.push(newTransaction);
    saveTransactions();
    updateBalance();
    displayRecentTransactions();
    displayAllTransactions();

    expenseForm.reset();
    expenseModal.classList.remove('active');
    showToast('Expense added successfully!');
});

// Add Income
incomeForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const amount = parseFloat(document.getElementById('incomeAmount').value);
    const category = document.getElementById('incomeCategory').value;
    const note = document.getElementById('incomeNote').value.trim();

    const newTransaction = {
        id: Date.now().toString(),
        type: 'income',
        amount: amount,
        category: category,
        note: note,
        date: new Date().toISOString()
    };

    transactions.push(newTransaction);
    saveTransactions();
    updateBalance();
    displayRecentTransactions();
    displayAllTransactions();

    incomeForm.reset();
    incomeModal.classList.remove('active');
    showToast('Income added successfully!');
});

// Delete Transaction
function deleteTransaction(id) {
    transactions = transactions.filter(transaction => transaction.id !== id);
    saveTransactions();
    updateBalance();
    displayRecentTransactions();
    displayAllTransactions();
    showToast('Transaction deleted successfully!');
}

// View All Transactions
viewAllBtn.addEventListener('click', (e) => {
    e.preventDefault();
    document.querySelector('.recent-section').style.display = 'none';
    document.querySelector('.action-buttons').style.display = 'none';
    historyPage.style.display = 'block';
    displayAllTransactions();
});

// Back To Main
backToMainBtn.addEventListener('click', (e) => {
    e.preventDefault();
    historyPage.style.display = 'none';
    document.querySelector('.recent-section').style.display = 'block';
    document.querySelector('.action-buttons').style.display = 'grid';
});

// Filters
filterType.addEventListener('change', displayAllTransactions);
filterCategory.addEventListener('change', displayAllTransactions);
