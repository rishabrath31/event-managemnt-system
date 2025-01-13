// Redirect to login page if token does not exist in local storage
const token = localStorage.getItem("token");
if (!token) {
    window.location.href = "pages/login.html";
}