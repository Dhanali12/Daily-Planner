// === MOOD BUTTONS ===

const moodButtons = document.querySelectorAll('.mood-btn');

moodButtons.forEach(function(button) {
  button.addEventListener('click', function() {
    moodButtons.forEach(function(btn) {
      btn.classList.remove('active');
    });
    button.classList.add('active');
  });
});


// === TASK DATA ===

let tasks = [
  { id: 1, text: "Review project brief",  done: true,  priority: "high" },
  { id: 2, text: "Reply to client email", done: true,  priority: "med"  },
  { id: 3, text: "Build planner layout",  done: false, priority: "high" },
  { id: 4, text: "Read 20 pages",         done: false, priority: "low"  },
  { id: 5, text: "Push code to GitHub",   done: false, priority: "med"  },
];

function renderTasks() {
  const taskList = document.getElementById('task-list');
  taskList.innerHTML = '';

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
      <button class="delete-btn">✕</button>
    `;

    item.addEventListener('click', function() {
      task.done = !task.done;
      renderTasks();
    });

    const deleteBtn = item.querySelector('.delete-btn');
    deleteBtn.addEventListener('click', function(e) {
      e.stopPropagation();
      tasks = tasks.filter(t => t.id !== task.id);
      renderTasks();
    });

    taskList.appendChild(item);
  });
}

renderTasks();


// === ADD NEW TASK ===

const addBtn = document.getElementById('add-task-btn');
const taskInput = document.getElementById('new-task-input');

addBtn.addEventListener('click', function() {
  const text = taskInput.value.trim();
  if (text === '') return;

  tasks.push({
    id: tasks.length + 1,
    text: text,
    done: false,
    priority: "med"
  });

  taskInput.value = '';
  renderTasks();
});

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