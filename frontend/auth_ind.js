const studentLogin = document.getElementById("studentLogin");
const adminLogin = document.getElementById("adminLogin");

studentLogin.addEventListener("click", function() {
    window.location.href = "student/stud_login.html";
});
adminLogin.addEventListener("click", function() {
    window.location.href = "admin/admin_login.html";
});