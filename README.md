# Enhanced Todo List App

A modern, feature-rich todo list application with an intuitive interface and advanced functionality.

## 🚀 Features

### Core Functionality
- ✅ **Add, Edit, and Delete Tasks** - Full CRUD operations for managing todos
- 📝 **Inline Editing** - Click the edit button (✏️) or press 'E' to edit tasks in-place
- ✔️ **Task Completion** - Mark tasks as complete/incomplete with checkboxes
- 💾 **Persistent Storage** - All data saved to browser localStorage

### Organization & Filtering
- 🔍 **Search** - Real-time text search across all tasks
- 🎯 **Priority Levels** - High, Medium, and Low priority with color coding
  - High: Red border
  - Medium: Orange border  
  - Low: Green border
- 📅 **Due Dates** - Set optional due dates with relative time display
  - Shows "Due today", "Due tomorrow", "Due in X days"
  - Overdue items highlighted in red
- 🔀 **Sorting** - Sort by date or priority
- 📊 **Filters** - View All, Active, or Completed tasks

### User Experience
- 🌙 **Dark Mode** - Toggle between light and dark themes (persists across sessions)
- 🎨 **Modern UI** - Gradient backgrounds, smooth animations, and hover effects
- 📱 **Responsive Design** - Optimized for mobile, tablet, and desktop
- 🔔 **Toast Notifications** - Visual feedback for all actions
- 📏 **Character Counter** - Shows remaining characters (200 max)
- ⌨️ **Keyboard Navigation** - Full keyboard support for power users

### Advanced Features
- 🔄 **Drag & Drop** - Reorder tasks by dragging them
- 📈 **Task Statistics** - Shows remaining task count
- 🗑️ **Bulk Actions** - Clear all completed tasks at once
- ⏱️ **Timestamps** - Tracks when tasks were created

## ⌨️ Keyboard Shortcuts

When focused on a task checkbox:
- **Arrow Up/Down** - Navigate between tasks
- **Space** - Toggle task completion
- **Delete/Backspace** - Delete the task
- **E** - Edit the task
- **Enter** (while editing) - Save changes
- **Escape** (while editing) - Cancel editing

## 🎯 How to Use

### Adding a Task
1. Type your task in the input field
2. Select priority level (Low/Medium/High)
3. Optionally set a due date
4. Click "Add" or press Enter

### Editing a Task
1. Click the ✏️ edit button
2. Or press 'E' while the task checkbox is focused
3. Modify the text
4. Press Enter to save or Escape to cancel

### Organizing Tasks
- **Search**: Type in the search box to filter tasks
- **Filter**: Click All/Active/Completed to view specific tasks
- **Sort**: Use the sort dropdown to sort by date or priority
- **Reorder**: Drag and drop tasks to rearrange them

### Dark Mode
- Click the 🌙/☀️ button in the header to toggle dark mode
- Your preference is automatically saved

## 🏗️ Technical Details

### Built With
- **HTML5** - Semantic markup with ARIA labels for accessibility
- **CSS3** - Modern styling with gradients, animations, and flexbox
- **Vanilla JavaScript** - No frameworks or dependencies

### Browser Compatibility
- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

### Data Storage
All data is stored in the browser's localStorage:
- `todos` - Array of todo items with metadata
- `theme` - User's theme preference (light/dark)

### File Structure
```
todo-basic-app/
├── index.html       # HTML structure
├── style.css        # Styling and theming
├── script.js        # Application logic
└── README.md        # This file
```

## 📊 Statistics

- **Total Lines of Code**: ~1,100
- **JavaScript Functions**: 25+
- **CSS Classes**: 50+
- **Max Task Length**: 200 characters

## 🎨 Color Scheme

### Light Mode
- Primary: Purple gradient (#667eea → #764ba2)
- Background: White
- Text: Dark gray (#333)

### Dark Mode  
- Primary: Purple gradient (#667eea → #764ba2)
- Background: Dark blue-gray (#1e272e)
- Text: White

## 🔒 Security

- **XSS Prevention**: All user input is sanitized via `escapeHtml()` function
- **No External Dependencies**: Reduces attack surface
- **Client-Side Only**: No data sent to external servers

## 🚀 Getting Started

1. Open `index.html` in a web browser
2. Or serve via a local web server:
   ```bash
   python3 -m http.server 8080
   ```
3. Navigate to `http://localhost:8080`

## 📝 Future Enhancements (Not Yet Implemented)

- Bulk selection with multi-select checkboxes
- Export/Import todo lists (JSON/CSV)
- Task categories/tags
- Undo/Redo functionality
- Recurring tasks
- Sub-tasks/nested todos

## 📄 License

This is a demonstration project. Feel free to use and modify as needed.

## 🤝 Contributing

This is a standalone project, but suggestions for improvements are welcome!

---

**Enjoy organizing your tasks! 📋✨**
