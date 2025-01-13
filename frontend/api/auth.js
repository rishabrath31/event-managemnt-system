document.addEventListener("DOMContentLoaded", () => {
  const registerForm = document.querySelector("#register-form");
  const loginForm = document.querySelector("#login-form");
  const registerFormContainer = document.querySelector(
    "#register-form-container"
  );
  const loginFormContainer = document.querySelector("#login-form-container");
  const registerButton = document.querySelector("#register-link");
  const loginButton = document.querySelector("#login-link");

  // TOGGLE LOGIN/REGISTRATION FORMS
  registerButton.addEventListener("click", () => {
    loginFormContainer.style.display = "none";
    registerFormContainer.style.display = "block";
  });

  loginButton.addEventListener("click", () => {
    loginFormContainer.style.display = "block";
    registerFormContainer.style.display = "none";
  });

  // REGISTER
  registerForm.addEventListener("submit", async function (e) {
    e.preventDefault();

    try {
      const fullName = document.getElementById("register-name").value.trim();
      const email = document.getElementById("register-email").value.trim();
      const password = document
        .getElementById("register-password")
        .value.trim();
      const confirmPassword = document
        .getElementById("register-confirm-password")
        .value.trim();

      if (password !== confirmPassword) {
        alert("Passwords do not match. Please try again.");
        return;
      }

      const response = await fetch(
        "http://localhost:3001/createuser",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ fullName, email, password }),
        }
      );

      const data = await response.json();

      if (response.ok && data.error === false) {
        alert("Registration successful");
        window.location.href = "../pages/login.html";
      } else {
        alert(data.reason || "Registration failed. Please try again.");
      }
    } catch (error) {
      alert("An error occurred while registering. Please try again later.");
    }
  });

  // LOGIN
  loginForm.addEventListener("submit", async function (e) {
    e.preventDefault();

    try {
      const email = document.getElementById("login-email").value.trim();
      const password = document.getElementById("login-password").value.trim();

      const response = await fetch(
        "http://localhost:3001/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        }
      );

      const data = await response.json();

      if (response.ok && data.error === false) {
        alert("Login successful");
        window.location.href = "../index.html";
        // save the token in local storage
        localStorage.setItem("token", JSON.stringify(data.token));
      } else {
        alert(data.reason || "Login failed. Please check your credentials.");
      }
    } catch (error) {
      alert("An error occurred while logging in. Please try again later.");
    }
  });
});
