document.getElementById("loginForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  console.log("Login attempt:", { email, password });

  alert("Login UI works. Backend integration pending.");
});