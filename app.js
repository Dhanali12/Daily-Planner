// === MOOD BUTTONS ===

const moodButtons = document.querySelectorAll('.mood-btn');

// Load saved mood on startup
const savedMood = localStorage.getItem('planner-mood');
if (savedMood) {
  moodButtons.forEach(function(btn) {
    btn.classList.remove('active');
  });
  const savedBtn = document.getElementById(savedMood);
  if (savedBtn) savedBtn.classList.add('active');
}

// Save mood on click
moodButtons.forEach(function(button) {
  button.addEventListener('click', function() {
    moodButtons.forEach(function(btn) {
      btn.classList.remove('active');
    });
    button.classList.add('active');
    localStorage.setItem('planner-mood', button.id);
  });
});


// === TASK DATA ===

function saveTasks() {
  localStorage.setItem('planner-tasks', JSON.stringify(tasks));
}

function loadTasks() {
  const saved = localStorage.getItem('planner-tasks');
  return saved ? JSON.parse(saved) : [
    { id: 1, text: "Review project brief",  done: true,  priority: "high" },
    { id: 2, text: "Reply to client email", done: true,  priority: "med"  },
    { id: 3, text: "Build planner layout",  done: false, priority: "high" },
    { id: 4, text: "Read 20 pages",         done: false, priority: "low"  },
    { id: 5, text: "Push code to GitHub",   done: false, priority: "med"  },
  ];
}

let tasks = loadTasks();

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
      saveTasks();
      renderTasks();
    });

    const deleteBtn = item.querySelector('.delete-btn');
    deleteBtn.addEventListener('click', function(e) {
      e.stopPropagation();
      tasks = tasks.filter(t => t.id !== task.id);
      saveTasks();
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
    id: Date.now(),
    text: text,
    done: false,
    priority: "med"
  });

  taskInput.value = '';
  saveTasks();
  renderTasks();
});

taskInput.addEventListener('keypress', function(e) {
  if (e.key === 'Enter') {
    addBtn.click();
  }
});


// === GRATITUDE — save as you type ===

const gratitudeInputs = document.querySelectorAll('.gratitude-input');

gratitudeInputs.forEach(function(input, index) {
  const saved = localStorage.getItem('planner-gratitude-' + index);
  if (saved) input.value = saved;

  input.addEventListener('input', function() {
    localStorage.setItem('planner-gratitude-' + index, input.value);
  });
});


// === NOTES — save as you type ===

const notesArea = document.querySelector('.notes-area');

if (notesArea) {
  const savedNotes = localStorage.getItem('planner-notes');
  if (savedNotes) notesArea.value = savedNotes;

  notesArea.addEventListener('input', function() {
    localStorage.setItem('planner-notes', notesArea.value);
  });
}


// === HABIT DOTS — save state ===

function saveHabits() {
  const habitState = [];
  document.querySelectorAll('.habit-row').forEach(function(row) {
    const rowState = [];
    row.querySelectorAll('.hdot').forEach(function(dot) {
      rowState.push(dot.classList.contains('done'));
    });
    habitState.push(rowState);
  });
  localStorage.setItem('planner-habits', JSON.stringify(habitState));
}

function loadHabits() {
  const saved = localStorage.getItem('planner-habits');
  if (!saved) return;

  const habitState = JSON.parse(saved);
  document.querySelectorAll('.habit-row').forEach(function(row, rowIndex) {
    if (!habitState[rowIndex]) return;
    row.querySelectorAll('.hdot').forEach(function(dot, dotIndex) {
      if (habitState[rowIndex][dotIndex]) {
        dot.classList.add('done');
        dot.textContent = '✓';
      }
    });
  });
}

loadHabits();

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
    saveHabits();
  });
});
// === INSIGHTS PANEL ===

const insightsToggle = document.getElementById('insights-toggle');
const insightsPanel = document.getElementById('insights-panel');
const insightsClose = document.getElementById('insights-close');
const insightsOverlay = document.getElementById('insights-overlay');

insightsToggle.addEventListener('click', function() {
  insightsPanel.classList.add('open');
  insightsOverlay.classList.add('show');
  renderInsights();
});

insightsClose.addEventListener('click', closeInsights);
insightsOverlay.addEventListener('click', closeInsights);

function closeInsights() {
  insightsPanel.classList.remove('open');
  insightsOverlay.classList.remove('show');
}

function renderInsights() {
  renderMoodHistory();
  renderTaskCompletion();
  renderHabitChart();
  renderWordCloud();
}

// 😊 Mood history
const moodEmojis = {
  'mood-1': '😔', 'mood-2': '😐',
  'mood-3': '😊', 'mood-4': '😄', 'mood-5': '🤩'
};

const moodLabels = {
  'mood-1': 'Rough', 'mood-2': 'Okay',
  'mood-3': 'Good',  'mood-4': 'Great', 'mood-5': 'Amazing'
};

function renderMoodHistory() {
  const container = document.getElementById('mood-history');
  const currentMood = localStorage.getItem('planner-mood');

  if (!currentMood) {
    container.innerHTML = '<p style="font-size:12px;color:#aaa;">No mood logged yet</p>';
    return;
  }

  container.innerHTML = `
    <div class="mood-history-item">
      <span class="mood-history-emoji">${moodEmojis[currentMood]}</span>
      <span>${moodLabels[currentMood]}</span>
    </div>
    <p style="font-size:11px;color:#aaa;margin-top:8px;">
      More mood history coming in Phase 4 when we add cloud saving!
    </p>
  `;
}

// ✅ Task completion
function renderTaskCompletion() {
  const fill = document.getElementById('task-completion-fill');
  const pct = document.getElementById('task-completion-pct');
  const sub = document.getElementById('task-completion-sub');

  // Load tasks fresh from localStorage
  const savedTasks = localStorage.getItem('planner-tasks');
  const allTasks = savedTasks ? JSON.parse(savedTasks) : tasks;

  if (allTasks.length === 0) {
    pct.textContent = '0%';
    sub.textContent = 'No tasks yet';
    fill.style.width = '0%';
    return;
  }

  const done = allTasks.filter(t => t.done).length;
  const total = allTasks.length;
  const percent = Math.round((done / total) * 100);

  fill.style.width = percent + '%';
  pct.textContent = percent + '%';
  sub.textContent = done + ' of ' + total + ' tasks completed today';
}

// 🔁 Habit chart
function renderHabitChart() {
  const container = document.getElementById('habit-chart');
  const habitRows = document.querySelectorAll('.habit-row');
  container.innerHTML = '';

  if (habitRows.length === 0) {
    container.innerHTML = '<p style="font-size:12px;color:#aaa;">No habits found</p>';
    return;
  }

  habitRows.forEach(function(row) {
    const nameEl = row.querySelector('.habit-name');
    const name = nameEl ? nameEl.textContent.trim() : 'Habit';
    const dots = row.querySelectorAll('.hdot');
    const doneDots = row.querySelectorAll('.hdot.done');

    if (dots.length === 0) return;

    const percent = Math.round((doneDots.length / dots.length) * 100);

    const rowEl = document.createElement('div');
    rowEl.classList.add('habit-chart-row');
    rowEl.innerHTML = `
      <span class="habit-chart-name">${name}</span>
      <div class="habit-chart-bar-wrap">
        <div class="habit-chart-bar" style="width: ${percent}%"></div>
      </div>
      <span class="habit-chart-pct">${percent}%</span>
    `;
    container.appendChild(rowEl);
  });
}

// 💬 Gratitude word cloud
function renderWordCloud() {
  const container = document.getElementById('word-cloud');
  const stopWords = ['i', 'a', 'the', 'and', 'or', 'for', 'to', 'my',
                     'is', 'am', 'are', 'was', 'of', 'in', 'it', 'me',
                     'so', 'be', 'do', 'at', 'on', 'an', 'we', 'by'];

  let allText = '';
  for (let i = 0; i < 4; i++) {
    const val = localStorage.getItem('planner-gratitude-' + i) || '';
    allText += ' ' + val;
  }

  // Also include notes
  const notes = localStorage.getItem('planner-notes') || '';
  allText += ' ' + notes;

  const words = allText.toLowerCase().replace(/[^a-z\s]/g, '').split(/\s+/);
  const freq = {};

  words.forEach(function(word) {
    if (word.length < 3) return;
    if (stopWords.includes(word)) return;
    freq[word] = (freq[word] || 0) + 1;
  });

  const sorted = Object.entries(freq)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 15);

  if (sorted.length === 0) {
    container.innerHTML = '<p style="font-size:12px;color:#aaa;">Write in gratitude to see words appear</p>';
    return;
  }

  const maxFreq = sorted[0][1];

  container.innerHTML = sorted.map(function([word, count]) {
    const size = count === maxFreq ? 'large' :
                 count >= maxFreq / 2 ? 'medium' : 'small';
    return `<span class="word-tag ${size}">${word}</span>`;
  }).join('');
}