const auth = {
    // Хранилище пользователей
    users: JSON.parse(localStorage.getItem('ecotour_users')) || [
        { 
            id: 1, 
            username: 'editor1', 
            password: 'temp1234',
            email: 'editor@example.com',
            role: 'editor',
            firstLogin: false
        },
        { 
            id: 2, 
            username: 'admin1', 
            password: 'temp5678', 
            email: 'admin@example.com',
            role: 'admin',
            firstLogin: false
        }
    ],
    
    // Хранилище разделов сайта
    sections: JSON.parse(localStorage.getItem('ecotour_sections')) || [
        { id: 1, name: 'Главная', slug: 'index' },
        { id: 2, name: 'Новости', slug: 'news' },
        { id: 3, name: 'FAQ', slug: 'faq' }
    ],
    
    // Хранилище контента страниц
    content: JSON.parse(localStorage.getItem('ecotour_content')) || {
        main: '<h1>Добро пожаловать в EcoTour</h1><p>Текст главной страницы...</p>',
        news: '<h2>Новости</h2><p>Последние новости нашего проекта...</p>',
        faq: '<h2>Частые вопросы</h2><div class="faq-item"><h3>Как забронировать тур?</h3><p>Выберите тур и нажмите "Забронировать".</p></div>'
    },
    
    // Текущий авторизованный пользователь
    currentUser: null,
    
    // === Методы для работы с пользователями ===
    
    /**
     * Аутентификация пользователя
     */
    login: function(username, password) {
        const user = this.users.find(u => u.username === username && u.password === password);
        if (user) {
            this.currentUser = user;
            localStorage.setItem('ecotour_currentUser', JSON.stringify(user));
            return true;
        }
        return false;
    },
    
    /**
     * Добавление нового пользователя
     */
    addUser: function(user) {
        user.id = this.users.length > 0 ? Math.max(...this.users.map(u => u.id)) + 1 : 1;
        this.users.push(user);
        localStorage.setItem('ecotour_users', JSON.stringify(this.users));
    },
    
    /**
     * Удаление пользователя
     */
    deleteUser: function(id) {
        this.users = this.users.filter(u => u.id !== id);
        localStorage.setItem('ecotour_users', JSON.stringify(this.users));
    },
    
    /**
     * Смена пароля пользователя
     */
    changePassword: function(userId, newPassword) {
        const user = this.users.find(u => u.id === userId);
        if (user) {
            user.password = newPassword;
            user.firstLogin = false;
            localStorage.setItem('ecotour_users', JSON.stringify(this.users));
            return true;
        }
        return false;
    },
    
    // === Методы для работы с разделами ===
    
    /**
     * Добавление нового раздела
     */
    addSection: function(section) {
        section.id = this.sections.length > 0 ? Math.max(...this.sections.map(s => s.id)) + 1 : 1;
        this.sections.push(section);
        localStorage.setItem('ecotour_sections', JSON.stringify(this.sections));
    },
    
    /**
     * Удаление раздела
     */
    deleteSection: function(id) {
        this.sections = this.sections.filter(s => s.id !== id);
        localStorage.setItem('ecotour_sections', JSON.stringify(this.sections));
    },
    
    // === Методы для работы с контентом ===
    
    /**
     * Получение контента страницы
     */
    getContent: function(page) {
        return this.content[page] || '';
    },
    
    /**
     * Сохранение контента страницы
     */
    saveContent: function(page, content) {
        this.content[page] = content;
        localStorage.setItem('ecotour_content', JSON.stringify(this.content));
    },
    
    // === Общие методы ===
    
    /**
     * Получение текущего пользователя
     */
    getCurrentUser: function() {
        if (!this.currentUser) {
            const userJson = localStorage.getItem('ecotour_currentUser');
            if (userJson) {
                this.currentUser = JSON.parse(userJson);
            }
        }
        return this.currentUser;
    },
    
    
    /**
     * Выход из системы
     */
    logout: function() {
        this.currentUser = null;
        localStorage.removeItem('ecotour_currentUser');
    },
    
    /**
     * Проверка авторизации
     */
    isAuthenticated: function() {
        return this.getCurrentUser() !== null;
    },
    
    /**
     * Проверка роли пользователя
     */
    hasRole: function(role) {
        const user = this.getCurrentUser();
        return user && user.role === role;
    }
    
};

// Инициализация хранилищ при первом запуске
if (!localStorage.getItem('ecotour_users')) {
    localStorage.setItem('ecotour_users', JSON.stringify(auth.users));
}
if (!localStorage.getItem('ecotour_sections')) {
    localStorage.setItem('ecotour_sections', JSON.stringify(auth.sections));
}
if (!localStorage.getItem('ecotour_content')) {
    localStorage.setItem('ecotour_content', JSON.stringify(auth.content));
}
