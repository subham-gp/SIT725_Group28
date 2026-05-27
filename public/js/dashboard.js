document.addEventListener("DOMContentLoaded", () => {

  //load from session -SG
  const currentUserId = localStorage.getItem('userId');
  const currentUsername = localStorage.getItem('username');

  //bounces unauthenticated users -SG
  if (!currentUserId) {
    window.location.href = 'login.html';
    return;
  }

  let tasks = [];

  const notifications = [];  // TODO: fetch from GET /api/notifications

  const taskForm = document.getElementById("taskForm");
  const taskTableBody = document.getElementById("taskTableBody");
  const modal = document.getElementById("taskModal");

  const openBtn = document.querySelector(".btn-add-task");
  const closeBtn = document.getElementById("closeModal");

  // Task creation MODAL open & close
  if (openBtn && modal) {
    openBtn.addEventListener("click", () => {
      modal.classList.remove("hidden");
    });
  }

  if (closeBtn && modal) {
    closeBtn.addEventListener("click", () => {
      modal.classList.add("hidden");
    });
  }

  // -SG
  async function fetchUserTasks() {
    try {
      //send a request to our backend router with the current userId
      const response = await fetch(`/api/auth/tasks?userId=${currentUserId}`);
      const data = await response.json();

      if (response.ok && data.success) {
        tasks = data.tasks;        //overwrite our empty tasks array with the database records
        renderTaskTable(tasks);    //redraws our table layout with the fresh data
      } else {
        console.error("Failed to load tasks from database:", data.message);
      }
    } catch (error) {
      console.error("Error communicating with task API:", error);
    }
  }

  // Task Creation
  if (taskForm) {
    taskForm.addEventListener("submit", async function (e) {
      e.preventDefault();

      const title = document.getElementById("taskTitle").value;
      const course = document.getElementById("taskCourse").value;
      const description = document.getElementById("taskDescription").value;
      const dueDate = document.getElementById("taskDueDate").value;
      const priority = document.getElementById("taskPriority").value;

      try {
        //sending the task information straight to our backend router via POST -SG
        const response = await fetch('/api/auth/tasks/create', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            user: currentUserId, //links the task to this logged-in user
            title,
            course,
            description,
            dueDate,
            priority
          })
        });

        const data = await response.json();

        if (response.ok && data.success) {
          //add the newly saved MongoDB task object
          tasks.push(data.task);

          //updating the dashboard table
          renderTaskTable(tasks);

          taskForm.reset();
          modal.classList.add("hidden");
        } else {
          alert(data.message || "Failed to create task.");
        }
      } catch (error) {
        console.error("Task submission failure:", error);
        alert("Something went wrong saving your task to the database.");
      }
    });
  }

  function init() {
    renderUser();
    renderDate();
    renderNotifBadge(notifications);

    fetchUserTasks();

    renderSummaryCards(tasks);
    renderProgressRing(tasks);
    renderDeadlines(tasks);
    renderTaskTable(tasks);
    initFilterButtons(tasks);
  }

  init();

  function renderUser(user) {
    const welcomeEl = document.querySelector(".topbar-user h1");
    if (welcomeEl) {
      welcomeEl.textContent = `Welcome back, ${currentUsername || 'Student'}`;
    }
  }


  function renderDate() {
  }

  function renderNotifBadge(notifications) {
  }


  function renderSummaryCards(tasks) {
  }


  function renderProgressRing(tasks) {
  }

  function renderDeadlines(tasks) {
  }


  //moved the taskTableBody here and added a loop -SG
  function renderTaskTable(tasks, filter = "all") {
    if (!taskTableBody) return;
    taskTableBody.innerHTML = "";

    //If MongoDB returns no tasks, show the empty layout state
    if (tasks.length === 0) {
      taskTableBody.innerHTML = `<tr><td colspan="6" class="empty-state">No tasks found</td></tr>`;
      return;
    }

    //Loop through the database items and paint them to the screen -SG
    tasks.forEach(task => {
      const row = document.createElement("tr");

      row.innerHTML = `
      <td><strong>${escapeHtml(task.title)}</strong><br><small class="grey-text">${escapeHtml(task.description || '')}</small></td>
      <td>${escapeHtml(task.course || 'General')}</td>
      <td>${task.dueDate ? formatDate(task.dueDate) : "-"}</td>
      <td><span class="priority-badge ${task.priority}">${task.priority.toUpperCase()}</span></td>
      <td><span class="status-badge ${task.status || 'todo'}">${(task.status || 'todo').toUpperCase()}</span></td>
      <td>
        <button class="action-btn edit" onclick="handleEdit('${task._id}')">Edit</button>
        <button class="action-btn delete" onclick="handleDelete('${task._id}')">Delete</button>
      </td>
    `;
      taskTableBody.appendChild(row);
    });
  }

  function initFilterButtons(tasks) {
  }

  window.handleEdit = function (id) { };

  window.handleDelete = function (id) { };

  function setText(id, value) {
    const el = document.getElementById(id);
    if (el) el.textContent = value;
  }

  function startOfDay(date) {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    return d;
  }

  function formatDate(date) {
    return new Date(date).toLocaleDateString("en-AU", { day: "numeric", month: "short" });
  }

  function capitalize(str) {
    return str ? str.charAt(0).toUpperCase() + str.slice(1) : "";
  }

  function escapeHtml(str) {
    const div = document.createElement("div");
    div.textContent = str;
    return div.innerHTML;
  }

});