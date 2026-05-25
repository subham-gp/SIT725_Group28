document.addEventListener("DOMContentLoaded", () => {

  const currentUser = null;  // TODO: load from session
  const tasks = [];    // TODO: fetch from GET /api/tasks
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

  // Task Creation
  if (taskForm && taskTableBody) {
    taskForm.addEventListener("submit", function (e) {
      e.preventDefault();

      const title = document.getElementById("taskTitle").value;
      const description = document.getElementById("taskDescription").value;
      const dueDate = document.getElementById("taskDueDate").value;
      const priority = document.getElementById("taskPriority").value;
      const course = document.getElementById("taskCourse").value;

      const row = document.createElement("tr");

      row.innerHTML = `
      <td>${escapeHtml(title)}</td>
      <td>${escapeHtml(course)}</td>
      <td>${dueDate ? formatDate(dueDate) : "-"}</td>
      <td>${capitalize(priority)}</td>
      <td>${capitalize("pending")}</td>
      <td>
        <button onclick="handleEdit(this)">Edit</button>
        <button onclick="handleDelete(this)">Delete</button>
      </td>
    `;

      const emptyState = taskTableBody.querySelector(".empty-state");
      if (emptyState) taskTableBody.innerHTML = "";

      taskTableBody.prepend(row);

      taskForm.reset();
      modal.classList.add("hidden");
    });
  }

  function init() {
    renderUser(currentUser);
    renderDate();
    renderNotifBadge(notifications);
    renderSummaryCards(tasks);
    renderProgressRing(tasks);
    renderDeadlines(tasks);
    renderTaskTable(tasks);
    initFilterButtons(tasks);
  }

  init();

  function renderUser(user) {
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

  function renderTaskTable(tasks, filter = "all") {
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