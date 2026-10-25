const loginForm = document.getElementById("loginForm");
const loginButton = document.getElementById("loginButton");
const loginMessage = document.getElementById("loginMessage");

const role = document.body.dataset.role;
loginForm.addEventListener("submit", async function (event) {
    event.preventDefault();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;
    const rememberMe = document.getElementById("rememberMe").checked;
    loginMessage.textContent = "";
    loginMessage.className = "login-message";
    if (!email || !password) {
        showMessage("Please enter your email and password.", "error");
        return;
    }
    const endpoint = role === "admin"
        ? "/api/auth/admin/login"
        : "/api/auth/student/login";
    loginButton.disabled = true;
    loginButton.textContent = "Signing in...";
    try {
        const response = await fetch(endpoint, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            credentials: "include",
            body: JSON.stringify({
                email: email,
                password: password,
                rememberMe: rememberMe
            })
        });
        const data = await response.json().catch(() => ({}));
        if (!response.ok) {
            throw new Error(
                data.message || "Invalid email or password."
            );
        }
        showMessage("Login successful. Redirecting...", "success");
        window.location.href = role === "admin"
            ? "../admin/admin-dashboard.html"
            : "dashboard.html";
    } catch (error) {
        if (error instanceof TypeError) {
            showMessage(
                "Unable to connect to the server. Please try again.",
                "error"
            );
        } else {
            showMessage(error.message, "error");
        }
    } finally {
        loginButton.disabled = false;
        loginButton.innerHTML = 'Login <span>&rarr;</span>';
    }
});
function showMessage(message, type) {
    loginMessage.textContent = message;
    loginMessage.className = "login-message " + type;
}