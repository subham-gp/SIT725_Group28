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
  const taskCardContainer = document.getElementById("taskCardContainer");
  const modal = document.getElementById("taskModal");

  const openBtn = document.querySelector(".btn-add-task");
  const closeBtn = document.getElementById("closeModal");

  // Task creation MODAL open & close - EP
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
        tasks = data.tasks.reverse();        //overwrite our empty tasks array with the database records
        renderTaskTable(tasks);    //redraws our table layout with the fresh data
        renderTaskCards(tasks);
        renderSummaryCards(tasks);
        renderProgressRing(tasks);
        renderDeadlines(tasks);
      } else {
        console.error("Failed to load tasks from database:", data.message);
      }
    } catch (error) {
      console.error("Error communicating with task API:", error);
    }
  }

  // Task Creation EP
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
          tasks.unshift(data.task);

          //updating the dashboard table
          renderTaskTable(tasks);
          renderTaskCards(tasks);
          renderSummaryCards(tasks);
          renderProgressRing(tasks);
          renderDeadlines(tasks);

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
    renderTaskCards(tasks);
    renderSummaryCards(tasks);
    renderProgressRing(tasks);
    renderDeadlines(tasks);
    initFilterButtons(tasks);
  }

  init();

  // ─── SORTING ───────────────────────────────────────────

  const priorityOrder = { high: 1, medium: 2, low: 3 };

  function sortTasks(tasks, sortBy) {
    const sorted = [...tasks];
    if (sortBy === "dueDate") {
      sorted.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
    } else if (sortBy === "priority") {
      sorted.sort((a, b) => (priorityOrder[a.priority] || 99) - (priorityOrder[b.priority] || 99));
    }
    return sorted;
  }

  const sortSelect = document.getElementById("sortSelect");
  if (sortSelect) {
    sortSelect.addEventListener("change", () => {
      const sorted = sortTasks(tasks, sortSelect.value);
      renderTaskTable(sorted);
    });
  }

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
  // Update summary cards -EP
  function renderSummaryCards(tasks) {

    const totalTasks = tasks.length;

    const pendingTasks = tasks.filter(
      task => task.status === "todo"
    ).length;

    const progressTasks = tasks.filter(
      task => task.status === "in-progress"
    ).length;

    const completedTasks = tasks.filter(
      task => task.status === "done"
    ).length;

    setText("countTotal", totalTasks);
    setText("countPending", pendingTasks);
    setText("countProgress", progressTasks);
    setText("countCompleted", completedTasks);

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
      taskTableBody.innerHTML =
        `<tr>
      <td colspan="6" class="empty-state">No tasks found</td>
    </tr>`;
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
<td>
  <select class="status-select ${task.status || 'todo'}"
    onchange="handleStatusChange('${task._id}', this.value)">

    <option value="todo"
      ${(task.status || "todo") === "todo" ? "selected" : ""}>
      Pending
    </option>

    <option value="in-progress"
      ${task.status === "in-progress" ? "selected" : ""}>
      In Progress
    </option>

    <option value="done"
      ${task.status === "done" ? "selected" : ""}>
      Completed
    </option>

  </select>
</td>      
<td>
        <button class="action-btn edit" onclick="handleEdit('${task._id}')">Edit</button>
        <button class="action-btn delete" onclick="handleDelete('${task._id}')">Delete</button>
      </td>
    `;
      taskTableBody.appendChild(row);
    });
  }
  //Render Task cards 
  function renderTaskCards(tasks) {

    if (!taskCardContainer) return;

    taskCardContainer.innerHTML = "";

    if (tasks.length === 0) {
      taskCardContainer.innerHTML = `
      <p class="empty-state">No task cards available</p>
    `;
      return;
    }

    tasks.forEach(task => {

      const card = document.createElement("div");
      card.className = task.status === "done" ? "task-card completed-task" : "task-card";
      card.innerHTML = `
      <h3>${escapeHtml(task.title)}</h3>

      <p><strong>Course:</strong> ${escapeHtml(task.course || "General")}</p>

      <p><strong>Due:</strong> ${task.dueDate ? formatDate(task.dueDate) : "-"
        }</p>

      <p>
        <strong>Priority:</strong>
        <span class="priority-badge ${task.priority}">
          ${task.priority.toUpperCase()}
        </span>
      </p>

      <p>
         <strong>Status:</strong>
         <select class="status-select ${task.status || "todo"}" onchange="handleStatusChange('${task._id}', this.value)">
         <option value="todo" ${(task.status || "todo") === "todo" ? "selected" : ""}>Pending</option>
         <option value="in-progress" ${task.status === "in-progress" ? "selected" : ""}>In Progress</option>
         <option value="done" ${task.status === "done" ? "selected" : ""}>Completed</option>
         </select>
      </p>`;

      taskCardContainer.appendChild(card);
    });
  }

  function initFilterButtons(tasks) {
  }

  // ─── EDIT MODAL ───────────────────────────────────────

  // Close edit modal
  document.getElementById("closeEditModal").addEventListener("click", () => {
    document.getElementById("editModal").classList.add("hidden");
  });

  // Save edited task → PUT /api/auth/tasks/:id
  document.getElementById("editForm").addEventListener("submit", async function (e) {
    e.preventDefault();

    const id = document.getElementById("editTaskId").value;

    const updated = {
      title: document.getElementById("editTitle").value,
      course: document.getElementById("editCourse").value,
      description: document.getElementById("editDescription").value,
      dueDate: document.getElementById("editDueDate").value,
      priority: document.getElementById("editPriority").value,
      status: document.getElementById("editStatus").value,
    };

    try {
      const response = await fetch(`/api/auth/tasks/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updated),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        const index = tasks.findIndex(t => t._id === id);
        if (index !== -1) tasks[index] = data.task;

        renderTaskTable(tasks);
        renderTaskCards(tasks);
        renderSummaryCards(tasks);
        renderProgressRing(tasks);
        renderDeadlines(tasks);
        document.getElementById("editModal").classList.add("hidden");
      } else {
        alert(data.message || "Failed to update task.");
      }
    } catch (error) {
      console.error("Edit submission error:", error);
      alert("Something went wrong updating the task.");
    }
  });

  // Open edit modal and pre-fill fields
  window.handleEdit = function (id) {
    const task = tasks.find(t => t._id === id);
    if (!task) return;

    document.getElementById("editTaskId").value = task._id;
    document.getElementById("editTitle").value = task.title;
    document.getElementById("editCourse").value = task.course || "";
    document.getElementById("editDescription").value = task.description || "";
    document.getElementById("editDueDate").value = task.dueDate
      ? new Date(task.dueDate).toISOString().split("T")[0] : "";
    document.getElementById("editPriority").value = task.priority || "medium";
    document.getElementById("editStatus").value = task.status || "todo";

    document.getElementById("editModal").classList.remove("hidden");
  };

  // ─────────────────────────────────────────────────────
  // Status change function EP
  window.handleStatusChange = async function (id, newStatus) {
    const task = tasks.find(t => t._id === id);
    if (!task) return;

    const updated = {
      title: task.title,
      course: task.course || "General",
      description: task.description || "",
      dueDate: task.dueDate,
      priority: task.priority || "medium",
      status: newStatus
    };

    try {
      const response = await fetch(`/api/auth/tasks/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updated)
      });

      const data = await response.json();

      if (response.ok && data.success) {
        const index = tasks.findIndex(t => t._id === id);
        if (index !== -1) tasks[index] = data.task;

        renderTaskTable(tasks);
        renderTaskCards(tasks);
        renderSummaryCards(tasks);
        renderProgressRing(tasks);
        renderDeadlines(tasks);
      } else {
        alert(data.message || "Failed to update task status.");
      }
    } catch (error) {
      console.error("Status update error:", error);
      alert("Something went wrong updating the task status.");
    }
  };
  //---------------------------

  window.handleDelete = async function (id) {
    const confirmDelete = confirm("Are you sure you want to delete this task?");

    if (!confirmDelete) return;

    try {
      const response = await fetch(`/api/auth/tasks/${id}`, {
        method: "DELETE"
      });

      const data = await response.json();

      if (response.ok && data.success) {
        tasks = tasks.filter(task => task._id !== id);
        renderTaskTable(tasks);
        renderTaskCards(tasks);
        renderSummaryCards(tasks);
        renderProgressRing(tasks);
        renderDeadlines(tasks);
        alert("Task deleted successfully.");
      } else {
        alert(data.message || "Failed to delete task.");
      }
    } catch (error) {
      console.error("Delete task error:", error);
      alert("Something went wrong deleting the task.");
    }
  };

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
