function isValidEmail(email) {
    // Check standard email format 
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function validateLoginForm(email, password) {
    // Empty field
    if (!email || !password) {
        return 'Please fill in both email and password.';
    }

    // Email format
    if (!isValidEmail(email)) {
        return 'Please enter a valid email address.';
    }

    // Password min. length (8 characters)
    if (password.length < 8) {
        return 'Password must be at least 8 characters.';
    }

    return null; 
}

document.getElementById("loginForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;

    // Run validation 
    const validationError = validateLoginForm(email, password);
    if (validationError) {
        M.toast({ html: validationError, classes: 'red rounded' });
        return; 
    }

    try {
        const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (response.ok && data.success) {
            M.toast({ html: 'Login successful!', classes: 'green darken-1 rounded' });

            localStorage.setItem('userId', data.user.id);
            localStorage.setItem('username', data.user.username);

            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 1000);

        } else {
            M.toast({ html: data.message || 'Invalid email or password.', classes: 'red rounded' });
        }

    } catch (error) {
        console.error("Login API Error:", error);
        M.toast({ html: 'Something went wrong. Is your server running?', classes: 'red' });
    }
});