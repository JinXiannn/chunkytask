document.addEventListener('DOMContentLoaded', function () {
  loadTasks();
   setupLoginButtons(); // Add this line to call the setupLoginButtons function
});

function loadTasks() {
  const taskList = document.getElementById('taskList');
  taskList.innerHTML = '';

  // Fetch tasks from backend
  fetch('/api/tasks')
    .then(response => {
      if (!response.ok) {
        throw new Error(`Failed to fetch tasks. Status: ${response.status}`);
      }
      return response.json();
    })
    .then(tasks => {
      tasks.forEach(task => {
        addTaskToDOM(task);
      });
    })
    .catch(error => console.error('Error:', error));
}

function setupLoginButtons() {
  const googleLoginButton = document.getElementById('googleLoginButton');
  const facebookLoginButton = document.getElementById('facebookLoginButton');

  // Add event listeners for Google and Facebook login buttons
  if (googleLoginButton) {
    googleLoginButton.addEventListener('click', () => {
      window.location.href = '/auth/google';
    });
  }

  if (facebookLoginButton) {
    facebookLoginButton.addEventListener('click', () => {
      window.location.href = '/auth/facebook';
    });
  }
}
function addTask() {
  const taskInput = document.getElementById('taskInput');
  const newTask = taskInput.value.trim();

  if (newTask !== '') {
    // Save the task to the backend
    saveTask(newTask);
  }
}

function saveTask(task) {
  fetch('/api/tasks', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ title: task }),
  })
    .then(response => {
      if (!response.ok) {
        throw new Error(`Failed to save task. Status: ${response.status}`);
      }
      return response.json();
    })
    .then(savedTask => {
      // Add the task to the DOM
      addTaskToDOM(savedTask);

      // Clear the input field
      document.getElementById('taskInput').value = '';
    })
    .catch(error => console.error('Error:', error));
}

function addTaskToDOM(task) {
  const taskList = document.getElementById('taskList');
  const taskItem = document.createElement('li');

  // Add a button for deleting tasks
  const deleteButton = document.createElement('button');
  deleteButton.textContent = 'Delete';
  deleteButton.addEventListener('click', () => deleteTask(task._id));

  taskItem.textContent = task.title;
  taskItem.appendChild(deleteButton);

  taskList.appendChild(taskItem);
}

function deleteTask(taskId) {
  // Implement the deletion of tasks by sending a DELETE request to the backend
  fetch(`/api/tasks/${taskId}`, {
    method: 'DELETE',
  })
    .then(response => {
      if (!response.ok) {
        throw new Error(`Failed to delete task. Status: ${response.status}`);
      }
      // Remove the task from the DOM
      document.getElementById(taskId).remove();
    })
    .catch(error => console.error('Error:', error));
}