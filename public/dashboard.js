document.addEventListener("DOMContentLoaded", () => {

  const currentUser = null;  // TODO: load from session
  const tasks       = [];    // TODO: fetch from GET /api/tasks
  const notifications = [];  // TODO: fetch from GET /api/notifications

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

  window.handleEdit = function(id) { };

  window.handleDelete = function(id) { };

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

window.handleEdit = function(id) {
  const task = tasks.find(t => t.id === id);  
};

});