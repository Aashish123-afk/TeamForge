const profileName = document.getElementById("profileName");
const profileEmail = document.getElementById("profileEmail");
const profileStudentId = document.getElementById("profileStudentId");
const profileCourse = document.getElementById("profileCourse");
let student = null;
try {
    student = JSON.parse(localStorage.getItem("teamforgeCurrentStudent"));
} catch {
    student = null;
}
if (!student) {
    window.location.href = "stud_login.html";
} else {
    profileName.textContent = student.fullName || "Not provided";
    profileEmail.textContent = student.email || "Not provided";
    profileStudentId.textContent = student.studentId || "Not provided";
    profileCourse.textContent = student.course || "Not provided";
}
