// === MOOD BUTTONS ===

// Step 1: Find all mood buttons on the page
const moodButtons = document.querySelectorAll('.mood-btn');

// Step 2: Loop through each button
moodButtons.forEach(function(button) {

  // Step 3: Listen for a click on each button
  button.addEventListener('click', function() {

    // Step 4: Remove 'active' from ALL buttons first
    moodButtons.forEach(function(btn) {
      btn.classList.remove('active');
    });

    // Step 5: Add 'active' only to the one that was clicked
    button.classList.add('active');

  });

});
// === TASK CHECKBOXES ===

// Find all todo items
const todoItems = document.querySelectorAll('.todo-item');

// Loop through each task
// === TASK DATA ===

// This is your real data — an array of task objects
let tasks = [
  { id: 1, text: "Review project brief",  done: true,  priority: "high" },
  { id: 2, text: "Reply to client email", done: true,  priority: "med"  },
  { id: 3, text: "Build planner layout",  done: false, priority: "high" },
  { id: 4, text: "Read 20 pages",         done: false, priority: "low"  },
  { id: 5, text: "Push code to GitHub",   done: false, priority: "med"  },
];

// This function DRAWS the tasks from data
function renderTasks() {
  const taskList = document.getElementById('task-list');

  // Clear whatever is there
  taskList.innerHTML = '';

  // Loop through each task and build HTML
  tasks.forEach(function(task) {
    const item = document.createElement('div');
    item.classList.add('todo-item');

    item.innerHTML = `
      <div class="checkbox ${task.done ? 'done' : ''}">
        ${task.done ? '✓' : ''}
      </div>
      <span class="${task.done ? 'done-text' : ''}">
        ${task.text}
      </span>
      <div class="priority-dot dot-${task.priority}"></div>
    `;

    // Click to toggle done
    item.addEventListener('click', function() {
      task.done = !task.done;
      renderTasks();
    });

    taskList.appendChild(item);
  });
}

// Draw tasks when page loads
renderTasks();


// === ADD NEW TASK ===

const addBtn = document.getElementById('add-task-btn');
const taskInput = document.getElementById('new-task-input');

addBtn.addEventListener('click', function() {
  const text = taskInput.value.trim();

  if (text === '') return; // Don't add empty tasks

  // Add new task to the data array
  tasks.push({
    id: tasks.length + 1,
    text: text,
    done: false,
    priority: "med"
  });

  // Clear the input
  taskInput.value = '';

  // Redraw the list
  renderTasks();
});

// Also add task when pressing Enter
taskInput.addEventListener('keypress', function(e) {
  if (e.key === 'Enter') {
    addBtn.click();
  }
});
// === HABIT DOTS ===

const habitDots = document.querySelectorAll('.hdot');

habitDots.forEach(function(dot) {
  dot.addEventListener('click', function() {

    if (dot.classList.contains('done')) {
      dot.classList.remove('done');
      dot.textContent = '';
    } else {
      dot.classList.add('done');
      dot.textContent = '✓';
    }

  });
});