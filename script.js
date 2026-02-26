(() => {
    "use strict";

    // ── DOM refs ──────────────────────────────────────
    const form = document.getElementById("todoForm");
    const input = document.getElementById("todoInput");
    const list = document.getElementById("todoList");
    const emptyState = document.getElementById("emptyState");
    const statusBar = document.getElementById("statusBar");
    const taskCount = document.getElementById("taskCount");
    const clearCompletedBtn = document.getElementById("clearCompletedBtn");
    const filterBtns = document.querySelectorAll(".filter-btn");

    // ── State ─────────────────────────────────────────
    const STORAGE_KEY = "todo-app-tasks";
    let todos = loadTodos();
    let currentFilter = "all";

    // ── Persistence ───────────────────────────────────
    function loadTodos() {
        try {
            return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
        } catch {
            return [];
        }
    }

    function saveTodos() {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
    }

    // ── Unique ID ─────────────────────────────────────
    function uid() {
        return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
    }

    // ── Render ────────────────────────────────────────
    function render() {
        const filtered = todos.filter((t) => {
            if (currentFilter === "active") return !t.done;
            if (currentFilter === "completed") return t.done;
            return true;
        });

        list.innerHTML = "";

        filtered.forEach((todo) => {
            const li = document.createElement("li");
            li.className = "todo-item" + (todo.done ? " completed" : "");
            li.dataset.id = todo.id;
            li.draggable = true;

            // Drag handle
            const handle = document.createElement("span");
            handle.className = "drag-handle";
            handle.textContent = "⠿";
            handle.setAttribute("aria-hidden", "true");

            // Checkbox
            const checkbox = document.createElement("span");
            checkbox.className = "checkbox";
            checkbox.setAttribute("role", "checkbox");
            checkbox.setAttribute("aria-checked", todo.done);
            checkbox.setAttribute("tabindex", "0");
            checkbox.addEventListener("click", () => toggleTodo(todo.id));
            checkbox.addEventListener("keydown", (e) => {
                if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    toggleTodo(todo.id);
                }
            });

            // Task text
            const text = document.createElement("span");
            text.className = "task-text";
            text.textContent = todo.text;

            // Double-click to edit
            text.addEventListener("dblclick", () => startEditing(li, text, todo));

            // Delete button
            const delBtn = document.createElement("button");
            delBtn.className = "delete-btn";
            delBtn.textContent = "✕";
            delBtn.setAttribute("aria-label", "Delete task");
            delBtn.addEventListener("click", () => deleteTodo(todo.id, li));

            li.append(handle, checkbox, text, delBtn);

            // Drag events
            li.addEventListener("dragstart", onDragStart);
            li.addEventListener("dragover", onDragOver);
            li.addEventListener("dragleave", onDragLeave);
            li.addEventListener("drop", onDrop);
            li.addEventListener("dragend", onDragEnd);

            list.appendChild(li);
        });

        updateStatusBar();
    }

    // ── CRUD ──────────────────────────────────────────
    function addTodo(text) {
        const trimmed = text.trim();
        if (!trimmed) return;
        todos.push({ id: uid(), text: trimmed, done: false });
        saveTodos();
        render();
    }

    function toggleTodo(id) {
        const todo = todos.find((t) => t.id === id);
        if (todo) {
            todo.done = !todo.done;
            saveTodos();
            render();
        }
    }

    function deleteTodo(id, li) {
        li.classList.add("removing");
        li.addEventListener("animationend", () => {
            todos = todos.filter((t) => t.id !== id);
            saveTodos();
            render();
        }, { once: true });
    }

    function clearCompleted() {
        todos = todos.filter((t) => !t.done);
        saveTodos();
        render();
    }

    // ── Inline Editing ────────────────────────────────
    function startEditing(li, textEl, todo) {
        if (todo.done) return; // don't edit completed tasks
        textEl.contentEditable = "true";
        textEl.focus();

        // Select all text
        const range = document.createRange();
        range.selectNodeContents(textEl);
        const sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(range);

        function commit() {
            textEl.contentEditable = "false";
            const newText = textEl.textContent.trim();
            if (newText) {
                todo.text = newText;
            } else {
                textEl.textContent = todo.text; // revert if empty
            }
            saveTodos();
        }

        textEl.addEventListener("blur", commit, { once: true });
        textEl.addEventListener("keydown", (e) => {
            if (e.key === "Enter") {
                e.preventDefault();
                textEl.blur();
            }
            if (e.key === "Escape") {
                textEl.textContent = todo.text;
                textEl.blur();
            }
        });
    }

    // ── Filters ───────────────────────────────────────
    filterBtns.forEach((btn) => {
        btn.addEventListener("click", () => {
            currentFilter = btn.dataset.filter;
            filterBtns.forEach((b) => b.classList.remove("active"));
            btn.classList.add("active");
            render();
        });
    });

    // ── Status Bar ────────────────────────────────────
    function updateStatusBar() {
        const total = todos.length;
        const active = todos.filter((t) => !t.done).length;
        const completed = total - active;

        if (total === 0) {
            emptyState.hidden = false;
            statusBar.hidden = true;
            return;
        }

        emptyState.hidden = true;
        statusBar.hidden = false;
        taskCount.textContent = `${active} item${active !== 1 ? "s" : ""} left`;
        clearCompletedBtn.hidden = completed === 0;
    }

    // ── Drag & Drop Reorder ───────────────────────────
    let dragId = null;

    function onDragStart(e) {
        dragId = this.dataset.id;
        this.classList.add("dragging");
        e.dataTransfer.effectAllowed = "move";
    }

    function onDragOver(e) {
        e.preventDefault();
        e.dataTransfer.dropEffect = "move";
        this.classList.add("drag-over");
    }

    function onDragLeave() {
        this.classList.remove("drag-over");
    }

    function onDrop(e) {
        e.preventDefault();
        this.classList.remove("drag-over");
        const dropId = this.dataset.id;
        if (dragId && dragId !== dropId) {
            const fromIdx = todos.findIndex((t) => t.id === dragId);
            const toIdx = todos.findIndex((t) => t.id === dropId);
            if (fromIdx !== -1 && toIdx !== -1) {
                const [moved] = todos.splice(fromIdx, 1);
                todos.splice(toIdx, 0, moved);
                saveTodos();
                render();
            }
        }
    }

    function onDragEnd() {
        this.classList.remove("dragging");
        dragId = null;
    }

    // ── Event Listeners ───────────────────────────────
    form.addEventListener("submit", (e) => {
        e.preventDefault();
        addTodo(input.value);
        input.value = "";
        input.focus();
    });

    clearCompletedBtn.addEventListener("click", clearCompleted);

    // ── Initial Render ────────────────────────────────
    render();
})();
