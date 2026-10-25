const resetForm = document.getElementById("resetForm");
const emailInput = document.getElementById("email");
const formMessage = document.getElementById("formMessage");
resetForm.addEventListener("submit", function (event) {
    event.preventDefault();
    const email = emailInput.value.trim();
    formMessage.textContent = "";
    formMessage.className = "form-message";
    if (email === "") {
        showMessage("Please enter your email address.", "error");
        emailInput.focus();
        return;
    }
    if (!emailInput.checkValidity()) {
        showMessage("Please enter a valid email address.", "error");
        emailInput.focus();
        return;
    }
    showMessage(
        "Your email format looks valid. Password recovery is not connected yet, so no reset email has been sent.",
        "success"
    );
});

function showMessage(message, type) {
    formMessage.textContent = message;
    formMessage.classList.add(type);
}
