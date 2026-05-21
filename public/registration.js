document.getElementById("registrationForm").addEventListener("submit", function (event) {
  event.preventDefault();

  const username = document.getElementById("username").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;
  const confirmPassword = document.getElementById("confirmPassword").value;
  const message = document.getElementById("message");

  message.textContent = "";
  message.className = "center-align";

  if (!username || !email || !password || !confirmPassword) {
    showMessage("Please fill in all fields.", "error");
    return;
  }

  if (password.length < 6) {
    showMessage("Password must be at least 6 characters.", "error");
    return;
  }

  if (password !== confirmPassword) {
    showMessage("Passwords do not match.", "error");
    return;
  }

  showMessage("Registration successful!", "success");

  document.getElementById("registrationForm").reset();
});

function showMessage(text, type) {
  const message = document.getElementById("message");
  message.textContent = text;
  message.className = "center-align " + type;
}