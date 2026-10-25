const signupForm = document.getElementById("signupForm");
const signupMessage = document.getElementById("signupMessage");
if (signupForm) {
    signupForm.addEventListener("submit", function (event) {
        event.preventDefault();
        const fullName = document.getElementById("fullName").value.trim();
        const email = document.getElementById("email").value.trim().toLowerCase();
        const studentId = document.getElementById("studentId").value.trim();
        const course = document.getElementById("course").value.trim();
        const password = document.getElementById("password").value;
        const confirmPassword = document.getElementById("confirmPassword").value;
        if (!fullName || !email || !studentId || !course ||
            !password || !confirmPassword) {
            showMessage("Please fill in all fields.", "error");
            return;
        }
        if (password.length < 8) {
            showMessage("Password must contain at least 8 characters.", "error");
            return;
        }
        if (password !== confirmPassword) {
            showMessage("Passwords do not match.", "error");
            return;
        }
        let students;
        try {
            students = JSON.parse(localStorage.getItem("teamforgeStudents") || "[]");
            if (!Array.isArray(students)) students = [];
        } catch {
            showMessage("Unable to read demo account data.", "error");
            return;
        }
        const existingStudent = students.find(function (student) {
            return student.email === email;
        });
        if (existingStudent) {
            showMessage("This email is already registered. Please sign in.", "error");
            return;
        }
        const student = {
            fullName: fullName,
            email: email,
            studentId: studentId,
            course: course
        };
        students.push(student);
        try {
            localStorage.setItem("teamforgeStudents", JSON.stringify(students));
            localStorage.setItem("teamforgeCurrentStudent", JSON.stringify(student));
        } catch {
            showMessage("Could not save your demo account.", "error");
            return;
        }
        window.location.href = "dashboard.html";
    });

    function showMessage(message, type) {
        if (signupMessage) {
            signupMessage.textContent = message;
            signupMessage.className = "signup-message " + type;
        }
    }
}
