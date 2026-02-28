// Todo App State
let todos = JSON.parse(localStorage.getItem('todos')) || [];
let currentFilter = 'all';
let searchQuery = '';
let currentSort = 'date'; // date, priority

// DOM Elements
const todoInput = document.getElementById('todoInput');
const addBtn = document.getElementById('addBtn');
const todoList = document.getElementById('todoList');
let searchInput = null;

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    renderApp();
    setupEventListeners();
    setupKeyboardNavigation();
});

// Setup Event Listeners
function setupEventListeners() {
    addBtn.addEventListener('click', addTodo);
    todoInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            addTodo();
        }
    });
    
    // Character count
    todoInput.addEventListener('input', (e) => {
        const charCount = document.getElementById('charCount');
        if (charCount) {
            const count = e.target.value.length;
            charCount.textContent = `${count}/200`;
            charCount.style.color = count > 180 ? '#ff4757' : '#999';
        }
    });
    
    // Dark mode toggle
    const darkModeToggle = document.getElementById('darkModeToggle');
    if (darkModeToggle) {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'dark') {
            document.body.classList.add('dark-mode');
            darkModeToggle.textContent = '☀️';
        }
        
        darkModeToggle.addEventListener('click', () => {
            document.body.classList.toggle('dark-mode');
            const isDark = document.body.classList.contains('dark-mode');
            darkModeToggle.textContent = isDark ? '☀️' : '🌙';
            localStorage.setItem('theme', isDark ? 'dark' : 'light');
        });
    }
}

// Add Todo
function addTodo() {
    const text = todoInput.value.trim();
    
    if (text === '') {
        todoInput.focus();
        return;
    }

    const prioritySelect = document.getElementById('prioritySelect');
    const dueDateInput = document.getElementById('dueDateInput');

    const todo = {
        id: Date.now(),
        text: text,
        completed: false,
        priority: prioritySelect ? prioritySelect.value : 'medium',
        dueDate: dueDateInput && dueDateInput.value ? dueDateInput.value : null,
        createdAt: new Date().toISOString()
    };

    todos.unshift(todo);
    saveTodos();
    todoInput.value = '';
    if (dueDateInput) dueDateInput.value = '';
    todoInput.focus();
    renderTodos();
    showToast('Task added');
}

// Toggle Todo Completion
function toggleTodo(id) {
    todos = todos.map(todo => 
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
    );
    saveTodos();
    renderTodos();
    showToast('Task updated');
}

// Edit Todo
function editTodo(id) {
    const todoItem = document.querySelector(`[data-id="${id}"]`);
    const todoText = todoItem.querySelector('.todo-text');
    const currentText = todos.find(t => t.id === id)?.text || '';
    
    // Create input for editing
    const input = document.createElement('input');
    input.type = 'text';
    input.className = 'edit-input';
    input.value = currentText;
    input.maxLength = 200;
    
    // Replace text with input
    todoText.replaceWith(input);
    input.focus();
    input.select();
    
    // Save on Enter
    input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            saveEdit(id, input.value.trim(), input);
        }
    });
    
    // Cancel on Escape
    input.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            renderTodos();
        }
    });
    
    // Save on blur
    input.addEventListener('blur', () => {
        setTimeout(() => saveEdit(id, input.value.trim(), input), 100);
    });
}

function saveEdit(id, newText, input) {
    if (newText === '') {
        renderTodos();
        return;
    }
    
    todos = todos.map(todo => 
        todo.id === id ? { ...todo, text: newText } : todo
    );
    saveTodos();
    renderTodos();
    showToast('Task edited');
}

// Delete Todo
function deleteTodo(id) {
    if (confirm('Delete this task?')) {
        todos = todos.filter(todo => todo.id !== id);
        saveTodos();
        renderTodos();
        showToast('Task deleted');
    }
}

// Clear Completed Todos
function clearCompleted() {
    const completedCount = todos.filter(todo => todo.completed).length;
    if (completedCount === 0) return;
    
    if (confirm(`Delete ${completedCount} completed task${completedCount > 1 ? 's' : ''}?`)) {
        todos = todos.filter(todo => !todo.completed);
        saveTodos();
        renderTodos();
        showToast('Completed tasks cleared');
    }
}

// Set Filter
function setFilter(filter) {
    currentFilter = filter;
    renderApp();
}

// Set Sort
function setSort(sort) {
    currentSort = sort;
    renderTodos();
}

// Search Todos
function searchTodos(query) {
    searchQuery = query.toLowerCase();
    renderTodos();
}

// Get Filtered Todos
function getFilteredTodos() {
    let filtered = todos;
    
    // Apply status filter
    switch (currentFilter) {
        case 'active':
            filtered = filtered.filter(todo => !todo.completed);
            break;
        case 'completed':
            filtered = filtered.filter(todo => todo.completed);
            break;
    }
    
    // Apply search filter
    if (searchQuery) {
        filtered = filtered.filter(todo => 
            todo.text.toLowerCase().includes(searchQuery)
        );
    }
    
    // Apply sorting
    if (currentSort === 'priority') {
        const priorityOrder = { high: 0, medium: 1, low: 2 };
        filtered.sort((a, b) => {
            const aPriority = priorityOrder[a.priority || 'medium'];
            const bPriority = priorityOrder[b.priority || 'medium'];
            return aPriority - bPriority;
        });
    }
    
    return filtered;
}

// Save to LocalStorage
function saveTodos() {
    localStorage.setItem('todos', JSON.stringify(todos));
}

// Render Complete App
function renderApp() {
    const container = document.querySelector('.container');
    
    // Check if search bar exists
    if (!document.querySelector('.search-bar')) {
        const searchHTML = `
            <div class="search-bar">
                <input type="text" id="searchInput" placeholder="🔍 Search tasks..." oninput="searchTodos(this.value)">
                <select id="sortSelect" onchange="setSort(this.value)" aria-label="Sort tasks">
                    <option value="date">Sort by Date</option>
                    <option value="priority">Sort by Priority</option>
                </select>
            </div>
        `;
        const inputSection = document.querySelector('.input-section');
        inputSection.insertAdjacentHTML('afterend', searchHTML);
        searchInput = document.getElementById('searchInput');
    }
    
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

    todoList.innerHTML = filteredTodos.map(todo => {
        const relativeTime = getRelativeTime(todo.dueDate);
        const overdue = isOverdue(todo.dueDate);
        const priorityClass = todo.priority ? `priority-${todo.priority}` : '';
        
        return `
        <li class="todo-item ${todo.completed ? 'completed' : ''} ${priorityClass} ${overdue ? 'overdue' : ''}" 
            data-id="${todo.id}" 
            draggable="true"
            ondragstart="handleDragStart(event)"
            ondragover="handleDragOver(event)"
            ondrop="handleDrop(event)"
            ondragend="handleDragEnd(event)">
            <input 
                type="checkbox" 
                class="todo-checkbox" 
                ${todo.completed ? 'checked' : ''}
                onchange="toggleTodo(${todo.id})"
                aria-label="Mark as ${todo.completed ? 'incomplete' : 'complete'}"
            >
            <div class="todo-content">
                <span class="todo-text">${escapeHtml(todo.text)}</span>
                ${todo.priority ? `<span class="priority-badge priority-${todo.priority}">${todo.priority}</span>` : ''}
                ${relativeTime ? `<span class="due-date ${overdue ? 'overdue' : ''}">${relativeTime}</span>` : ''}
            </div>
            <div class="todo-actions">
                <button class="edit-btn" onclick="editTodo(${todo.id})" aria-label="Edit task">✏️</button>
                <button class="delete-btn" onclick="deleteTodo(${todo.id})" aria-label="Delete task">Delete</button>
            </div>
        </li>
        `;
    }).join('');
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

// Toast Notification System
function showToast(message, duration = 2000) {
    // Remove existing toast
    const existingToast = document.querySelector('.toast');
    if (existingToast) {
        existingToast.remove();
    }
    
    // Create toast
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    document.body.appendChild(toast);
    
    // Show toast
    setTimeout(() => toast.classList.add('show'), 10);
    
    // Hide and remove toast
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, duration);
}

// Get relative time for due dates
function getRelativeTime(dateString) {
    if (!dateString) return null;
    
    const dueDate = new Date(dateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    dueDate.setHours(0, 0, 0, 0);
    
    const diffTime = dueDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return `Overdue by ${Math.abs(diffDays)} day${Math.abs(diffDays) !== 1 ? 's' : ''}`;
    if (diffDays === 0) return 'Due today';
    if (diffDays === 1) return 'Due tomorrow';
    if (diffDays <= 7) return `Due in ${diffDays} days`;
    
    return dueDate.toLocaleDateString();
}

// Check if task is overdue
function isOverdue(dateString) {
    if (!dateString) return false;
    const dueDate = new Date(dateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    dueDate.setHours(0, 0, 0, 0);
    return dueDate < today;
}

// Drag and Drop functionality
let draggedElement = null;

function handleDragStart(e) {
    draggedElement = e.target;
    e.target.style.opacity = '0.5';
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', e.target.innerHTML);
}

function handleDragOver(e) {
    if (e.preventDefault) {
        e.preventDefault();
    }
    e.dataTransfer.dropEffect = 'move';
    return false;
}

function handleDrop(e) {
    if (e.stopPropagation) {
        e.stopPropagation();
    }
    
    if (draggedElement !== e.currentTarget) {
        const draggedId = parseInt(draggedElement.dataset.id);
        const targetId = parseInt(e.currentTarget.dataset.id);
        
        const draggedIndex = todos.findIndex(t => t.id === draggedId);
        const targetIndex = todos.findIndex(t => t.id === targetId);
        
        // Swap positions
        const temp = todos[draggedIndex];
        todos[draggedIndex] = todos[targetIndex];
        todos[targetIndex] = temp;
        
        saveTodos();
        renderTodos();
    }
    
    return false;
}

function handleDragEnd(e) {
    e.target.style.opacity = '1';
    draggedElement = null;
}

// Keyboard navigation
function setupKeyboardNavigation() {
    document.addEventListener('keydown', (e) => {
        const focusedItem = document.activeElement.closest('.todo-item');
        
        if (!focusedItem) return;
        
        const todoId = parseInt(focusedItem.dataset.id);
        const allItems = Array.from(document.querySelectorAll('.todo-item'));
        const currentIndex = allItems.indexOf(focusedItem);
        
        switch(e.key) {
            case 'ArrowDown':
                e.preventDefault();
                if (currentIndex < allItems.length - 1) {
                    allItems[currentIndex + 1].querySelector('.todo-checkbox').focus();
                }
                break;
                
            case 'ArrowUp':
                e.preventDefault();
                if (currentIndex > 0) {
                    allItems[currentIndex - 1].querySelector('.todo-checkbox').focus();
                }
                break;
                
            case 'Delete':
            case 'Backspace':
                if (e.target.classList.contains('todo-checkbox')) {
                    e.preventDefault();
                    deleteTodo(todoId);
                }
                break;
                
            case 'e':
            case 'E':
                if (e.target.classList.contains('todo-checkbox')) {
                    e.preventDefault();
                    editTodo(todoId);
                }
                break;
        }
    });
}
