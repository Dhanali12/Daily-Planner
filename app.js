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
todoItems.forEach(function(item) {

  // Find the checkbox and the text inside this task
  const checkbox = item.querySelector('.checkbox');
  const taskText = item.querySelector('span');

  // Listen for a click anywhere on the task row
  item.addEventListener('click', function() {

    // Toggle done state
    if (checkbox.classList.contains('done')) {
      // It's done → mark as undone
      checkbox.classList.remove('done');
      checkbox.textContent = '';
      taskText.classList.remove('done-text');
    } else {
      // It's undone → mark as done
      checkbox.classList.add('done');
      checkbox.textContent = '✓';
      taskText.classList.add('done-text');
    }

  });

});