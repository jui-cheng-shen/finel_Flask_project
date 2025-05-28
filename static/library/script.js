document.addEventListener('DOMContentLoaded', function() {
    // --- DOM Elements ---
    const sections = document.querySelectorAll('section');
    const loginSection = document.getElementById('login');
    const registerSection = document.getElementById('register');
    const categoriesSection = document.getElementById('categories');
    const bookListSection = document.getElementById('book-list');
    const addBookSection = document.getElementById('add-book');
    const editBookSection = document.getElementById('edit-book');

    const loginLink = document.getElementById('login-link');
    const registerLink = document.getElementById('register-link');
    const logoutLinkNav = document.getElementById('logout-link'); // Parent <li> for logout link
    const logoutBtn = document.getElementById('logout');
    const homeLink = document.getElementById('home-link'); // <-- 新增的 Home Link 元素

    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const addBookForm = document.getElementById('add-book-form');
    const editBookForm = document.getElementById('edit-book-form');

    const bookTableBody = document.getElementById('book-table');
    const addBookBtn = document.getElementById('add-book-btn');
    const viewBooksBtn = document.getElementById('view-books'); // Added for categories page

    const categoryButtons = document.querySelectorAll('.category-btn');
    const categorySearchInput = document.getElementById('category-search');
    const searchForm = document.getElementById('search-form');
    const searchInputNav = searchForm.querySelector('input[type="search"]');

    const alertSuccess = document.getElementById('alert-success');
    const alertError = document.getElementById('alert-error');

    // --- DEBUG LOGS (Start) ---
    console.log('DOM Content Loaded. Initializing...');
    console.log('loginLink element:', loginLink);
    console.log('registerLink element:', registerLink);
    console.log('homeLink element:', homeLink); // <-- DEBUG LOG
    console.log('loginSection element:', loginSection);
    console.log('registerSection element:', registerSection);
    // --- DEBUG LOGS (End) ---

    // --- Simulated Data ---
    let currentUser = null; // Stores logged-in user
    let users = JSON.parse(localStorage.getItem('users')) || [{ username: 'testuser', password: 'password123' }];
    let books = JSON.parse(localStorage.getItem('books')) || [
        { id: '1', title: 'JavaScript 高效程式設計', author: '小明', year: 2021, category: '科學技術' },
        { id: '2', title: '現代文學的奧秘', author: '大華', year: 2019, category: '文學' },
        { id: '3', title: '歷史的迴響', author: '麗華', year: 2023, category: '歷史' }
    ];
    let selectedCategories = []; // For filtering books by category

    // --- Helper Functions ---

    /** Shows a specific section and hides others. */
    function showSection(sectionToShow) {
        if (!sectionToShow) {
            console.error('showSection: Target section is null or undefined.', sectionToShow);
            return;
        }
        sections.forEach(section => section.classList.add('d-none')); // Hide all
        sectionToShow.classList.remove('d-none'); // Show the target section
        console.log(`Showing section: ${sectionToShow.id}`);
    }

    /** Displays an alert message. */
    function showAlert(message, type = 'success') {
        const alertElement = type === 'success' ? alertSuccess : alertError;

        // Clear existing content except for the close button, or recreate it
        alertElement.innerHTML = message;
        
        // Re-append the close button to ensure it's there
        const closeBtn = document.createElement('button');
        closeBtn.setAttribute('type', 'button');
        closeBtn.classList.add('btn-close');
        closeBtn.setAttribute('data-bs-dismiss', 'alert');
        alertElement.appendChild(closeBtn);

        alertElement.classList.remove('d-none');
        alertElement.classList.add('show');

        // Automatically hide alert after 3 seconds
        setTimeout(() => {
            alertElement.classList.add('d-none');
            alertElement.classList.remove('show');
        }, 3000);
    }

    /** Toggles visibility of login/register/logout links in the navbar. */
    function toggleAuthLinks(loggedIn) {
        if (loggedIn) {
            loginLink.classList.add('d-none');
            registerLink.classList.add('d-none');
            logoutLinkNav.classList.remove('d-none');
            searchForm.classList.remove('d-none'); // Show search bar when logged in
            console.log('Auth links: Logged In state');
        } else {
            loginLink.classList.remove('d-none');
            registerLink.classList.remove('d-none');
            logoutLinkNav.classList.add('d-none');
            searchForm.classList.add('d-none'); // Hide search bar when logged out
            console.log('Auth links: Logged Out state');
        }
    }

    // --- Initial Load Logic (MAKE LOGIN PAGE THE FIRST THING) ---
    // Check if a user is already logged in (simulated with localStorage)
    if (localStorage.getItem('loggedInUser')) {
        currentUser = JSON.parse(localStorage.getItem('loggedInUser'));
        toggleAuthLinks(true);
        showSection(categoriesSection); // Go to categories if already logged in
        console.log('User already logged in. Displaying categories.');
    } else {
        toggleAuthLinks(false);
        showSection(loginSection); // **Show login section by default**
        console.log('User not logged in. Displaying login section.');
    }

    // --- Navigation ---
    if (homeLink) { // <-- 新增的 Home Link 事件監聽器
        homeLink.addEventListener('click', (e) => {
            e.preventDefault();
            if (currentUser) {
                showSection(categoriesSection);
                selectedCategories = []; // 清除所有選定的類別
                categoryButtons.forEach(btn => btn.classList.remove('active')); // 移除所有類別按鈕的 active 狀態
                categorySearchInput.value = ''; // 清空類別搜尋輸入框
                console.log('Home link clicked. Redirecting to categories.');
            } else {
                showSection(loginSection);
                showAlert('請先登錄以查看圖書分類。', 'danger');
                console.warn('Attempted to go home without login.');
            }
        });
    }

    if (loginLink) { // Ensure element exists before adding listener
        loginLink.addEventListener('click', (e) => {
            e.preventDefault();
            console.log('Login link clicked!');
            showSection(loginSection);
        });
    } else {
        console.error('Error: login-link element not found!');
    }

    if (registerLink) { // Ensure element exists before adding listener
        registerLink.addEventListener('click', (e) => {
            e.preventDefault();
            console.log('Register link clicked!');
            showSection(registerSection);
        });
    } else {
        console.error('Error: register-link element not found!');
    }

    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            localStorage.removeItem('loggedInUser'); // Simulate logout
            currentUser = null;
            toggleAuthLinks(false);
            showSection(loginSection); // Go back to login page
            showAlert('您已成功登出。', 'success');
            console.log('Logout button clicked. Redirecting to login.');
        });
    }

    // --- Authentication ---
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const username = document.getElementById('login-username').value;
            const password = document.getElementById('login-password').value;

            const foundUser = users.find(u => u.username === username && u.password === password);

            if (foundUser) {
                currentUser = foundUser;
                localStorage.setItem('loggedInUser', JSON.stringify(currentUser)); // Simulate login state
                showAlert('登錄成功！', 'success');
                toggleAuthLinks(true);
                showSection(categoriesSection); // Redirect to categories page after login
                console.log(`User ${username} logged in successfully.`);
            } else {
                showAlert('用戶名或密碼錯誤。', 'danger');
                console.warn(`Login failed for user: ${username}`);
            }
            loginForm.reset();
        });
    }

    if (registerForm) {
        registerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const username = document.getElementById('register-username').value;
            const password = document.getElementById('register-password').value;

            // Basic validation
            if (username.length < 3) {
                showAlert('用戶名至少需要3個字符。', 'danger');
                return;
            }
            if (password.length < 6) {
                showAlert('密碼至少需要6個字符。', 'danger');
                return;
            }
            if (users.some(u => u.username === username)) {
                showAlert('該用戶名已被註冊。', 'danger');
                console.warn(`Registration failed: Username ${username} already exists.`);
                return;
            }

            users.push({ username, password });
            localStorage.setItem('users', JSON.stringify(users)); // Save new user
            showAlert('註冊成功！請登錄。', 'success');
            showSection(loginSection); // Redirect to login page
            registerForm.reset();
            console.log(`User ${username} registered successfully.`);
        });
    }

    // --- Category Selection ---
    categoryButtons.forEach(button => {
        button.addEventListener('click', function() {
            const category = this.dataset.category;
            this.classList.toggle('active'); // Toggle active class
            if (this.classList.contains('active')) {
                selectedCategories.push(category);
            } else {
                selectedCategories = selectedCategories.filter(cat => cat !== category);
            }
            // Update the search input based on selected categories
            categorySearchInput.value = selectedCategories.join(', ');
            console.log('Selected categories:', selectedCategories);
        });
    });

    if (viewBooksBtn) {
        viewBooksBtn.addEventListener('click', function() {
            if (!currentUser) {
                showAlert('請先登錄以查看圖書。', 'danger');
                showSection(loginSection);
                console.warn('Attempted to view books without login.');
                return;
            }
            renderBooks(); // Render books based on selected categories (or all if none)
            showSection(bookListSection);
            console.log('Viewing books.');
        });
    }

    // Handle search input on the categories page
    if (categorySearchInput) {
        categorySearchInput.addEventListener('input', function() {
            const query = this.value.toLowerCase();
            categoryButtons.forEach(button => {
                const category = button.dataset.category.toLowerCase();
                if (category.includes(query) || query === '') {
                    button.classList.remove('d-none'); // Show if matches or search is empty
                } else {
                    button.classList.add('d-none'); // Hide if no match
                }
            });
        });
    }

    // --- Book Management (CRUD) ---

    function renderBooks(filteredBooks = books) {
        bookTableBody.innerHTML = ''; // Clear existing table
        const booksToDisplay = selectedCategories.length > 0
            ? filteredBooks.filter(book => selectedCategories.includes(book.category))
            : filteredBooks; // Filter by selected categories if any, else show all

        if (booksToDisplay.length === 0) {
            bookTableBody.innerHTML = '<tr><td colspan="5" class="text-center">沒有找到符合條件的圖書。</td></tr>';
            console.log('No books to display.');
            return;
        }

        booksToDisplay.forEach(book => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${book.title}</td>
                <td>${book.author}</td>
                <td>${book.year}</td>
                <td>${book.category}</td>
                <td>
                    <button class="btn btn-sm btn-info edit-book-btn"
                            data-id="${book.id}"
                            data-title="${book.title}"
                            data-author="${book.author}"
                            data-year="${book.year}"
                            data-category="${book.category}">編輯</button>
                    <button class="btn btn-sm btn-danger delete-book-btn" data-id="${book.id}">刪除</button>
                </td>
            `;
            bookTableBody.appendChild(row);
        });

        // Attach event listeners for dynamically added buttons
        document.querySelectorAll('.edit-book-btn').forEach(button => {
            button.addEventListener('click', handleEditBook);
        });
        document.querySelectorAll('.delete-book-btn').forEach(button => {
            button.addEventListener('click', handleDeleteBook);
        });
        console.log('Books rendered.');
    }

    // Add Book
    if (addBookBtn) {
        addBookBtn.addEventListener('click', () => {
            if (!currentUser) {
                showAlert('請先登錄才能添加圖書。', 'danger');
                showSection(loginSection);
                console.warn('Attempted to add book without login.');
                return;
            }
            addBookForm.reset();
            showSection(addBookSection);
            console.log('Showing add book section.');
        });
    }

    if (addBookForm) {
        addBookForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const newBook = {
                id: String(Date.now()), // Unique ID
                title: document.getElementById('add-title').value,
                author: document.getElementById('add-author').value,
                year: parseInt(document.getElementById('add-year').value),
                category: document.getElementById('add-category').value
            };
            books.push(newBook);
            localStorage.setItem('books', JSON.stringify(books));
            showAlert('圖書添加成功！', 'success');
            renderBooks(); // Re-render the list
            showSection(bookListSection); // Go back to book list
            console.log('Book added:', newBook);
        });
    }

    // Edit Book
    function handleEditBook() {
        if (!currentUser) {
            showAlert('請先登錄才能編輯圖書。', 'danger');
            showSection(loginSection);
            console.warn('Attempted to edit book without login.');
            return;
        }
        const bookId = this.dataset.id;
        const book = books.find(b => b.id === bookId);

        if (book) {
            document.getElementById('edit-id').value = book.id;
            document.getElementById('edit-title').value = book.title;
            document.getElementById('edit-author').value = book.author;
            document.getElementById('edit-year').value = book.year;
            document.getElementById('edit-category').value = book.category;
            showSection(editBookSection);
            console.log('Editing book:', bookId);
        }
    }

    if (editBookForm) {
        editBookForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const updatedBook = {
                id: document.getElementById('edit-id').value,
                title: document.getElementById('edit-title').value,
                author: document.getElementById('edit-author').value,
                year: parseInt(document.getElementById('edit-year').value),
                category: document.getElementById('edit-category').value
            };

            const index = books.findIndex(b => b.id === updatedBook.id);
            if (index !== -1) {
                books[index] = updatedBook;
                localStorage.setItem('books', JSON.stringify(books));
                showAlert('圖書更新成功！', 'success');
                renderBooks();
                showSection(bookListSection);
                console.log('Book updated:', updatedBook);
            } else {
                showAlert('圖書更新失敗。', 'danger');
                console.error('Book update failed: Book not found.', updatedBook);
            }
        });
    }

    // Delete Book
    function handleDeleteBook() {
        if (!currentUser) {
            showAlert('請先登錄才能刪除圖書。', 'danger');
            showSection(loginSection);
            console.warn('Attempted to delete book without login.');
            return;
        }
        const bookId = this.dataset.id;
        if (confirm('確定要刪除這本圖書嗎？')) {
            books = books.filter(book => book.id !== bookId);
            localStorage.setItem('books', JSON.stringify(books));
            showAlert('圖書刪除成功！', 'success');
            renderBooks(); // Re-render the list
            console.log('Book deleted:', bookId);
        }
    }

    // Global Search (from Navbar)
    if (searchForm) {
        searchForm.addEventListener('submit', function(e) {
            e.preventDefault();
            if (!currentUser) {
                showAlert('請先登錄才能搜尋圖書。', 'danger');
                showSection(loginSection);
                console.warn('Attempted to search without login.');
                return;
            }
            const query = searchInputNav.value.toLowerCase();
            const filteredBooks = books.filter(book =>
                book.title.toLowerCase().includes(query) ||
                book.author.toLowerCase().includes(query) ||
                String(book.year).includes(query) ||
                book.category.toLowerCase().includes(query)
            );
            selectedCategories = []; // Clear category filters for global search
            categoryButtons.forEach(btn => btn.classList.remove('active')); // Deselect category buttons
            categorySearchInput.value = ''; // Clear category search input

            renderBooks(filteredBooks);
            showSection(bookListSection); // Show book list with search results
            console.log('Global search performed for:', query);
        });
    }
});