document
  .getElementById("registerForm")
  .addEventListener("submit", async function (event) {    //added async -SG

    event.preventDefault();

    const username =
      document.getElementById("username").value.trim();

    const email =
      document.getElementById("email").value.trim();

    const password =
      document.getElementById("password").value;

    const confirmPassword =
      document.getElementById("confirmPassword").value;


    // -SG
    showMessage("", "");

    if (!username || !email || !password || !confirmPassword) {

      showMessage("Please fill in all fields.", "error");
      return;
    }

    //updated to 8 characters -SG
    if (password.length < 8) {
      showMessage("Password must be at least 8 characters.", "error");
      return;
    }

    if (password !== confirmPassword) {

      showMessage("Passwords do not match.", "error");
      return;
    }


    //sending the registration data to our backend API -SG
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password })
      });

      const data = await response.json();
      if (response.ok && data.success) {
        showMessage("Registration Successful! Redirecting...", "success");

        //setting session identifiers matching login logic
        localStorage.setItem('userId', data.user.id);
        localStorage.setItem('username', data.user.username);

        //redirecting to dashboard after a brief delay
        setTimeout(() => {
          window.location.href = 'dashboard.html';
        }, 1500);

        document.getElementById("registerForm").reset();

      } else {
        showMessage(data.message || "Registration failed.", "error");
      }

    } catch (error) {
      console.error('Registration API Error:', error);
      showMessage("!Something went wrong!", "error");
    }
  });

function showMessage(text, type) {

  const message =
    document.getElementById("message");

  message.textContent = text;

  //styling text color based on response type -SG
  if (type == "error") {
    message.style.color = "red";
  } else if (type == "success") {
    message.style.color = "green";
  }
}