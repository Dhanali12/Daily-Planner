// === TAB NAVIGATION ===

document.querySelectorAll('.nav-btn').forEach(function(btn) {
  btn.addEventListener('click', function() {
    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById('tab-' + btn.dataset.tab).classList.add('active');
  });
});


// === DAILY SNAPSHOT SYSTEM ===

function getTodayKey() {
  const today = new Date();
  return today.toISOString().split('T')[0];
}

function saveDailySnapshot() {
  const todayKey = getTodayKey();
  const snapshot = {
    date: todayKey,
    mood: localStorage.getItem('planner-mood') || null,
    tasks: JSON.parse(localStorage.getItem('planner-tasks') || '[]'),
    habits: JSON.parse(localStorage.getItem('planner-habits') || '[]'),
    gratitude: [
      localStorage.getItem('planner-gratitude-0') || '',
      localStorage.getItem('planner-gratitude-1') || '',
      localStorage.getItem('planner-gratitude-2') || '',
      localStorage.getItem('planner-gratitude-3') || '',
    ],
    notes: localStorage.getItem('planner-notes') || '',
  };
  const history = JSON.parse(localStorage.getItem('planner-history') || '{}');
  history[todayKey] = snapshot;
  localStorage.setItem('planner-history', JSON.stringify(history));
}

saveDailySnapshot();
setInterval(saveDailySnapshot, 5 * 60 * 1000);


// === MOOD BUTTONS ===

const moodButtons = document.querySelectorAll('.mood-btn');

const savedMood = localStorage.getItem('planner-mood');
if (savedMood) {
  moodButtons.forEach(btn => btn.classList.remove('active'));
  const savedBtn = document.getElementById(savedMood);
  if (savedBtn) savedBtn.classList.add('active');
}

moodButtons.forEach(function(button) {
  button.addEventListener('click', function() {
    moodButtons.forEach(btn => btn.classList.remove('active'));
    button.classList.add('active');
    localStorage.setItem('planner-mood', button.id);
    saveDailySnapshot();
  });
});


// === TASK DATA ===

function saveTasks() {
  localStorage.setItem('planner-tasks', JSON.stringify(tasks));
  saveDailySnapshot();
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
      <span class="${task.done ? 'done-text' : ''}">${task.text}</span>
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
  tasks.push({ id: Date.now(), text: text, done: false, priority: "med" });
  taskInput.value = '';
  saveTasks();
  renderTasks();
});

taskInput.addEventListener('keypress', function(e) {
  if (e.key === 'Enter') addBtn.click();
});


// === TOP 3 & INTENTION — save as you type ===

['top3-1', 'top3-2', 'top3-3', 'intention'].forEach(function(id) {
  const el = document.getElementById(id);
  if (!el) return;
  const saved = localStorage.getItem('planner-' + id);
  if (saved) el.value = saved;
  el.addEventListener('input', function() {
    localStorage.setItem('planner-' + id, el.value);
  });
});


// === GRATITUDE — save as you type ===

const gratitudeInputs = document.querySelectorAll('.gratitude-input');

gratitudeInputs.forEach(function(input, index) {
  const saved = localStorage.getItem('planner-gratitude-' + index);
  if (saved) input.value = saved;
  input.addEventListener('input', function() {
    localStorage.setItem('planner-gratitude-' + index, input.value);
    saveDailySnapshot();
  });
});


// === NOTES — save as you type ===

const notesArea = document.querySelector('.notes-area');

if (notesArea) {
  const savedNotes = localStorage.getItem('planner-notes');
  if (savedNotes) notesArea.value = savedNotes;
  notesArea.addEventListener('input', function() {
    localStorage.setItem('planner-notes', notesArea.value);
    saveDailySnapshot();
  });
}


// === HABIT DOTS ===

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
  saveDailySnapshot();
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

document.querySelectorAll('.hdot').forEach(function(dot) {
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

let currentPeriod = 7;

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

document.querySelectorAll('.time-btn').forEach(function(btn) {
  btn.addEventListener('click', function() {
    document.querySelectorAll('.time-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentPeriod = parseInt(btn.dataset.period);
    renderInsights();
  });
});

function getHistoryInPeriod(days) {
  const history = JSON.parse(localStorage.getItem('planner-history') || '{}');
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - days);
  return Object.values(history).filter(e => new Date(e.date) >= cutoff);
}

function renderInsights() {
  renderMoodHistory();
  renderTaskCompletion();
  renderHabitChart();
  renderWordCloud();
}

const moodEmojis = { 'mood-1':'😔','mood-2':'😐','mood-3':'😊','mood-4':'😄','mood-5':'🤩' };
const moodLabels = { 'mood-1':'Rough','mood-2':'Okay','mood-3':'Good','mood-4':'Great','mood-5':'Amazing' };

function renderMoodHistory() {
  const container = document.getElementById('mood-history');
  const entries = getHistoryInPeriod(currentPeriod);
  const moodEntries = entries.filter(e => e.mood);

  if (moodEntries.length === 0) {
    container.innerHTML = '<p style="font-size:13px;color:#aaa;">No mood data yet</p>';
    return;
  }

  const moodCount = {};
  moodEntries.forEach(e => { moodCount[e.mood] = (moodCount[e.mood] || 0) + 1; });
  const sorted = Object.entries(moodCount).sort((a, b) => b[1] - a[1]);

  container.innerHTML = sorted.map(([mood, count]) => `
    <div class="mood-history-item">
      <span class="mood-history-emoji">${moodEmojis[mood]}</span>
      <span>${moodLabels[mood]}</span>
      <span style="margin-left:auto;font-size:12px;color:#aaa;">${count}x</span>
    </div>
  `).join('');
}

function renderTaskCompletion() {
  const fill = document.getElementById('task-completion-fill');
  const pct = document.getElementById('task-completion-pct');
  const sub = document.getElementById('task-completion-sub');
  const entries = getHistoryInPeriod(currentPeriod);

  let totalDone = 0, totalTasks = 0;
  entries.forEach(function(entry) {
    if (entry.tasks && entry.tasks.length > 0) {
      totalDone += entry.tasks.filter(t => t.done).length;
      totalTasks += entry.tasks.length;
    }
  });

  if (totalTasks === 0) {
    pct.textContent = '0%';
    sub.textContent = 'No task data yet';
    fill.style.width = '0%';
    return;
  }

  const percent = Math.round((totalDone / totalTasks) * 100);
  fill.style.width = percent + '%';
  pct.textContent = percent + '%';
  sub.textContent = totalDone + ' of ' + totalTasks + ' tasks completed';
}

function renderHabitChart() {
  const container = document.getElementById('habit-chart');
  const entries = getHistoryInPeriod(currentPeriod);
  const habitRows = document.querySelectorAll('.habit-row');
  container.innerHTML = '';

  habitRows.forEach(function(row, rowIndex) {
    const name = row.querySelector('.habit-name')?.textContent.trim() || 'Habit';
    const totalDots = row.querySelectorAll('.hdot').length;
    let totalDone = 0, dayCount = 0;

    entries.forEach(function(entry) {
      if (entry.habits && entry.habits[rowIndex]) {
        totalDone += entry.habits[rowIndex].filter(Boolean).length;
        dayCount++;
      }
    });

    const doneDots = row.querySelectorAll('.hdot.done').length;
    const percent = dayCount > 0
      ? Math.round((totalDone / (dayCount * totalDots)) * 100)
      : Math.round((doneDots / totalDots) * 100);

    const rowEl = document.createElement('div');
    rowEl.classList.add('habit-chart-row');
    rowEl.innerHTML = `
      <span class="habit-chart-name">${name}</span>
      <div class="habit-chart-bar-wrap">
        <div class="habit-chart-bar" style="width:${percent}%"></div>
      </div>
      <span class="habit-chart-pct">${percent}%</span>
    `;
    container.appendChild(rowEl);
  });
}

function renderWordCloud() {
  const container = document.getElementById('word-cloud');
  const entries = getHistoryInPeriod(currentPeriod);
  const stopWords = ['i','a','the','and','or','for','to','my','is','am',
    'are','was','of','in','it','me','so','be','do','at','on','an','we',
    'by','that','this','with','have','from','but','not','just','really'];

  let allText = '';
  entries.forEach(function(entry) {
    if (entry.gratitude) allText += ' ' + entry.gratitude.join(' ');
    if (entry.notes) allText += ' ' + entry.notes;
  });
  for (let i = 0; i < 4; i++) {
    allText += ' ' + (localStorage.getItem('planner-gratitude-' + i) || '');
  }
  allText += ' ' + (localStorage.getItem('planner-notes') || '');

  const words = allText.toLowerCase().replace(/[^a-z\s]/g, '').split(/\s+/);
  const freq = {};
  words.forEach(function(word) {
    if (word.length < 3 || stopWords.includes(word)) return;
    freq[word] = (freq[word] || 0) + 1;
  });

  const sorted = Object.entries(freq).sort((a, b) => b[1] - a[1]).slice(0, 25);

  if (sorted.length === 0) {
    container.innerHTML = '<p style="font-size:13px;color:#aaa;">Write in gratitude to see words</p>';
    return;
  }

  const maxFreq = sorted[0][1];
  const shuffled = [...sorted].sort(() => Math.random() - 0.5);

  container.innerHTML = shuffled.map(([word, count]) => {
    const ratio = count / maxFreq;
    const size = ratio > 0.75 ? 'large' : ratio > 0.5 ? 'large-mid' : ratio > 0.25 ? 'medium' : 'small';
    return `<span class="word-tag ${size}">${word}</span>`;
  }).join('');
}