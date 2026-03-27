// ─── State ────────────────────────────────────────────────────────────────────
let todos = JSON.parse(localStorage.getItem('todos')) || [];
let currentFilter = 'all';

// ─── DOM ──────────────────────────────────────────────────────────────────────
const todoInput         = document.getElementById('todoInput');
const addBtn            = document.getElementById('addBtn');
const todoList          = document.getElementById('todoList');
const clearCompletedBtn = document.getElementById('clearCompleted');
const themeToggleBtn    = document.getElementById('themeToggle');
const progressBar       = document.getElementById('progressBar');
const progressBarWrap   = document.querySelector('.progress-bar-wrap');

// ─── Theme ────────────────────────────────────────────────────────────────────
function initTheme() {
    const saved = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    applyTheme(saved || (prefersDark ? 'dark' : 'light'));
}

function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    themeToggleBtn.textContent = theme === 'dark' ? '\u2600\uFE0F' : '\uD83C\uDF19';
    localStorage.setItem('theme', theme);
}

function toggleTheme() {
    const current = document.documentElement.getAttribute('data-theme');
    applyTheme(current === 'dark' ? 'light' : 'dark');
}

// ─── Init ─────────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    setupEventListeners();
    render();
});

// ─── Event Listeners ──────────────────────────────────────────────────────────
function setupEventListeners() {
    addBtn.addEventListener('click', addTodo);
    todoInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') addTodo();
    });
    clearCompletedBtn.addEventListener('click', clearCompleted);
    themeToggleBtn.addEventListener('click', toggleTheme);
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', () => setFilter(btn.dataset.filter));
    });
}

// ─── Add ──────────────────────────────────────────────────────────────────────
function addTodo() {
    const text = todoInput.value.trim();

    if (!text) {
        todoInput.classList.add('shake');
        todoInput.addEventListener('animationend', () => todoInput.classList.remove('shake'), { once: true });
        todoInput.focus();
        return;
    }

    const todo = {
        id: crypto.randomUUID(),
        text,
        completed: false,
        createdAt: new Date().toISOString(),
    };

    todos.unshift(todo);
    save();
    todoInput.value = '';
    todoInput.focus();
    render();
}

// ─── Toggle ───────────────────────────────────────────────────────────────────
function toggleTodo(id) {
    todos = todos.map(t => t.id === id ? { ...t, completed: !t.completed } : t);
    save();
    render();
}

// ─── Delete ───────────────────────────────────────────────────────────────────
function deleteTodo(id) {
    const item = todoList.querySelector(`[data-id="${id}"]`);
    if (item) {
        item.classList.add('deleting');
        item.addEventListener('transitionend', () => {
            todos = todos.filter(t => t.id !== id);
            save();
            render();
        }, { once: true });
    } else {
        todos = todos.filter(t => t.id !== id);
        save();
        render();
    }
}

// ─── Inline Edit ──────────────────────────────────────────────────────────────
function startEdit(id, el) {
    el.contentEditable = 'true';
    el.focus();
    // Move cursor to end
    const range = document.createRange();
    range.selectNodeContents(el);
    range.collapse(false);
    const sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(range);

    function commitEdit() {
        el.contentEditable = 'false';
        const newText = el.textContent.trim();
        if (newText) {
            todos = todos.map(t => t.id === id ? { ...t, text: newText } : t);
            save();
        }
        render();
    }

    el.addEventListener('blur', commitEdit, { once: true });
    el.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            el.blur();
        } else if (e.key === 'Escape') {
            el.removeEventListener('blur', commitEdit);
            el.contentEditable = 'false';
            render();
        }
    });
}

// ─── Clear Completed ──────────────────────────────────────────────────────────
function clearCompleted() {
    todos = todos.filter(t => !t.completed);
    save();
    render();
}

// ─── Filter ───────────────────────────────────────────────────────────────────
function setFilter(filter) {
    currentFilter = filter;
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.filter === filter);
    });
    render();
}

function getFiltered() {
    if (currentFilter === 'active')    return todos.filter(t => !t.completed);
    if (currentFilter === 'completed') return todos.filter(t => t.completed);
    return todos;
}

// ─── Render ───────────────────────────────────────────────────────────────────
function render() {
    renderTodos();
    updateStats();
}

function renderTodos() {
    const filtered = getFiltered();

    if (filtered.length === 0) {
        const messages = {
            all:       'No tasks yet. Add one above!',
            active:    'No active tasks!',
            completed: 'No completed tasks!',
        };
        todoList.innerHTML = `
            <li class="empty-state" role="presentation">
                <div class="empty-state-icon">&#x1F4DD;</div>
                <div class="empty-state-text">${messages[currentFilter]}</div>
            </li>`;
        return;
    }

    todoList.innerHTML = filtered.map(todo => `
        <li class="todo-item ${todo.completed ? 'completed' : ''}" data-id="${todo.id}">
            <input
                type="checkbox"
                class="todo-checkbox"
                ${todo.completed ? 'checked' : ''}
                aria-label="Mark '${escapeHtml(todo.text)}' as ${todo.completed ? 'incomplete' : 'complete'}"
                onchange="toggleTodo('${todo.id}')"
            >
            <span
                class="todo-text"
                title="Double-click to edit"
                ondblclick="startEdit('${todo.id}', this)"
            >${escapeHtml(todo.text)}</span>
            <button
                class="delete-btn"
                aria-label="Delete task"
                onclick="deleteTodo('${todo.id}')"
            >&#x2715;</button>
        </li>
    `).join('');
}

function updateStats() {
    const total     = todos.length;
    const completed = todos.filter(t => t.completed).length;
    const active    = total - completed;

    const todoCountEl = document.querySelector('.todo-count');
    if (todoCountEl) {
        todoCountEl.textContent = `${active} ${active === 1 ? 'task' : 'tasks'} remaining`;
    }

    const clearBtn = document.getElementById('clearCompleted');
    if (clearBtn) {
        clearBtn.style.visibility = completed > 0 ? 'visible' : 'hidden';
    }

    // Progress bar
    const pct = total === 0 ? 0 : Math.round((completed / total) * 100);
    progressBar.style.width = `${pct}%`;
    progressBarWrap.setAttribute('aria-valuenow', pct);
}

// ─── Persist ──────────────────────────────────────────────────────────────────
function save() {
    localStorage.setItem('todos', JSON.stringify(todos));
}

// ─── Utilities ────────────────────────────────────────────────────────────────
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}
