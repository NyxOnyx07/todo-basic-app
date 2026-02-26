// Todo App State
let todos = JSON.parse(localStorage.getItem('todos')) || [];
let currentFilter = 'all';

// DOM Elements
const todoInput = document.getElementById('todoInput');
const addBtn = document.getElementById('addBtn');
const todoList = document.getElementById('todoList');

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    renderApp();
    setupEventListeners();
});

// Setup Event Listeners
function setupEventListeners() {
    addBtn.addEventListener('click', addTodo);
    todoInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            addTodo();
        }
    });
}

// Add Todo
function addTodo() {
    const text = todoInput.value.trim();
    
    if (text === '') {
        todoInput.focus();
        return;
    }

    const todo = {
        id: Date.now(),
        text: text,
        completed: false,
        createdAt: new Date().toISOString()
    };

    todos.unshift(todo);
    saveTodos();
    todoInput.value = '';
    todoInput.focus();
    renderTodos();
}

// Toggle Todo Completion
function toggleTodo(id) {
    todos = todos.map(todo => 
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
    );
    saveTodos();
    renderTodos();
}

// Delete Todo
function deleteTodo(id) {
    todos = todos.filter(todo => todo.id !== id);
    saveTodos();
    renderTodos();
}

// Clear Completed Todos
function clearCompleted() {
    todos = todos.filter(todo => !todo.completed);
    saveTodos();
    renderTodos();
}

// Set Filter
function setFilter(filter) {
    currentFilter = filter;
    renderApp();
}

// Get Filtered Todos
function getFilteredTodos() {
    switch (currentFilter) {
        case 'active':
            return todos.filter(todo => !todo.completed);
        case 'completed':
            return todos.filter(todo => todo.completed);
        default:
            return todos;
    }
}

// Save to LocalStorage
function saveTodos() {
    localStorage.setItem('todos', JSON.stringify(todos));
}

// Render Complete App
function renderApp() {
    const container = document.querySelector('.container');
    
    // Check if filters exist, if not create them
    if (!document.querySelector('.filters')) {
        const filtersHTML = `
            <div class="filters">
                <button class="filter-btn ${currentFilter === 'all' ? 'active' : ''}" onclick="setFilter('all')">All</button>
                <button class="filter-btn ${currentFilter === 'active' ? 'active' : ''}" onclick="setFilter('active')">Active</button>
                <button class="filter-btn ${currentFilter === 'completed' ? 'active' : ''}" onclick="setFilter('completed')">Completed</button>
            </div>
            <div class="stats">
                <span class="todo-count"></span>
                <button class="clear-completed" onclick="clearCompleted()">Clear Completed</button>
            </div>
        `;
        
        const todoList = document.getElementById('todoList');
        todoList.insertAdjacentHTML('beforebegin', filtersHTML);
    } else {
        // Update active filter button
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.remove('active');
            if (btn.textContent.toLowerCase() === currentFilter) {
                btn.classList.add('active');
            }
        });
    }
    
    renderTodos();
    updateStats();
}

// Render Todos
function renderTodos() {
    const filteredTodos = getFilteredTodos();
    
    if (filteredTodos.length === 0) {
        todoList.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">📝</div>
                <div class="empty-state-text">
                    ${currentFilter === 'all' ? 'No tasks yet. Add one above!' : 
                      currentFilter === 'active' ? 'No active tasks!' : 
                      'No completed tasks!'}
                </div>
            </div>
        `;
        return;
    }

    todoList.innerHTML = filteredTodos.map(todo => `
        <li class="todo-item ${todo.completed ? 'completed' : ''}" data-id="${todo.id}">
            <input 
                type="checkbox" 
                class="todo-checkbox" 
                ${todo.completed ? 'checked' : ''}
                onchange="toggleTodo(${todo.id})"
            >
            <span class="todo-text">${escapeHtml(todo.text)}</span>
            <button class="delete-btn" onclick="deleteTodo(${todo.id})">Delete</button>
        </li>
    `).join('');
}

// Update Stats
function updateStats() {
    const activeCount = todos.filter(todo => !todo.completed).length;
    const todoCountEl = document.querySelector('.todo-count');
    
    if (todoCountEl) {
        todoCountEl.textContent = `${activeCount} ${activeCount === 1 ? 'task' : 'tasks'} remaining`;
    }
    
    const clearBtn = document.querySelector('.clear-completed');
    const completedCount = todos.filter(todo => todo.completed).length;
    
    if (clearBtn) {
        clearBtn.style.visibility = completedCount > 0 ? 'visible' : 'hidden';
    }
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}
