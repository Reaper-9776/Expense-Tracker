// Initialize app
let expenses = [];
let totalBalance = 0;

// Category icons mapping
const categoryIcons = {
    food: '🍔',
    transport: '🚗',
    shopping: '🛍️',
    entertainment: '🎬',
    bills: '💡',
    other: '📦'
};

// Load data from localStorage on page load
document.addEventListener('DOMContentLoaded', () => {
    loadFromLocalStorage();
    updateBalance();
    setDefaultDate();
});

// Elements
const mainScreen = document.getElementById('mainScreen');
const historyScreen = document.getElementById('historyScreen');
const addExpenseModal = document.getElementById('addExpenseModal');
const addExpenseBtn = document.getElementById('addExpenseBtn');
const viewHistoryBtn = document.getElementById('viewHistoryBtn');
const closeModal = document.getElementById('closeModal');
const backBtn = document.getElementById('backBtn');
const expenseForm = document.getElementById('expenseForm');
const successMessage = document.getElementById('successMessage');
const filterCategory = document.getElementById('filterCategory');

// Event Listeners
addExpenseBtn.addEventListener('click', () => {
    addExpenseModal.classList.add('active');
});

closeModal.addEventListener('click', () => {
    addExpenseModal.classList.remove('active');
    expenseForm.reset();
    setDefaultDate();
});

// Close modal when clicking outside
addExpenseModal.addEventListener('click', (e) => {
    if (e.target === addExpenseModal) {
        addExpenseModal.classList.remove('active');
        expenseForm.reset();
        setDefaultDate();
    }
});

viewHistoryBtn.addEventListener('click', () => {
    showScreen('history');
    renderExpenses();
});

backBtn.addEventListener('click', () => {
    showScreen('main');
});

expenseForm.addEventListener('submit', (e) => {
    e.preventDefault();
    addExpense();
});

filterCategory.addEventListener('change', () => {
    renderExpenses();
});

// Functions
function showScreen(screen) {
    mainScreen.classList.remove('active');
    historyScreen.classList.remove('active');
    
    if (screen === 'main') {
        mainScreen.classList.add('active');
    } else if (screen === 'history') {
        historyScreen.classList.add('active');
    }
}

function setDefaultDate() {
    const dateInput = document.getElementById('date');
    const today = new Date().toISOString().split('T')[0];
    dateInput.value = today;
}

function addExpense() {
    const amount = parseFloat(document.getElementById('amount').value);
    const category = document.getElementById('category').value;
    const note = document.getElementById('note').value;
    const date = document.getElementById('date').value;
    
    const expense = {
        id: Date.now(),
        amount: amount,
        category: category,
        note: note,
        date: date,
        timestamp: new Date().toISOString()
    };
    
    expenses.push(expense);
    totalBalance -= amount;
    
    saveToLocalStorage();
    updateBalance();
    
    // Close modal and reset form
    addExpenseModal.classList.remove('active');
    expenseForm.reset();
    setDefaultDate();
    
    // Show success message
    showSuccessMessage();
}

function updateBalance() {
    const balanceElement = document.getElementById('totalBalance');
    balanceElement.textContent = `$${totalBalance.toFixed(2)}`;
}

function renderExpenses() {
    const expenseList = document.getElementById('expenseList');
    const emptyState = document.getElementById('emptyState');
    const filter = filterCategory.value;
    
    let filteredExpenses = expenses;
    if (filter !== 'all') {
        filteredExpenses = expenses.filter(exp => exp.category === filter);
    }
    
    if (filteredExpenses.length === 0) {
        expenseList.style.display = 'none';
        emptyState.style.display = 'block';
        return;
    }
    
    expenseList.style.display = 'flex';
    emptyState.style.display = 'none';
    
    // Sort by date (newest first)
    filteredExpenses.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    expenseList.innerHTML = filteredExpenses.map(expense => `
        <div class="expense-item">
            <div class="expense-info">
                <div class="expense-category">
                    <span class="icon">${categoryIcons[expense.category]}</span>
                    <span class="category-name">${expense.category}</span>
                </div>
                ${expense.note ? `<div class="expense-note">${expense.note}</div>` : ''}
                <div class="expense-date">${formatDate(expense.date)}</div>
            </div>
            <div class="expense-amount">-$${expense.amount.toFixed(2)}</div>
            <button class="delete-btn" onclick="deleteExpense(${expense.id})">Delete</button>
        </div>
    `).join('');
}

function deleteExpense(id) {
    const expense = expenses.find(exp => exp.id === id);
    if (expense) {
        totalBalance += expense.amount;
        expenses = expenses.filter(exp => exp.id !== id);
        saveToLocalStorage();
        updateBalance();
        renderExpenses();
        showSuccessMessage('Expense deleted successfully!');
    }
}

function formatDate(dateString) {
    const date = new Date(dateString);
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
}

function showSuccessMessage(message = 'Expense saved successfully!') {
    const successMsg = document.getElementById('successMessage');
    successMsg.querySelector('p').textContent = message;
    successMsg.classList.add('show');
    
    setTimeout(() => {
        successMsg.classList.remove('show');
    }, 3000);
}

function saveToLocalStorage() {
    localStorage.setItem('expenses', JSON.stringify(expenses));
    localStorage.setItem('totalBalance', totalBalance.toString());
}

function loadFromLocalStorage() {
    const savedExpenses = localStorage.getItem('expenses');
    const savedBalance = localStorage.getItem('totalBalance');
    
    if (savedExpenses) {
        expenses = JSON.parse(savedExpenses);
    }
    
    if (savedBalance) {
        totalBalance = parseFloat(savedBalance);
    } else {
        // Set initial balance if no data exists
        totalBalance = 2450;
        saveToLocalStorage();
    }
}
