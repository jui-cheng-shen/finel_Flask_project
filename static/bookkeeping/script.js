// --- DOM Elements ---
// 取得與使用者介面相關的 DOM 元素，用來操作頁面
const authSection = document.getElementById('auth-section'); // 認證相關區塊（彈窗）
const loginFormContainer = document.getElementById('login-form-container'); // 登入表單容器
const registerFormContainer = document.getElementById('register-form-container'); // 註冊表單容器
const showRegisterFormBtn = document.getElementById('show-register-form'); // 切換到註冊表單按鈕
const showLoginFormBtn = document.getElementById('show-login-form'); // 切換到登入表單按鈕
const loginForm = document.getElementById('login-form'); // 登入表單本身
const registerForm = document.getElementById('register-form'); // 註冊表單本身
const loginBtnNav = document.getElementById('login-btn-nav'); // 導航列中的登入按鈕
const registerBtnNav = document.getElementById('register-btn-nav'); // 導航列中的註冊按鈕
const logoutBtnNav = document.getElementById('logout-btn-nav'); // 導航列中的登出按鈕
const mainContent = document.getElementById('main-content'); // 主內容區
const userEmailDisplay = document.getElementById('user-email-display'); // 顯示目前登入使用者的信箱
const closeButtons = document.querySelectorAll('.modal .close-btn'); // 所有彈窗內的關閉按鈕

// Sidebar Navigation（側邊導航列）
const navLinks = document.querySelectorAll('#sidebar nav a'); // 側邊導航連結
const contentSections = document.querySelectorAll('.content-section'); // 各個內容區塊

// Dashboard Elements（儀表板元素）
const totalIncomeDisplay = document.getElementById('total-income'); // 總收入
const totalExpensesDisplay = document.getElementById('total-expenses'); // 總支出
const netBalanceDisplay = document.getElementById('net-balance'); // 淨結餘
const monthlyNetBalanceDisplay = document.getElementById('monthly-net-balance'); // 本月淨結餘
const spendingChartCanvas = document.getElementById('spendingChart'); // 繪製圖表的 canvas 元素
const chartPlaceholder = document.querySelector('.chart-placeholder'); // 無數據時顯示的佔位區
let spendingChartInstance = null; // 用來儲存 Chart.js 圖表的實例

// Transactions Section（交易紀錄區）
const addTransactionBtn = document.getElementById('add-transaction-btn'); // 新增交易按鈕
const transactionFormModal = document.getElementById('transaction-form-modal'); // 交易表單的彈窗
const transactionForm = document.getElementById('transaction-form'); // 交易表單本身
const transactionIdInput = document.getElementById('transaction-id'); // 隱藏的交易ID欄位（編輯用）
const transactionTypeInput = document.getElementById('transaction-type'); // 交易類型（收入/支出）
const transactionCategorySelect = document.getElementById('transaction-category'); // 交易分類選擇框
const transactionPaymentMethodSelect = document.getElementById('transaction-payment-method'); // 付款方式選擇框
const transactionAmountInput = document.getElementById('transaction-amount'); // 交易金額輸入
const transactionDateInput = document.getElementById('transaction-date'); // 交易日期輸入
const transactionNoteInput = document.getElementById('transaction-note'); // 交易備註輸入
const transactionPhotoUrlInput = document.getElementById('transaction-photo-url'); // 交易附加照片 URL 輸入
const transactionPhotoFileInput = document.getElementById('transaction-photo-file'); // 交易附加照片檔案輸入
const photoPreview = document.getElementById('photo-preview'); // 照片預覽區
const transactionsList = document.getElementById('transactions-list'); // 渲染交易的清單容器
const filterTransactionType = document.getElementById('filter-transaction-type'); // 依交易類型篩選
const filterPaymentMethod = document.getElementById('filter-payment-method'); // 依付款方式篩選
const filterCategory = document.getElementById('filter-category'); // 依分類篩選
const filterStartDate = document.getElementById('filter-start-date'); // 日期篩選起始
const filterEndDate = document.getElementById('filter-end-date');   // 日期篩選結束
const clearDateFilterBtn = document.getElementById('clear-date-filter'); // 清除日期篩選按鈕
const searchTransactionsInput = document.getElementById('search-transactions'); // 關鍵字搜尋輸入

// Categories Section（交易分類區）
const addCategoryBtn = document.getElementById('add-category-btn'); // 新增分類按鈕
const categoryFormModal = document.getElementById('category-form-modal'); // 分類表單的彈窗
const categoryForm = document.getElementById('category-form'); // 分類表單本身
const categoryIdInput = document.getElementById('category-id'); // 隱藏的分類ID欄位
const categoryNameInput = document.getElementById('category-name'); // 分類名稱輸入
const categoryTypeInput = document.getElementById('category-type'); // 分類類型（收入或支出）
const categoriesList = document.getElementById('categories-list'); // 分類清單區

// Payment Methods Section（付款方式區，原帳戶區）
const addPaymentMethodBtn = document.getElementById('add-payment-method-btn'); // 新增付款方式按鈕
const paymentMethodFormModal = document.getElementById('payment-method-form-modal'); // 付款方式表單彈窗
const paymentMethodForm = document.getElementById('payment-method-form'); // 付款方式表單本身
const paymentMethodIdInput = document.getElementById('payment-method-id'); // 隱藏的付款方式ID欄位
const paymentMethodNameInput = document.getElementById('payment-method-name'); // 付款方式名稱輸入
const paymentMethodBalanceInput = document.getElementById('payment-method-balance'); // 付款方式餘額輸入
const paymentMethodsList = document.getElementById('payment-methods-list'); // 付款方式清單區

// Budget Section（預算設定區）
const addBudgetBtn = document.getElementById('add-budget-btn'); // 新增預算按鈕
const budgetFormModal = document.getElementById('budget-form-modal'); // 預算表單彈窗
const budgetForm = document.getElementById('budget-form'); // 預算表單本身
const budgetIdInput = document.getElementById('budget-id'); // 隱藏的預算ID
const budgetCategorySelect = document.getElementById('budget-category'); // 預算分類選擇框（只選支出類別）
const budgetAmountInput = document.getElementById('budget-amount'); // 預算金額輸入
const budgetMonthInput = document.getElementById('budget-month'); // 預算月份輸入（格式 YYYY-MM）
const budgetsList = document.getElementById('budgets-list'); // 預算清單區

// --- Global Data Storage ---
// 儲存使用者及各項資料（在真實應用中通常從後端取得數據）
let currentUser = null;
let users = JSON.parse(localStorage.getItem('users')) || {};
let transactions = JSON.parse(localStorage.getItem('transactions')) || [];
let categories = JSON.parse(localStorage.getItem('categories')) || [];
let paymentMethods = JSON.parse(localStorage.getItem('paymentMethods')) || [];
let budgets = JSON.parse(localStorage.getItem('budgets')) || [];

// --- Helper Functions ---
// 將使用者資料存回 localStorage
function saveUsers() {
    localStorage.setItem('users', JSON.stringify(users));
}

// 將交易資料存回 localStorage
function saveTransactions() {
    localStorage.setItem('transactions', JSON.stringify(transactions));
}

// 將分類資料存回 localStorage
function saveCategories() {
    localStorage.setItem('categories', JSON.stringify(categories));
}

// 將付款方式資料存回 localStorage
function savePaymentMethods() {
    localStorage.setItem('paymentMethods', JSON.stringify(paymentMethods));
}

// 將預算資料存回 localStorage
function saveBudgets() {
    localStorage.setItem('budgets', JSON.stringify(budgets));
}

// 產生一個獨一無二的 ID（用於新增資料）
function generateUniqueId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// 將數字格式化成新台幣顯示
function formatCurrency(amount) {
    return `NT$${parseFloat(amount).toLocaleString('zh-TW', { 
        minimumFractionDigits: 0, 
        maximumFractionDigits: 2 
    })}`;
}

// 格式化日期字串（顯示完整年月日）
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('zh-TW', { 
        year: 'numeric', 
        month: 'numeric', 
        day: 'numeric' 
    });
}

// 格式化日期字串（顯示月份）
function formatMonth(dateString) { // dataString 應為 YYYY-MM-DD 格式
    const date = new Date(dateString);
    return date.toLocaleDateString('zh-TW', { 
        year: 'numeric', 
        month: 'long' 
    });
}

// 顯示彈窗，並加入輔助無障礙設定
//無障礙設定的作用是讓使用輔助技術的使用者（如螢幕閱讀器）能夠正確理解彈窗的內容和功能。
function showModal(modalElement) {
    modalElement.classList.remove('hidden'); // 顯示彈窗
    modalElement.setAttribute('aria-modal', 'true'); // 設定無障礙屬性
    modalElement.setAttribute('role', 'dialog'); // 設定角色為對話框
    document.body.classList.add('modal-open'); // 開啟彈窗時避免背景滾動
}

// 隱藏彈窗並移除無障礙屬性
//移除無障礙屬性是為了讓螢幕閱讀器不再將該元素視為對話框，並恢復背景滾動。
function hideModal(modalElement) {
    modalElement.classList.add('hidden');
    modalElement.removeAttribute('aria-modal');
    modalElement.removeAttribute('role');
    document.body.classList.remove('modal-open');
}

// 清空表單內容（包括隱藏 ID 欄位、清除圖片預覽）
function clearForm(formElement) { // formElement 是剛開始傳入的表單元素
    formElement.reset(); // 重置表單內容
    const hiddenInput = formElement.querySelector('input[type="hidden"]');
    if (hiddenInput) {
        hiddenInput.value = '';
    }
    if (formElement.id === 'transaction-form') {
        photoPreview.classList.add('hidden');
        photoPreview.src = '#'; // 清除圖片預覽
    }
}

// 顯示指定的內容區塊，並更新側邊導航的選取狀態
function showSection(sectionId) {
    contentSections.forEach(section => { //=> 的意思是箭頭函式，這裡用來遍歷所有內容區塊
        section.classList.add('hidden'); // 隱藏所有內容區塊
    });
    document.getElementById(sectionId).classList.remove('hidden'); // 顯示指定的內容區塊

    navLinks.forEach(link => {
        link.classList.remove('active'); // 移除所有導航連結的 active 類別
        if (link.dataset.section === sectionId.replace('-section', '')) { // 檢查連結的 data-section 屬性是否與 sectionId 相符
            link.classList.add('active');
        }
    });

    // 根據不同的區塊執行對應的重新渲染函式
    if (sectionId === 'dashboard-section') { // 如果是儀表板區塊
        renderDashboard(); // 渲染儀表板
    } else if (sectionId === 'transactions-section') { // 如果是交易紀錄區塊
        renderTransactions(); // 渲染交易清單
        populateTransactionForms(); // 填充交易表單的選項
        populateTransactionFilters(); // 填充交易篩選器的選項
    } else if (sectionId === 'categories-section') {
        renderCategories(); // 渲染分類清單 , 渲染的意思是
    } else if (sectionId === 'payment-methods-section') {
        renderPaymentMethods();
    } else if (sectionId === 'budget-section') {
        renderBudgets();
        populateBudgetCategorySelect();
    }
}

// --- Auth Functions ---
// 登入功能：檢查用戶認證後更新使用者資訊與 UI
function login(email, password) {
    if (users[email] && users[email].password === password) {
        currentUser = { email: email, name: users[email].name || email };
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        updateAuthUI();
        showSection('dashboard-section');
        userEmailDisplay.textContent = currentUser.email; // 顯示使用者電子郵件
        console.log('Login successful'); // 登入成功後，顯示儀表板
        return true;
    }
    console.log('Login failed');
    return false;
}

// 註冊功能：新增用戶資料並提示
function register(email, password) {
    if (users[email]) {
        alert('此電子郵件已被註冊。');
        return false;
    }
    users[email] = { password: password, name: email };
    saveUsers();
    alert('註冊成功！請登入。');
    console.log('Registration successful');
    return true;
}

// 登出功能：清除使用者資料與 UI，並重置所有本地資料
function logout() {
    currentUser = null;
    localStorage.removeItem('currentUser');
    updateAuthUI();
    transactions = [];
    categories = [];
    paymentMethods = [];
    budgets = [];
    saveTransactions();
    saveCategories();
    savePaymentMethods();
    saveBudgets();
    spendingChartInstance?.destroy();
    spendingChartCanvas.classList.add('hidden');
    chartPlaceholder.classList.remove('hidden');

    // 顯示認證區塊
    authSection.classList.remove('hidden');
    loginFormContainer.classList.remove('hidden');
    registerFormContainer.classList.add('hidden');
    mainContent.classList.add('hidden');
    userEmailDisplay.textContent = '';
    console.log('Logged out');
}

// 根據當前認證狀態更新介面
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
// 渲染儀表板：計算並顯示收入、支出、結餘及圖表
function renderDashboard() {
    const userTransactions = transactions.filter(t => t.userId === currentUser.email);
    const userCategories = categories.filter(c => c.userId === currentUser.email);

    let totalIncome = 0;
    let totalExpenses = 0;
    let monthlyIncome = 0;
    let monthlyExpenses = 0;
    const spendingByCategory = {};

    const currentMonth = new Date().toISOString().slice(0, 7);

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
    monthlyNetBalanceDisplay.textContent = formatCurrency(monthlyNetBalance);

    renderSpendingChart(spendingByCategory);
}

// 使用 Chart.js 渲染支出圖表
function renderSpendingChart(data) {
    if (spendingChartInstance) {
        spendingChartInstance.destroy();
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
        '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', 
        '#FF9F40', '#E7E9ED', '#8AC926', '#FFCA3A', '#1982C4'
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

// 渲染交易清單，並依多種條件進行篩選與排序
function renderTransactions() {
    transactionsList.innerHTML = '';
    const userTransactions = transactions.filter(t => t.userId === currentUser.email);
    const userCategories = categories.filter(c => c.userId === currentUser.email);
    const userPaymentMethods = paymentMethods.filter(pm => pm.userId === currentUser.email);
    const filteredTransactions = userTransactions.filter(t => {
        const typeMatch = filterTransactionType.value === '' || t.type === filterTransactionType.value;
        const paymentMethodMatch = filterPaymentMethod.value === '' || t.paymentMethodId === filterPaymentMethod.value;
        const categoryMatch = filterCategory.value === '' || t.categoryId === filterCategory.value;
        const transactionDate = new Date(t.date);
        const startDate = filterStartDate.value ? new Date(filterStartDate.value) : null;
        const endDate = filterEndDate.value ? new Date(filterEndDate.value) : null;
        const dateMatch = (!startDate || transactionDate >= startDate) && (!endDate || transactionDate <= endDate);
        const searchLower = searchTransactionsInput.value.toLowerCase();
        const categoryName = userCategories.find(c => c.id === t.categoryId)?.name || '未分類';
        const paymentMethodName = userPaymentMethods.find(pm => pm.id === t.paymentMethodId)?.name || '未指定付款方式';
        const noteMatch = t.note.toLowerCase().includes(searchLower);
        const amountMatch = t.amount.toString().includes(searchLower);
        const dateStringMatch = formatDate(t.date).toLowerCase().includes(searchLower);
        const keywordMatch = categoryName.toLowerCase().includes(searchLower) ||
                             paymentMethodName.toLowerCase().includes(searchLower) ||
                             noteMatch || amountMatch || dateStringMatch;
        return typeMatch && paymentMethodMatch && categoryMatch && dateMatch && keywordMatch;
    }).sort((a, b) => new Date(b.date) - new Date(a.date));
    if (filteredTransactions.length === 0) {
        transactionsList.innerHTML = '<p class="list-placeholder">尚無任何交易紀錄。</p>';
        return;
    }
    // 依每筆交易建立交易卡片
    filteredTransactions.forEach(t => {
        const category = userCategories.find(c => c.id === t.categoryId);
        const paymentMethod = userPaymentMethods.find(pm => pm.id === t.paymentMethodId);
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
    // 為編輯與刪除按鈕加入事件監聽器
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

// 渲染分類列表
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

// 渲染付款方式列表
function renderPaymentMethods() {
    paymentMethodsList.innerHTML = ''; // 清空付款方式列表
    const userPaymentMethods = paymentMethods.filter(pm => pm.userId === currentUser.email);
    if (userPaymentMethods.length === 0) {
        paymentMethodsList.innerHTML = '<p class="list-placeholder">尚未設定任何付款方式。</p>';
        return;
    }
    userPaymentMethods.forEach(pm => {
        const paymentMethodCard = document.createElement('div');
        paymentMethodCard.classList.add('card');
        paymentMethodCard.dataset.id = pm.id;
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
        paymentMethodsList.appendChild(paymentMethodCard);
    });
    paymentMethodsList.querySelectorAll('.btn-edit-payment-method').forEach(button => {
        button.addEventListener('click', (e) => {
            const paymentMethodId = e.target.closest('.card').dataset.id;
            editPaymentMethod(paymentMethodId);
        });
    });
    paymentMethodsList.querySelectorAll('.btn-delete-payment-method').forEach(button => {
        button.addEventListener('click', (e) => {
            const paymentMethodId = e.target.closest('.card').dataset.id;
            deletePaymentMethod(paymentMethodId);
        });
    });
}

// 渲染預算列表
function renderBudgets() {
    budgetsList.innerHTML = '';
    const userBudgets = budgets.filter(b => b.userId === currentUser.email);
    const userCategories = categories.filter(c => c.userId === currentUser.email);
    const currentMonth = new Date().toISOString().slice(0, 7);
    if (userBudgets.length === 0) {
        budgetsList.innerHTML = '<p class="list-placeholder">尚未設定任何預算。</p>';
        return;
    }
    userBudgets.forEach(b => {
        const category = userCategories.find(c => c.id === b.categoryId);
        const categoryName = category ? category.name : '未知分類';
        // 計算此預算類別在該月份的已花費金額
        const spentAmount = transactions.filter(t =>
            t.userId === currentUser.email &&
            t.type === 'expense' &&
            t.categoryId === b.categoryId &&
            t.date.slice(0, 7) === b.month
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
// 交易新增或更新
function addOrUpdateTransaction(event) {
    event.preventDefault(); // 防止表單提交後重整頁面
    const id = transactionIdInput.value; // 取得交易 ID（編輯用）
    const type = transactionTypeInput.value; // 取得交易類型
    const categoryId = transactionCategorySelect.value; // 取得所選分類
    const paymentMethodId = transactionPaymentMethodSelect.value; // 取得所選付款方式
    const amount = parseFloat(transactionAmountInput.value); // 取得金額，轉成數字
    const date = transactionDateInput.value; // 取得交易日期
    const note = transactionNoteInput.value.trim(); // 取得備註
    let photoUrl = transactionPhotoUrlInput.value.trim(); // 取得照片 URL（若有）
    if (!amount || !date || !categoryId || !paymentMethodId) {
        alert('請填寫所有必填欄位。');
        return;
    }
    // 若無照片 URL 且有選擇檔案，則進行檔案讀取
    if (!photoUrl && transactionPhotoFileInput.files.length > 0) {
        const file = transactionPhotoFileInput.files[0];
        const reader = new FileReader();
        reader.onload = (e) => {
            photoUrl = e.target.result;
            completeTransactionSave(id, type, categoryId, paymentMethodId, amount, date, note, photoUrl);
        };
        reader.readAsDataURL(file);
    } else {
        completeTransactionSave(id, type, categoryId, paymentMethodId, amount, date, note, photoUrl);
    }
}

// 完成交易儲存：處理新增或更新，並調整付款方式餘額
function completeTransactionSave(id, type, categoryId, paymentMethodId, amount, date, note, photoUrl) {
    if (id) {
        // 更新現有交易
        const index = transactions.findIndex(t => t.id === id && t.userId === currentUser.email);
        if (index !== -1) {
            // 調整原付款方式餘額，還原原本的交易金額
            const oldTransaction = transactions[index];
            const oldPaymentMethod = paymentMethods.find(pm => pm.id === oldTransaction.paymentMethodId && pm.userId === currentUser.email);
            if (oldPaymentMethod) {
                if (oldTransaction.type === 'income') oldPaymentMethod.balance -= oldTransaction.amount;
                else oldPaymentMethod.balance += oldTransaction.amount;
            }
            // 更新交易資料
            transactions[index] = { id, userId: currentUser.email, type, categoryId, paymentMethodId, amount, date, note, photoUrl };
            // 調整新付款方式餘額
            const newPaymentMethod = paymentMethods.find(pm => pm.id === paymentMethodId && pm.userId === currentUser.email);
            if (newPaymentMethod) {
                if (type === 'income') newPaymentMethod.balance += amount;
                else newPaymentMethod.balance -= amount;
            }
        }
    } else {
        // 新增交易
        const newTransaction = {
            id: generateUniqueId(),
            userId: currentUser.email,
            type,
            categoryId,
            paymentMethodId,
            amount,
            date,
            note,
            photoUrl
        };
        transactions.push(newTransaction);
        // 調整付款方式餘額
        const targetPaymentMethod = paymentMethods.find(pm => pm.id === paymentMethodId && pm.userId === currentUser.email);
        if (targetPaymentMethod) {
            if (type === 'income') targetPaymentMethod.balance += amount;
            else targetPaymentMethod.balance -= amount;
        }
    }
    saveTransactions();
    savePaymentMethods();
    hideModal(transactionFormModal);
    clearForm(transactionForm);
    renderTransactions();
    renderDashboard();
    renderPaymentMethods();
    renderBudgets();
}

// 編輯交易：根據 ID 填入表單資料並顯示彈窗
function editTransaction(id) {
    const transaction = transactions.find(t => t.id === id && t.userId === currentUser.email);
    if (transaction) {
        transactionIdInput.value = transaction.id;
        transactionTypeInput.value = transaction.type;
        populateTransactionForms();
        transactionCategorySelect.value = transaction.categoryId;
        transactionPaymentMethodSelect.value = transaction.paymentMethodId;
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

// 刪除交易並調整付款方式餘額
function deleteTransaction(id) {
    if (!confirm('確定要刪除這筆交易嗎？')) return;
    const index = transactions.findIndex(t => t.id === id && t.userId === currentUser.email);
    if (index !== -1) {
        const deletedTransaction = transactions[index];
        transactions.splice(index, 1);
        const targetPaymentMethod = paymentMethods.find(pm => pm.id === deletedTransaction.paymentMethodId && pm.userId === currentUser.email);
        if (targetPaymentMethod) {
            if (deletedTransaction.type === 'income')
                targetPaymentMethod.balance -= deletedTransaction.amount;
            else
                targetPaymentMethod.balance += deletedTransaction.amount;
        }
        saveTransactions();
        savePaymentMethods();
        renderTransactions();
        renderDashboard();
        renderPaymentMethods();
        renderBudgets();
    }
}

// --- Categories CRUD Operations ---
// 新增或更新分類
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
        const index = categories.findIndex(c => c.id === id && c.userId === currentUser.email);
        if (index !== -1) {
            categories[index] = { id, userId: currentUser.email, name, type };
        }
    } else {
        const newCategory = { id: generateUniqueId(), userId: currentUser.email, name, type };
        categories.push(newCategory);
    }
    saveCategories();
    hideModal(categoryFormModal);
    clearForm(categoryForm);
    renderCategories();
    populateTransactionForms();
    populateTransactionFilters();
    populateBudgetCategorySelect();
}

// 編輯分類，填入表單資料
function editCategory(id) {
    const category = categories.find(c => c.id === id && c.userId === currentUser.email);
    if (category) {
        categoryIdInput.value = category.id;
        categoryNameInput.value = category.name;
        categoryTypeInput.value = category.type;
        showModal(categoryFormModal);
    }
}

// 刪除分類前檢查是否有依賴交易或預算
function deleteCategory(id) {
    if (!confirm('確定要刪除此分類嗎？相關交易可能需要重新分類。')) return;
    const hasTransactions = transactions.some(t => t.categoryId === id && t.userId === currentUser.email);
    if (hasTransactions) {
        alert('此分類目前有交易使用，請先更改或刪除相關交易。');
        return;
    }
    const hasBudgets = budgets.some(b => b.categoryId === id && b.userId === currentUser.email);
    if (hasBudgets) {
        alert('此分類目前有預算設定，請先更改或刪除相關預算。');
        return;
    }
    categories = categories.filter(c => !(c.id === id && c.userId === currentUser.email));
    saveCategories();
    renderCategories();
    populateTransactionForms();
    populateTransactionFilters();
    populateBudgetCategorySelect();
}

// --- Payment Methods CRUD Operations ---
// 新增或更新付款方式
function addOrUpdatePaymentMethod(event) { // event 是事件物件，包含觸發事件的相關資訊
    event.preventDefault(); //preventDefault() 方法用來阻止表單的預設提交行為，避免頁面重整。
    const id = paymentMethodIdInput.value;
    const name = paymentMethodNameInput.value.trim();
    const balance = parseFloat(paymentMethodBalanceInput.value); // 取得餘額並轉成數字
    if (!name || isNaN(balance)) { // 檢查名稱是否為空或餘額是否為有效數字
        alert('請填寫所有必填欄位並確保餘額是有效數字。');
        return;
    }
    if (id) {
        const index = paymentMethods.findIndex(pm => pm.id === id && pm.userId === currentUser.email);
        if (index !== -1) { // 如果已存在此付款方式，則更新其資料
            paymentMethods[index] = { id, userId: currentUser.email, name, balance }; // 這裡的 userId 是用來確保每個付款方式都屬於當前使用者
        }
    } else {
        const newPaymentMethod = { id: generateUniqueId(), userId: currentUser.email, name, balance };
        paymentMethods.push(newPaymentMethod);
    }
    savePaymentMethods();
    hideModal(paymentMethodFormModal);
    clearForm(paymentMethodForm);
    renderPaymentMethods();
    populateTransactionForms();
    populateTransactionFilters();
    renderDashboard();
}

// 編輯付款方式
function editPaymentMethod(id) {
    const paymentMethod = paymentMethods.find(pm => pm.id === id && pm.userId === currentUser.email);
    if (paymentMethod) {
        paymentMethodIdInput.value = paymentMethod.id;
        paymentMethodNameInput.value = paymentMethod.name;
        paymentMethodBalanceInput.value = paymentMethod.balance;
        showModal(paymentMethodFormModal);
    }
}

// 刪除付款方式前檢查是否有相關交易
function deletePaymentMethod(id) {
    if (!confirm('確定要刪除此付款方式嗎？相關交易可能需要重新指定。')) return;
    const hasTransactions = transactions.some(t => t.paymentMethodId === id && t.userId === currentUser.email);
    if (hasTransactions) {
        alert('此付款方式目前有交易使用，請先更改或刪除相關交易。');
        return;
    }
    paymentMethods = paymentMethods.filter(pm => !(pm.id === id && pm.userId === currentUser.email));
    savePaymentMethods();
    renderPaymentMethods();
    populateTransactionForms();
    populateTransactionFilters();
}

// --- Budget CRUD Operations ---
// 新增或更新預算
function addOrUpdateBudget(event) {
    event.preventDefault();
    const id = budgetIdInput.value;
    const categoryId = budgetCategorySelect.value;
    const amount = parseFloat(budgetAmountInput.value);
    const month = budgetMonthInput.value;
    if (!categoryId || !amount || !month) {
        alert('請填寫所有預算必填欄位。');
        return;
    }
    const existingBudget = budgets.find(b =>
        b.userId === currentUser.email &&
        b.categoryId === categoryId &&
        b.month === month &&
        b.id !== id
    );
    if (existingBudget) {
        alert('此月份此分類的預算已存在，請編輯現有預算或選擇其他分類/月份。');
        return;
    }
    if (id) {
        const index = budgets.findIndex(b => b.id === id && b.userId === currentUser.email);
        if (index !== -1) {
            budgets[index] = { id, userId: currentUser.email, categoryId, amount, month };
        }
    } else {
        const newBudget = { id: generateUniqueId(), userId: currentUser.email, categoryId, amount, month };
        budgets.push(newBudget);
    }
    saveBudgets();
    hideModal(budgetFormModal);
    clearForm(budgetForm);
    renderBudgets();
}

// 編輯預算，填入表單
function editBudget(id) {
    const budget = budgets.find(b => b.id === id && b.userId === currentUser.email);
    if (budget) {
        budgetIdInput.value = budget.id;
        populateBudgetCategorySelect();
        budgetCategorySelect.value = budget.categoryId;
        budgetAmountInput.value = budget.amount;
        budgetMonthInput.value = budget.month;
        showModal(budgetFormModal);
    }
}

// 刪除預算
function deleteBudget(id) {
    if (!confirm('確定要刪除此預算設定嗎？')) return;
    budgets = budgets.filter(b => !(b.id === id && b.userId === currentUser.email)); // budgets.filter() 方法用來過濾出不符合條件的預算項目，並返回一個新的陣列。
    saveBudgets(); // 將更新後的預算資料儲存到本地存儲
    renderBudgets(); // 重新渲染預算列表
}

// --- Populate Selects ---
// 為交易表單填入分類與付款方式選項
function populateTransactionForms() {
    const userCategories = categories.filter(c => c.userId === currentUser.email);
    const userPaymentMethods = paymentMethods.filter(pm => pm.userId === currentUser.email);
    transactionCategorySelect.innerHTML = '<option value="">選擇分類</option>';
    transactionPaymentMethodSelect.innerHTML = '<option value="">選擇付款方式</option>';
    // 根據目前交易類型篩選分類
    const relevantCategories = userCategories.filter(c => c.type === transactionTypeInput.value);
    relevantCategories.forEach(category => {
        const option = document.createElement('option');
        option.value = category.id;
        option.textContent = category.name;
        transactionCategorySelect.appendChild(option);
    });
    // 填入付款方式選項
    userPaymentMethods.forEach(paymentMethod => {
        const option = document.createElement('option');
        option.value = paymentMethod.id;
        option.textContent = paymentMethod.name;
        transactionPaymentMethodSelect.appendChild(option);
    });
    if (relevantCategories.length === 0 && !categoryFormModal.classList.contains('hidden')) {
        if (transactionFormModal.classList.contains('hidden') === false) {
            alert('請先新增至少一個「' + (transactionTypeInput.value === 'income' ? '收入' : '支出') + '」分類。');
        }
    }
    if (userPaymentMethods.length === 0 && !paymentMethodFormModal.classList.contains('hidden')) {
        if (transactionFormModal.classList.contains('hidden') === false) {
            alert('請先新增至少一個付款方式。');
        }
    }
}

// 為交易篩選功能填入選項
function populateTransactionFilters() {
    const userCategories = categories.filter(c => c.userId === currentUser.email);
    const userPaymentMethods = paymentMethods.filter(pm => pm.userId === currentUser.email);
    filterCategory.innerHTML = '<option value="">所有分類</option>';
    filterPaymentMethod.innerHTML = '<option value="">所有付款方式</option>';
    userCategories.forEach(category => {
        const option = document.createElement('option');
        option.value = category.id;
        option.textContent = category.name;
        filterCategory.appendChild(option);
    });
    userPaymentMethods.forEach(paymentMethod => {
        const option = document.createElement('option');
        option.value = paymentMethod.id;
        option.textContent = paymentMethod.name;
        filterPaymentMethod.appendChild(option);
    });
}

// 為預算分類下拉選單填入只包含支出的分類
function populateBudgetCategorySelect() {
    const userCategories = categories.filter(c => c.userId === currentUser.email && c.type === 'expense');
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
// 切換表單：顯示註冊或登入畫面
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
// 登入與註冊表單提交事件
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
// 為所有彈窗關閉按鈕加上點擊事件：關閉彈窗並清除表單資料
closeButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
        hideModal(e.target.closest('.modal'));
        clearForm(e.target.closest('.modal').querySelector('form'));
    });
});
// 側邊導航連結點擊切換內容區
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const sectionId = e.target.closest('a').dataset.section + '-section';
        showSection(sectionId);
    });
});
// 交易表單：新增交易按鈕點擊事件
addTransactionBtn.addEventListener('click', () => {
    clearForm(transactionForm);
    transactionTypeInput.value = 'expense';
    transactionDateInput.valueAsDate = new Date();
    populateTransactionForms();
    showModal(transactionFormModal);
});
transactionForm.addEventListener('submit', addOrUpdateTransaction); // transactionForm 提交事件
transactionTypeInput.addEventListener('change', populateTransactionForms); // transactionTypeInput 變更事件
// 交易照片上傳事件：讀取檔案並顯示預覽
transactionPhotoFileInput.addEventListener('change', (event) => {
    const file = event.target.files[0]; // 取得選擇的檔案
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
// 交易搜尋與過濾事件
filterTransactionType.addEventListener('change', renderTransactions);
filterPaymentMethod.addEventListener('change', renderTransactions);
filterCategory.addEventListener('change', renderTransactions);
searchTransactionsInput.addEventListener('input', renderTransactions);
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
// 分類表單事件
addCategoryBtn.addEventListener('click', () => {
    clearForm(categoryForm);
    showModal(categoryFormModal);
});
categoryForm.addEventListener('submit', addOrUpdateCategory);
// 付款方式表單事件
addPaymentMethodBtn.addEventListener('click', () => {
    clearForm(paymentMethodForm);
    paymentMethodBalanceInput.value = '0'; // 初始餘額預設為 0
    showModal(paymentMethodFormModal);
});
paymentMethodForm.addEventListener('submit', addOrUpdatePaymentMethod);
// 預算表單事件
addBudgetBtn.addEventListener('click', () => {
    clearForm(budgetForm);
    budgetMonthInput.value = new Date().toISOString().slice(0, 7); // 預設本月
    populateBudgetCategorySelect();
    showModal(budgetFormModal);
});
budgetForm.addEventListener('submit', addOrUpdateBudget);

// --- Initialization ---
// 當 DOM 載入完畢後初始化應用程式
function init() {
    currentUser = JSON.parse(localStorage.getItem('currentUser'));
    updateAuthUI();
    if (currentUser) {
        showSection('dashboard-section');
    } else {
        authSection.classList.remove('hidden');
        loginFormContainer.classList.remove('hidden');
        registerFormContainer.classList.add('hidden');
        mainContent.classList.add('hidden');
    }
}
// 取得 CSS 變數的輔助函式
function varCss(name) {
    return getComputedStyle(document.documentElement).getPropertyValue(`--${name}`).trim(); // 這行的功能是
}
// 當 DOM 完全載入後執行初始化
// DOMContentLoaded 事件會在 HTML 完全載入並解析完成後觸發
// 這樣可以確保所有元素都已經存在於 DOM 中，避免在腳本中操作尚未載入的元素
document.addEventListener('DOMContentLoaded', init);

// --- Auto-save on Page Unload ---
// 當使用者關閉網頁前，透過 sendBeacon 將所有 localStorage 資料送至 /autosave
window.addEventListener('beforeunload', function() {
    const dataToSave = {
        users: JSON.parse(localStorage.getItem('users') || '{}'),
        currentUser: JSON.parse(localStorage.getItem('currentUser') || 'null'),
        transactions: JSON.parse(localStorage.getItem('transactions') || '[]'),
        categories: JSON.parse(localStorage.getItem('categories') || '[]'),
        paymentMethods: JSON.parse(localStorage.getItem('paymentMethods') || '[]'),
        budgets: JSON.parse(localStorage.getItem('budgets') || '[]')
    };
    const blob = new Blob([JSON.stringify(dataToSave)], { type: 'application/json' });
    navigator.sendBeacon('/autosave', blob);
});
