document.addEventListener("DOMContentLoaded", function () {
    const loginForm = document.getElementById("loginForm");
    const loginMessage = document.getElementById("loginMessage");
    if (!loginForm) {
        console.error("Login form not found. Check id='loginForm'.");
        return;
    }
    loginForm.addEventListener("submit", function (event) {
        event.preventDefault();
        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value;
        if (!email || !password) {
            showMessage("Please enter your email and password.");
            return;
        }
        sessionStorage.setItem("teamforgeDemoEmail", email);
        window.location.href = "dashboard.html";
    });
    function showMessage(message) {
        if (loginMessage) {
            loginMessage.textContent = message;
        } else {
            alert(message);
        }
    }
});
