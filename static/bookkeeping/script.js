// --- DOM Elements ---
const authSection = document.getElementById('auth-section');
const loginFormContainer = document.getElementById('login-form-container');
const registerFormContainer = document.getElementById('register-form-container');
const showRegisterFormBtn = document.getElementById('show-register-form');
const showLoginFormBtn = document.getElementById('show-login-form');
const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('register-form');
const loginBtnNav = document.getElementById('login-btn-nav');
const registerBtnNav = document.getElementById('register-btn-nav');
const logoutBtnNav = document.getElementById('logout-btn-nav');
const mainContent = document.getElementById('main-content');
const userEmailDisplay = document.getElementById('user-email-display');
const closeButtons = document.querySelectorAll('.modal .close-btn');

// Sidebar Navigation
const navLinks = document.querySelectorAll('#sidebar nav a');
const contentSections = document.querySelectorAll('.content-section');

// Dashboard Elements
const totalIncomeDisplay = document.getElementById('total-income');
const totalExpensesDisplay = document.getElementById('total-expenses');
const netBalanceDisplay = document.getElementById('net-balance');
const monthlyNetBalanceDisplay = document.getElementById('monthly-net-balance'); // New for monthly balance
const spendingChartCanvas = document.getElementById('spendingChart');
const chartPlaceholder = document.querySelector('.chart-placeholder');
let spendingChartInstance = null; // To hold the Chart.js instance

// Transactions Section
const addTransactionBtn = document.getElementById('add-transaction-btn');
const transactionFormModal = document.getElementById('transaction-form-modal');
const transactionForm = document.getElementById('transaction-form');
const transactionIdInput = document.getElementById('transaction-id');
const transactionTypeInput = document.getElementById('transaction-type');
const transactionCategorySelect = document.getElementById('transaction-category');
const transactionPaymentMethodSelect = document.getElementById('transaction-payment-method'); // Renamed
const transactionAmountInput = document.getElementById('transaction-amount');
const transactionDateInput = document.getElementById('transaction-date');
const transactionNoteInput = document.getElementById('transaction-note');
const transactionPhotoUrlInput = document.getElementById('transaction-photo-url');
const transactionPhotoFileInput = document.getElementById('transaction-photo-file');
const photoPreview = document.getElementById('photo-preview');
const transactionsList = document.getElementById('transactions-list');
const filterTransactionType = document.getElementById('filter-transaction-type');
const filterPaymentMethod = document.getElementById('filter-payment-method'); // New filter
const filterCategory = document.getElementById('filter-category'); // New filter
const filterStartDate = document.getElementById('filter-start-date'); // New date filter
const filterEndDate = document.getElementById('filter-end-date');   // New date filter
const clearDateFilterBtn = document.getElementById('clear-date-filter'); // New button
const searchTransactionsInput = document.getElementById('search-transactions');

// Categories Section
const addCategoryBtn = document.getElementById('add-category-btn');
const categoryFormModal = document.getElementById('category-form-modal');
const categoryForm = document.getElementById('category-form');
const categoryIdInput = document.getElementById('category-id');
const categoryNameInput = document.getElementById('category-name');
const categoryTypeInput = document.getElementById('category-type');
const categoriesList = document.getElementById('categories-list');

// Payment Methods Section (Renamed from Accounts)
const addPaymentMethodBtn = document.getElementById('add-payment-method-btn'); // Renamed
const paymentMethodFormModal = document.getElementById('payment-method-form-modal'); // Renamed
const paymentMethodForm = document.getElementById('payment-method-form'); // Renamed
const paymentMethodIdInput = document.getElementById('payment-method-id'); // Renamed
const paymentMethodNameInput = document.getElementById('payment-method-name'); // Renamed
const paymentMethodBalanceInput = document.getElementById('payment-method-balance'); // Renamed
const paymentMethodsList = document.getElementById('payment-methods-list'); // Renamed

// Budget Section (New)
const addBudgetBtn = document.getElementById('add-budget-btn');
const budgetFormModal = document.getElementById('budget-form-modal');
const budgetForm = document.getElementById('budget-form');
const budgetIdInput = document.getElementById('budget-id');
const budgetCategorySelect = document.getElementById('budget-category');
const budgetAmountInput = document.getElementById('budget-amount');
const budgetMonthInput = document.getElementById('budget-month');
const budgetsList = document.getElementById('budgets-list');

// --- Global Data Storage (Mock - In real app, this would be from a backend) ---
let currentUser = null;
let users = JSON.parse(localStorage.getItem('users')) || {};
let transactions = JSON.parse(localStorage.getItem('transactions')) || [];
let categories = JSON.parse(localStorage.getItem('categories')) || [];
let paymentMethods = JSON.parse(localStorage.getItem('paymentMethods')) || []; // Renamed
let budgets = JSON.parse(localStorage.getItem('budgets')) || []; // New

// --- Helper Functions ---

function saveUsers() {
    localStorage.setItem('users', JSON.stringify(users));
}

function saveTransactions() {
    localStorage.setItem('transactions', JSON.stringify(transactions));
}

function saveCategories() {
    localStorage.setItem('categories', JSON.stringify(categories));
}

function savePaymentMethods() { // Renamed
    localStorage.setItem('paymentMethods', JSON.stringify(paymentMethods)); // Renamed
}

function saveBudgets() { // New
    localStorage.setItem('budgets', JSON.stringify(budgets));
}

function generateUniqueId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

function formatCurrency(amount) {
    return `NT$${parseFloat(amount).toLocaleString('zh-TW', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('zh-TW', { year: 'numeric', month: 'numeric', day: 'numeric' });
}

function formatMonth(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('zh-TW', { year: 'numeric', month: 'long' });
}

function showModal(modalElement) {
    modalElement.classList.remove('hidden');
    modalElement.setAttribute('aria-modal', 'true');
    modalElement.setAttribute('role', 'dialog');
    document.body.classList.add('modal-open'); // Prevent scrolling body
}

function hideModal(modalElement) {
    modalElement.classList.add('hidden');
    modalElement.removeAttribute('aria-modal');
    modalElement.removeAttribute('role');
    document.body.classList.remove('modal-open');
}

function clearForm(formElement) {
    formElement.reset();
    const hiddenInput = formElement.querySelector('input[type="hidden"]');
    if (hiddenInput) {
        hiddenInput.value = ''; // Clear ID for new entry
    }
    // Specific clear for photo preview
    if (formElement.id === 'transaction-form') {
        photoPreview.classList.add('hidden');
        photoPreview.src = '#';
    }
}

function showSection(sectionId) {
    contentSections.forEach(section => {
        section.classList.add('hidden');
    });
    document.getElementById(sectionId).classList.remove('hidden');

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.dataset.section === sectionId.replace('-section', '')) {
            link.classList.add('active');
        }
    });

    // Re-render specific sections when they become active
    if (sectionId === 'dashboard-section') {
        renderDashboard();
    } else if (sectionId === 'transactions-section') {
        renderTransactions();
        populateTransactionForms(); // Ensure categories/payment methods are up-to-date
        populateTransactionFilters(); // Populate filters
    } else if (sectionId === 'categories-section') {
        renderCategories();
    } else if (sectionId === 'payment-methods-section') { // Renamed
        renderPaymentMethods(); // Renamed
    } else if (sectionId === 'budget-section') { // New
        renderBudgets();
        populateBudgetCategorySelect();
    }
}

// --- Auth Functions ---

function login(email, password) {
    if (users[email] && users[email].password === password) {
        currentUser = { email: email, name: users[email].name || email }; // Store user data
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        updateAuthUI();
        showSection('dashboard-section');
        userEmailDisplay.textContent = currentUser.email;
        console.log('Login successful');
        return true;
    }
    console.log('Login failed');
    return false;
}

function register(email, password) {
    if (users[email]) {
        alert('此電子郵件已被註冊。');
        return false;
    }
    users[email] = { password: password, name: email }; // Basic user data
    saveUsers();
    alert('註冊成功！請登入。');
    console.log('Registration successful');
    return true;
}

function logout() {
    currentUser = null;
    localStorage.removeItem('currentUser');
    updateAuthUI();
    // Clear all data associated with the previous user (mock for demonstration)
    transactions = [];
    categories = [];
    paymentMethods = []; // Renamed
    budgets = []; // New
    saveTransactions();
    saveCategories();
    savePaymentMethods(); // Renamed
    saveBudgets(); // New
    spendingChartInstance?.destroy(); // Destroy chart when logging out
    spendingChartCanvas.classList.add('hidden');
    chartPlaceholder.classList.remove('hidden');

    // Show login form again
    authSection.classList.remove('hidden');
    loginFormContainer.classList.remove('hidden');
    registerFormContainer.classList.add('hidden');
    mainContent.classList.add('hidden');
    userEmailDisplay.textContent = '';
    console.log('Logged out');
}

function updateAuthUI() {
    if (currentUser) {
        authSection.classList.add('hidden');
        mainContent.classList.remove('hidden');
        loginBtnNav.classList.add('hidden');
        registerBtnNav.classList.add('hidden');
        logoutBtnNav.classList.remove('hidden');
        userEmailDisplay.textContent = currentUser.email;
    } else {
        authSection.classList.remove('hidden');
        mainContent.classList.add('hidden');
        loginBtnNav.classList.remove('hidden');
        registerBtnNav.classList.remove('hidden');
        logoutBtnNav.classList.add('hidden');
        userEmailDisplay.textContent = '';
    }
}

// --- Data Rendering Functions ---

function renderDashboard() {
    const userTransactions = transactions.filter(t => t.userId === currentUser.email);
    const userCategories = categories.filter(c => c.userId === currentUser.email);

    let totalIncome = 0;
    let totalExpenses = 0;
    let monthlyIncome = 0;
    let monthlyExpenses = 0;
    const spendingByCategory = {};

    const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM

    userTransactions.forEach(t => {
        const amount = parseFloat(t.amount);
        const transactionMonth = t.date.slice(0, 7);

        if (t.type === 'income') {
            totalIncome += amount;
            if (transactionMonth === currentMonth) {
                monthlyIncome += amount;
            }
        } else {
            totalExpenses += amount;
            if (transactionMonth === currentMonth) {
                monthlyExpenses += amount;
            }
            const category = userCategories.find(c => c.id === t.categoryId);
            const categoryName = category ? category.name : '未分類';
            spendingByCategory[categoryName] = (spendingByCategory[categoryName] || 0) + amount;
        }
    });

    const netBalance = totalIncome - totalExpenses;
    const monthlyNetBalance = monthlyIncome - monthlyExpenses;

    totalIncomeDisplay.textContent = formatCurrency(totalIncome);
    totalExpensesDisplay.textContent = formatCurrency(totalExpenses);
    netBalanceDisplay.textContent = formatCurrency(netBalance);
    monthlyNetBalanceDisplay.textContent = formatCurrency(monthlyNetBalance); // Update monthly balance

    renderSpendingChart(spendingByCategory);
}

function renderSpendingChart(data) {
    if (spendingChartInstance) {
        spendingChartInstance.destroy(); // Destroy existing chart
    }

    const labels = Object.keys(data);
    const values = Object.values(data);

    if (values.every(val => val === 0) || values.length === 0) {
        spendingChartCanvas.classList.add('hidden');
        chartPlaceholder.classList.remove('hidden');
        return;
    } else {
        spendingChartCanvas.classList.remove('hidden');
        chartPlaceholder.classList.add('hidden');
    }

    const backgroundColors = [
        '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40', '#E7E9ED', '#8AC926', '#FFCA3A', '#1982C4'
    ];

    spendingChartInstance = new Chart(spendingChartCanvas, {
        type: 'doughnut',
        data: {
            labels: labels,
            datasets: [{
                data: values,
                backgroundColor: backgroundColors.slice(0, labels.length),
                hoverBackgroundColor: backgroundColors.slice(0, labels.length)
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'right',
                    labels: {
                        color: varCss('text-color'),
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            let label = context.label || '';
                            if (label) {
                                label += ': ';
                            }
                            if (context.parsed !== null) {
                                label += formatCurrency(context.parsed);
                            }
                            return label;
                        }
                    }
                }
            }
        }
    });
}

function renderTransactions() {
    transactionsList.innerHTML = ''; // Clear previous entries
    const userTransactions = transactions.filter(t => t.userId === currentUser.email);
    const userCategories = categories.filter(c => c.userId === currentUser.email);
    const userPaymentMethods = paymentMethods.filter(pm => pm.userId === currentUser.email); // Renamed

    // Apply filters and search
    const filteredTransactions = userTransactions.filter(t => {
        const typeMatch = filterTransactionType.value === '' || t.type === filterTransactionType.value;
        const paymentMethodMatch = filterPaymentMethod.value === '' || t.paymentMethodId === filterPaymentMethod.value; // Renamed
        const categoryMatch = filterCategory.value === '' || t.categoryId === filterCategory.value;

        // Date filter
        const transactionDate = new Date(t.date);
        const startDate = filterStartDate.value ? new Date(filterStartDate.value) : null;
        const endDate = filterEndDate.value ? new Date(filterEndDate.value) : null;

        const dateMatch = (!startDate || transactionDate >= startDate) && (!endDate || transactionDate <= endDate);

        // Search (keyword, amount, date)
        const searchLower = searchTransactionsInput.value.toLowerCase();
        const categoryName = userCategories.find(c => c.id === t.categoryId)?.name || '未分類';
        const paymentMethodName = userPaymentMethods.find(pm => pm.id === t.paymentMethodId)?.name || '未指定付款方式'; // Renamed
        const noteMatch = t.note.toLowerCase().includes(searchLower);
        const amountMatch = t.amount.toString().includes(searchLower);
        const dateStringMatch = formatDate(t.date).toLowerCase().includes(searchLower); // Search by formatted date string

        const keywordMatch = categoryName.toLowerCase().includes(searchLower) ||
                             paymentMethodName.toLowerCase().includes(searchLower) ||
                             noteMatch ||
                             amountMatch ||
                             dateStringMatch;

        return typeMatch && paymentMethodMatch && categoryMatch && dateMatch && keywordMatch;
    }).sort((a, b) => new Date(b.date) - new Date(a.date)); // Sort by date, newest first

    if (filteredTransactions.length === 0) {
        transactionsList.innerHTML = '<p class="list-placeholder">尚無任何交易紀錄。</p>';
        return;
    }

    filteredTransactions.forEach(t => {
        const category = userCategories.find(c => c.id === t.categoryId);
        const paymentMethod = userPaymentMethods.find(pm => pm.id === t.paymentMethodId); // Renamed

        const transactionCard = document.createElement('div');
        transactionCard.classList.add('card', 'transaction-card', t.type);
        transactionCard.dataset.id = t.id;

        transactionCard.innerHTML = `
            <div class="card-info">
                <h4>${category ? category.name : '未分類'}</h4>
                <p>付款方式: ${paymentMethod ? paymentMethod.name : '未指定付款方式'} - ${formatDate(t.date)}</p>
                ${t.note ? `<p class="note">${t.note}</p>` : ''}
                ${t.photoUrl ? `<a href="${t.photoUrl}" target="_blank" class="photo-link"><i class="fas fa-image"></i> 單據照片</a>` : ''}
            </div>
            <div class="amount ${t.type}">
                ${t.type === 'expense' ? '-' : '+'}${formatCurrency(t.amount)}
            </div>
            <div class="card-actions">
                <button class="btn btn-secondary btn-edit-transaction"><i class="fas fa-edit"></i></button>
                <button class="btn btn-danger btn-delete-transaction"><i class="fas fa-trash-alt"></i></button>
            </div>
        `;
        transactionsList.appendChild(transactionCard);
    });

    // Add event listeners for edit/delete buttons
    transactionsList.querySelectorAll('.btn-edit-transaction').forEach(button => {
        button.addEventListener('click', (e) => {
            const transactionId = e.target.closest('.transaction-card').dataset.id;
            editTransaction(transactionId);
        });
    });

    transactionsList.querySelectorAll('.btn-delete-transaction').forEach(button => {
        button.addEventListener('click', (e) => {
            const transactionId = e.target.closest('.transaction-card').dataset.id;
            deleteTransaction(transactionId);
        });
    });
}


function renderCategories() {
    categoriesList.innerHTML = '';
    const userCategories = categories.filter(c => c.userId === currentUser.email);

    if (userCategories.length === 0) {
        categoriesList.innerHTML = '<p class="list-placeholder">尚未定義任何分類。</p>';
        return;
    }

    userCategories.forEach(c => {
        const categoryCard = document.createElement('div');
        categoryCard.classList.add('card');
        categoryCard.dataset.id = c.id;
        categoryCard.innerHTML = `
            <div class="card-info">
                <h4>${c.name}</h4>
                <p>類型: ${c.type === 'income' ? '收入' : '支出'}</p>
            </div>
            <div class="card-actions">
                <button class="btn btn-secondary btn-edit-category"><i class="fas fa-edit"></i></button>
                <button class="btn btn-danger btn-delete-category"><i class="fas fa-trash-alt"></i></button>
            </div>
        `;
        categoriesList.appendChild(categoryCard);
    });

    categoriesList.querySelectorAll('.btn-edit-category').forEach(button => {
        button.addEventListener('click', (e) => {
            const categoryId = e.target.closest('.card').dataset.id;
            editCategory(categoryId);
        });
    });

    categoriesList.querySelectorAll('.btn-delete-category').forEach(button => {
        button.addEventListener('click', (e) => {
            const categoryId = e.target.closest('.card').dataset.id;
            deleteCategory(categoryId);
        });
    });
}

function renderPaymentMethods() { // Renamed
    paymentMethodsList.innerHTML = ''; // Renamed
    const userPaymentMethods = paymentMethods.filter(pm => pm.userId === currentUser.email); // Renamed

    if (userPaymentMethods.length === 0) { // Renamed
        paymentMethodsList.innerHTML = '<p class="list-placeholder">尚未設定任何付款方式。</p>'; // Renamed
        return;
    }

    userPaymentMethods.forEach(pm => { // Renamed
        const paymentMethodCard = document.createElement('div'); // Renamed
        paymentMethodCard.classList.add('card'); // Renamed
        paymentMethodCard.dataset.id = pm.id; // Renamed
        paymentMethodCard.innerHTML = `
            <div class="card-info">
                <h4>${pm.name}</h4>
                <p>餘額: ${formatCurrency(pm.balance)}</p>
            </div>
            <div class="card-actions">
                <button class="btn btn-secondary btn-edit-payment-method"><i class="fas fa-edit"></i></button>
                <button class="btn btn-danger btn-delete-payment-method"><i class="fas fa-trash-alt"></i></button>
            </div>
        `;
        paymentMethodsList.appendChild(paymentMethodCard); // Renamed
    });

    paymentMethodsList.querySelectorAll('.btn-edit-payment-method').forEach(button => { // Renamed
        button.addEventListener('click', (e) => {
            const paymentMethodId = e.target.closest('.card').dataset.id; // Renamed
            editPaymentMethod(paymentMethodId); // Renamed
        });
    });

    paymentMethodsList.querySelectorAll('.btn-delete-payment-method').forEach(button => { // Renamed
        button.addEventListener('click', (e) => {
            const paymentMethodId = e.target.closest('.card').dataset.id; // Renamed
            deletePaymentMethod(paymentMethodId); // Renamed
        });
    });
}

// New: Render Budgets
function renderBudgets() {
    budgetsList.innerHTML = '';
    const userBudgets = budgets.filter(b => b.userId === currentUser.email);
    const userCategories = categories.filter(c => c.userId === currentUser.email);
    const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM

    if (userBudgets.length === 0) {
        budgetsList.innerHTML = '<p class="list-placeholder">尚未設定任何預算。</p>';
        return;
    }

    userBudgets.forEach(b => {
        const category = userCategories.find(c => c.id === b.categoryId);
        const categoryName = category ? category.name : '未知分類';

        // Calculate current spending for this budget category and month
        const spentAmount = transactions.filter(t =>
            t.userId === currentUser.email &&
            t.type === 'expense' &&
            t.categoryId === b.categoryId &&
            t.date.slice(0, 7) === b.month // Match budget month
        ).reduce((sum, t) => sum + parseFloat(t.amount), 0);

        const remainingAmount = b.amount - spentAmount;
        const progressPercentage = (spentAmount / b.amount) * 100;
        const isOverBudget = remainingAmount < 0;

        const budgetCard = document.createElement('div');
        budgetCard.classList.add('card', 'budget-card');
        budgetCard.dataset.id = b.id;
        budgetCard.innerHTML = `
            <div class="budget-header">
                <h4>${formatMonth(b.month + '-01')} - ${categoryName} 預算</h4>
                <div class="card-actions">
                    <button class="btn btn-secondary btn-edit-budget"><i class="fas fa-edit"></i></button>
                    <button class="btn btn-danger btn-delete-budget"><i class="fas fa-trash-alt"></i></button>
                </div>
            </div>
            <div class="budget-progress-bar">
                <div class="budget-progress ${isOverBudget ? 'over-budget' : ''}" style="width: ${Math.min(100, progressPercentage)}%;"></div>
            </div>
            <div class="budget-details">
                <span>已花費: ${formatCurrency(spentAmount)}</span>
                <span>預算: ${formatCurrency(b.amount)}</span>
            </div>
            <p class="budget-status">
                ${isOverBudget ?
                    `<span style="color: var(--danger-color); font-weight: bold;">超支: ${formatCurrency(Math.abs(remainingAmount))}</span>` :
                    `剩餘: ${formatCurrency(remainingAmount)}`
                }
            </p>
        `;
        budgetsList.appendChild(budgetCard);
    });

    budgetsList.querySelectorAll('.btn-edit-budget').forEach(button => {
        button.addEventListener('click', (e) => {
            const budgetId = e.target.closest('.card').dataset.id;
            editBudget(budgetId);
        });
    });

    budgetsList.querySelectorAll('.btn-delete-budget').forEach(button => {
        button.addEventListener('click', (e) => {
            const budgetId = e.target.closest('.card').dataset.id;
            deleteBudget(budgetId);
        });
    });
}


// --- CRUD Operations ---

// Transactions
function addOrUpdateTransaction(event) {
    event.preventDefault();

    const id = transactionIdInput.value;
    const type = transactionTypeInput.value;
    const categoryId = transactionCategorySelect.value;
    const paymentMethodId = transactionPaymentMethodSelect.value; // Renamed
    const amount = parseFloat(transactionAmountInput.value);
    const date = transactionDateInput.value;
    const note = transactionNoteInput.value.trim();
    let photoUrl = transactionPhotoUrlInput.value.trim();

    if (!amount || !date || !categoryId || !paymentMethodId) { // Renamed
        alert('請填寫所有必填欄位。');
        return;
    }

    if (!photoUrl && transactionPhotoFileInput.files.length > 0) {
        // Mocking file upload - in real app, this would be uploaded to a server
        const file = transactionPhotoFileInput.files[0];
        const reader = new FileReader();
        reader.onload = (e) => {
            photoUrl = e.target.result; // Data URL for local preview/storage
            completeTransactionSave(id, type, categoryId, paymentMethodId, amount, date, note, photoUrl); // Renamed
        };
        reader.readAsDataURL(file);
    } else {
        completeTransactionSave(id, type, categoryId, paymentMethodId, amount, date, note, photoUrl); // Renamed
    }
}

function completeTransactionSave(id, type, categoryId, paymentMethodId, amount, date, note, photoUrl) { // Renamed
    if (id) {
        // Update existing transaction
        const index = transactions.findIndex(t => t.id === id && t.userId === currentUser.email);
        if (index !== -1) {
            // Adjust old paymentMethod balance
            const oldTransaction = transactions[index];
            const oldPaymentMethod = paymentMethods.find(pm => pm.id === oldTransaction.paymentMethodId && pm.userId === currentUser.email); // Renamed
            if (oldPaymentMethod) {
                if (oldTransaction.type === 'income') oldPaymentMethod.balance -= oldTransaction.amount; // Renamed
                else oldPaymentMethod.balance += oldTransaction.amount; // Renamed
            }

            // Update transaction
            transactions[index] = { id, userId: currentUser.email, type, categoryId, paymentMethodId, amount, date, note, photoUrl }; // Renamed

            // Adjust new paymentMethod balance
            const newPaymentMethod = paymentMethods.find(pm => pm.id === paymentMethodId && pm.userId === currentUser.email); // Renamed
            if (newPaymentMethod) {
                if (type === 'income') newPaymentMethod.balance += amount; // Renamed
                else newPaymentMethod.balance -= amount; // Renamed
            }
        }
    } else {
        // Add new transaction
        const newTransaction = {
            id: generateUniqueId(),
            userId: currentUser.email,
            type,
            categoryId,
            paymentMethodId, // Renamed
            amount,
            date,
            note,
            photoUrl
        };
        transactions.push(newTransaction);

        // Update paymentMethod balance
        const targetPaymentMethod = paymentMethods.find(pm => pm.id === paymentMethodId && pm.userId === currentUser.email); // Renamed
        if (targetPaymentMethod) {
            if (type === 'income') {
                targetPaymentMethod.balance += amount;
            } else {
                targetPaymentMethod.balance -= amount;
            }
        }
    }

    saveTransactions();
    savePaymentMethods(); // Payment methods also changed
    hideModal(transactionFormModal);
    clearForm(transactionForm);
    renderTransactions();
    renderDashboard(); // Update dashboard after transaction changes
    renderPaymentMethods(); // Update payment method list for balance change
    renderBudgets(); // Re-render budgets as transactions affect them
}

function editTransaction(id) {
    const transaction = transactions.find(t => t.id === id && t.userId === currentUser.email);
    if (transaction) {
        transactionIdInput.value = transaction.id;
        transactionTypeInput.value = transaction.type;
        populateTransactionForms(); // Repopulate categories/payment methods based on type
        transactionCategorySelect.value = transaction.categoryId;
        transactionPaymentMethodSelect.value = transaction.paymentMethodId; // Renamed
        transactionAmountInput.value = transaction.amount;
        transactionDateInput.value = transaction.date;
        transactionNoteInput.value = transaction.note;
        transactionPhotoUrlInput.value = transaction.photoUrl || '';
        if (transaction.photoUrl) {
            photoPreview.src = transaction.photoUrl;
            photoPreview.classList.remove('hidden');
        } else {
            photoPreview.classList.add('hidden');
            photoPreview.src = '#';
        }
        showModal(transactionFormModal);
    }
}

function deleteTransaction(id) {
    if (!confirm('確定要刪除這筆交易嗎？')) return;

    const index = transactions.findIndex(t => t.id === id && t.userId === currentUser.email);
    if (index !== -1) {
        const deletedTransaction = transactions[index];
        transactions.splice(index, 1);

        // Adjust paymentMethod balance back
        const targetPaymentMethod = paymentMethods.find(pm => pm.id === deletedTransaction.paymentMethodId && pm.userId === currentUser.email); // Renamed
        if (targetPaymentMethod) {
            if (deletedTransaction.type === 'income') {
                targetPaymentMethod.balance -= deletedTransaction.amount;
            } else {
                targetPaymentMethod.balance += deletedTransaction.amount;
            }
        }

        saveTransactions();
        savePaymentMethods(); // Payment methods also changed
        renderTransactions();
        renderDashboard(); // Update dashboard after deletion
        renderPaymentMethods(); // Update payment method list for balance change
        renderBudgets(); // Re-render budgets as transactions affect them
    }
}

// Categories
function addOrUpdateCategory(event) {
    event.preventDefault();
    const id = categoryIdInput.value;
    const name = categoryNameInput.value.trim();
    const type = categoryTypeInput.value;

    if (!name) {
        alert('分類名稱不能為空。');
        return;
    }

    if (id) {
        // Update existing
        const index = categories.findIndex(c => c.id === id && c.userId === currentUser.email);
        if (index !== -1) {
            categories[index] = { id, userId: currentUser.email, name, type };
        }
    } else {
        // Add new
        const newCategory = { id: generateUniqueId(), userId: currentUser.email, name, type };
        categories.push(newCategory);
    }
    saveCategories();
    hideModal(categoryFormModal);
    clearForm(categoryForm);
    renderCategories();
    populateTransactionForms(); // Update transaction category select
    populateTransactionFilters(); // Update transaction filter category select
    populateBudgetCategorySelect(); // Update budget category select
}

function editCategory(id) {
    const category = categories.find(c => c.id === id && c.userId === currentUser.email);
    if (category) {
        categoryIdInput.value = category.id;
        categoryNameInput.value = category.name;
        categoryTypeInput.value = category.type;
        showModal(categoryFormModal);
    }
}

function deleteCategory(id) {
    if (!confirm('確定要刪除此分類嗎？相關交易可能需要重新分類。')) return;

    // Check if any transactions are using this category
    const hasTransactions = transactions.some(t => t.categoryId === id && t.userId === currentUser.email);
    if (hasTransactions) {
        alert('此分類目前有交易使用，請先更改或刪除相關交易。');
        return;
    }

    // Check if any budgets are using this category
    const hasBudgets = budgets.some(b => b.categoryId === id && b.userId === currentUser.email);
    if (hasBudgets) {
        alert('此分類目前有預算設定，請先更改或刪除相關預算。');
        return;
    }

    categories = categories.filter(c => !(c.id === id && c.userId === currentUser.email));
    saveCategories();
    renderCategories();
    populateTransactionForms(); // Update transaction category select
    populateTransactionFilters(); // Update transaction filter category select
    populateBudgetCategorySelect(); // Update budget category select
}

// Payment Methods (Renamed from Accounts)
function addOrUpdatePaymentMethod(event) { // Renamed
    event.preventDefault();
    const id = paymentMethodIdInput.value; // Renamed
    const name = paymentMethodNameInput.value.trim(); // Renamed
    const balance = parseFloat(paymentMethodBalanceInput.value); // Renamed

    if (!name || isNaN(balance)) {
        alert('請填寫所有必填欄位並確保餘額是有效數字。');
        return;
    }

    if (id) {
        // Update existing
        const index = paymentMethods.findIndex(pm => pm.id === id && pm.userId === currentUser.email); // Renamed
        if (index !== -1) {
            paymentMethods[index] = { id, userId: currentUser.email, name, balance }; // Renamed
        }
    } else {
        // Add new
        const newPaymentMethod = { id: generateUniqueId(), userId: currentUser.email, name, balance }; // Renamed
        paymentMethods.push(newPaymentMethod); // Renamed
    }
    savePaymentMethods(); // Renamed
    hideModal(paymentMethodFormModal); // Renamed
    clearForm(paymentMethodForm); // Renamed
    renderPaymentMethods(); // Renamed
    populateTransactionForms(); // Update transaction payment method select
    populateTransactionFilters(); // Update transaction filter payment method select
    renderDashboard(); // Payment method balance might affect dashboard
}

function editPaymentMethod(id) { // Renamed
    const paymentMethod = paymentMethods.find(pm => pm.id === id && pm.userId === currentUser.email); // Renamed
    if (paymentMethod) {
        paymentMethodIdInput.value = paymentMethod.id; // Renamed
        paymentMethodNameInput.value = paymentMethod.name; // Renamed
        paymentMethodBalanceInput.value = paymentMethod.balance; // Renamed
        showModal(paymentMethodFormModal); // Renamed
    }
}

function deletePaymentMethod(id) { // Renamed
    if (!confirm('確定要刪除此付款方式嗎？相關交易可能需要重新指定。')) return; // Renamed

    // Check if any transactions are using this payment method
    const hasTransactions = transactions.some(t => t.paymentMethodId === id && t.userId === currentUser.email); // Renamed
    if (hasTransactions) {
        alert('此付款方式目前有交易使用，請先更改或刪除相關交易。'); // Renamed
        return;
    }

    paymentMethods = paymentMethods.filter(pm => !(pm.id === id && pm.userId === currentUser.email)); // Renamed
    savePaymentMethods(); // Renamed
    renderPaymentMethods(); // Renamed
    populateTransactionForms(); // Update transaction payment method select
    populateTransactionFilters(); // Update transaction filter payment method select
}

// New: Budget CRUD
function addOrUpdateBudget(event) {
    event.preventDefault();
    const id = budgetIdInput.value;
    const categoryId = budgetCategorySelect.value;
    const amount = parseFloat(budgetAmountInput.value);
    const month = budgetMonthInput.value; // YYYY-MM format

    if (!categoryId || !amount || !month) {
        alert('請填寫所有預算必填欄位。');
        return;
    }

    // Check for duplicate budget for the same category and month
    const existingBudget = budgets.find(b =>
        b.userId === currentUser.email &&
        b.categoryId === categoryId &&
        b.month === month &&
        b.id !== id // Exclude itself if editing
    );

    if (existingBudget) {
        alert('此月份此分類的預算已存在，請編輯現有預算或選擇其他分類/月份。');
        return;
    }


    if (id) {
        // Update existing
        const index = budgets.findIndex(b => b.id === id && b.userId === currentUser.email);
        if (index !== -1) {
            budgets[index] = { id, userId: currentUser.email, categoryId, amount, month };
        }
    } else {
        // Add new
        const newBudget = { id: generateUniqueId(), userId: currentUser.email, categoryId, amount, month };
        budgets.push(newBudget);
    }
    saveBudgets();
    hideModal(budgetFormModal);
    clearForm(budgetForm);
    renderBudgets();
}

function editBudget(id) {
    const budget = budgets.find(b => b.id === id && b.userId === currentUser.email);
    if (budget) {
        budgetIdInput.value = budget.id;
        populateBudgetCategorySelect(); // Ensure categories are loaded
        budgetCategorySelect.value = budget.categoryId;
        budgetAmountInput.value = budget.amount;
        budgetMonthInput.value = budget.month;
        showModal(budgetFormModal);
    }
}

function deleteBudget(id) {
    if (!confirm('確定要刪除此預算設定嗎？')) return;
    budgets = budgets.filter(b => !(b.id === id && b.userId === currentUser.email));
    saveBudgets();
    renderBudgets();
}


// --- Populate Selects (Categories & Payment Methods for Transaction Form) ---
function populateTransactionForms() {
    const userCategories = categories.filter(c => c.userId === currentUser.email);
    const userPaymentMethods = paymentMethods.filter(pm => pm.userId === currentUser.email); // Renamed

    // Clear existing options
    transactionCategorySelect.innerHTML = '<option value="">選擇分類</option>';
    transactionPaymentMethodSelect.innerHTML = '<option value="">選擇付款方式</option>'; // Renamed

    // Populate categories based on transaction type
    const relevantCategories = userCategories.filter(c => c.type === transactionTypeInput.value);
    relevantCategories.forEach(category => {
        const option = document.createElement('option');
        option.value = category.id;
        option.textContent = category.name;
        transactionCategorySelect.appendChild(option);
    });

    // Populate payment methods
    userPaymentMethods.forEach(paymentMethod => { // Renamed
        const option = document.createElement('option');
        option.value = paymentMethod.id;
        option.textContent = paymentMethod.name;
        transactionPaymentMethodSelect.appendChild(option); // Renamed
    });

    // If no categories or payment methods, alert user
    if (relevantCategories.length === 0 && !categoryFormModal.classList.contains('hidden')) {
        // Only show warning if user is on transactions page and adding
        if (transactionFormModal.classList.contains('hidden') === false) { // If modal is open
            alert('請先新增至少一個「' + (transactionTypeInput.value === 'income' ? '收入' : '支出') + '」分類。');
        }
    }
    if (userPaymentMethods.length === 0 && !paymentMethodFormModal.classList.contains('hidden')) { // Renamed
        if (transactionFormModal.classList.contains('hidden') === false) { // If modal is open
            alert('請先新增至少一個付款方式。'); // Renamed
        }
    }
}

// New: Populate Transaction Filters
function populateTransactionFilters() {
    const userCategories = categories.filter(c => c.userId === currentUser.email);
    const userPaymentMethods = paymentMethods.filter(pm => pm.userId === currentUser.email); // Renamed

    filterCategory.innerHTML = '<option value="">所有分類</option>';
    filterPaymentMethod.innerHTML = '<option value="">所有付款方式</option>'; // Renamed

    userCategories.forEach(category => {
        const option = document.createElement('option');
        option.value = category.id;
        option.textContent = category.name;
        filterCategory.appendChild(option);
    });

    userPaymentMethods.forEach(paymentMethod => { // Renamed
        const option = document.createElement('option');
        option.value = paymentMethod.id;
        option.textContent = paymentMethod.name;
        filterPaymentMethod.appendChild(option); // Renamed
    });
}

// New: Populate Budget Category Select
function populateBudgetCategorySelect() {
    const userCategories = categories.filter(c => c.userId === currentUser.email && c.type === 'expense'); // Only expense categories for budget
    budgetCategorySelect.innerHTML = '<option value="">選擇支出分類</option>';
    userCategories.forEach(category => {
        const option = document.createElement('option');
        option.value = category.id;
        option.textContent = category.name;
        budgetCategorySelect.appendChild(option);
    });
    if (userCategories.length === 0 && !budgetFormModal.classList.contains('hidden')) {
        alert('請先新增至少一個「支出」分類，才能設定預算。');
    }
}


// --- Event Listeners ---

// Authentication
showRegisterFormBtn.addEventListener('click', (e) => {
    e.preventDefault();
    loginFormContainer.classList.add('hidden');
    registerFormContainer.classList.remove('hidden');
});

showLoginFormBtn.addEventListener('click', (e) => {
    e.preventDefault();
    registerFormContainer.classList.add('hidden');
    loginFormContainer.classList.remove('hidden');
});

loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    login(email, password);
});

registerForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;
    if (register(email, password)) {
        // Auto-fill login form after successful registration
        document.getElementById('login-email').value = email;
        document.getElementById('login-password').value = password;
        loginFormContainer.classList.remove('hidden');
        registerFormContainer.classList.add('hidden');
    }
});

loginBtnNav.addEventListener('click', () => {
    authSection.classList.remove('hidden');
    loginFormContainer.classList.remove('hidden');
    registerFormContainer.classList.add('hidden');
    mainContent.classList.add('hidden');
});

registerBtnNav.addEventListener('click', () => {
    authSection.classList.remove('hidden');
    registerFormContainer.classList.remove('hidden');
    loginFormContainer.classList.add('hidden');
    mainContent.classList.add('hidden');
});

logoutBtnNav.addEventListener('click', logout);


// Modal Close Buttons
closeButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
        hideModal(e.target.closest('.modal'));
        clearForm(e.target.closest('.modal').querySelector('form'));
    });
});

// Sidebar Navigation
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const sectionId = e.target.closest('a').dataset.section + '-section';
        showSection(sectionId);
    });
});

// Transaction Form
addTransactionBtn.addEventListener('click', () => {
    clearForm(transactionForm);
    transactionTypeInput.value = 'expense'; // Default to expense
    transactionDateInput.valueAsDate = new Date(); // Set current date
    populateTransactionForms(); // Populate selects before showing
    showModal(transactionFormModal);
});

transactionForm.addEventListener('submit', addOrUpdateTransaction);

transactionTypeInput.addEventListener('change', populateTransactionForms); // Update categories when type changes

transactionPhotoFileInput.addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            photoPreview.src = e.target.result;
            photoPreview.classList.remove('hidden');
        };
        reader.readAsDataURL(file);
    } else {
        photoPreview.classList.add('hidden');
        photoPreview.src = '#';
    }
});

// Filters and Search (Updated)
filterTransactionType.addEventListener('change', renderTransactions);
filterPaymentMethod.addEventListener('change', renderTransactions); // New
filterCategory.addEventListener('change', renderTransactions); // New
searchTransactionsInput.addEventListener('input', renderTransactions);

// Initialize Flatpickr for date filters
flatpickr(filterStartDate, {
    dateFormat: "Y-m-d",
    onChange: function(selectedDates, dateStr, instance) {
        renderTransactions();
    }
});
flatpickr(filterEndDate, {
    dateFormat: "Y-m-d",
    onChange: function(selectedDates, dateStr, instance) {
        renderTransactions();
    }
});

clearDateFilterBtn.addEventListener('click', () => {
    filterStartDate._flatpickr.clear();
    filterEndDate._flatpickr.clear();
    renderTransactions();
});


// Category Form
addCategoryBtn.addEventListener('click', () => {
    clearForm(categoryForm);
    showModal(categoryFormModal);
});

categoryForm.addEventListener('submit', addOrUpdateCategory);

// Payment Method Form (Renamed from Account Form)
addPaymentMethodBtn.addEventListener('click', () => { // Renamed
    clearForm(paymentMethodForm); // Renamed
    paymentMethodBalanceInput.value = '0'; // Default initial balance // Renamed
    showModal(paymentMethodFormModal); // Renamed
});

paymentMethodForm.addEventListener('submit', addOrUpdatePaymentMethod); // Renamed

// Budget Form (New)
addBudgetBtn.addEventListener('click', () => {
    clearForm(budgetForm);
    budgetMonthInput.value = new Date().toISOString().slice(0, 7); // Default to current month YYYY-MM
    populateBudgetCategorySelect();
    showModal(budgetFormModal);
});

budgetForm.addEventListener('submit', addOrUpdateBudget);


// --- Initialization ---
function init() {
    currentUser = JSON.parse(localStorage.getItem('currentUser'));
    updateAuthUI();

    if (currentUser) {
        // If logged in, show dashboard by default
        showSection('dashboard-section');
    } else {
        // If not logged in, ensure auth modal is visible
        authSection.classList.remove('hidden');
        loginFormContainer.classList.remove('hidden');
        registerFormContainer.classList.add('hidden');
        mainContent.classList.add('hidden');
    }
}

// Helper to get CSS variable values
function varCss(name) {
    return getComputedStyle(document.documentElement).getPropertyValue(`--${name}`).trim();
}

// Run initialization when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', init);