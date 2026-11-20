document.addEventListener("DOMContentLoaded", function () {

    // Show / hide password
    document.querySelectorAll(".toggle-password").forEach(function (btn) {
        btn.addEventListener("click", function () {
            const input = btn.parentElement.querySelector("input");
            const showing = input.type === "text";
            input.type = showing ? "password" : "text";
            btn.classList.toggle("showing", !showing);
            btn.setAttribute("aria-label", showing ? "Show password" : "Hide password");
        });
    });

    const errorMsg = document.getElementById("errorMsg");

    function showError(message, input) {
        errorMsg.textContent = message;
        errorMsg.classList.remove("shake");
        void errorMsg.offsetWidth; // restart the shake animation
        errorMsg.classList.add("shake");
        if (input) input.focus();
    }

    function isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    // Login form checks
    const loginForm = document.getElementById("loginForm");
    if (loginForm) {
        loginForm.addEventListener("submit", function (e) {
            const email = document.getElementById("email");
            const password = document.getElementById("password");

            if (!isValidEmail(email.value.trim())) {
                e.preventDefault();
                return showError("Please enter a valid email address.", email);
            }
            if (!password.value) {
                e.preventDefault();
                return showError("Please enter your password.", password);
            }
            errorMsg.textContent = "";
        });
    }

    // Signup form checks
    const signupForm = document.getElementById("signupForm");
    if (signupForm) {
        signupForm.addEventListener("submit", function (e) {
            const name = document.getElementById("name");
            const email = document.getElementById("email");
            const password = document.getElementById("password");
            const confirm = document.getElementById("confirm");

            if (!name.value.trim()) {
                e.preventDefault();
                return showError("Please enter your name.", name);
            }
            if (!isValidEmail(email.value.trim())) {
                e.preventDefault();
                return showError("Please enter a valid email address.", email);
            }
            if (password.value.length < 6) {
                e.preventDefault();
                return showError("Password must be at least 6 characters.", password);
            }
            if (password.value !== confirm.value) {
                e.preventDefault();
                return showError("Passwords do not match.", confirm);
            }
            errorMsg.textContent = "";
        });
    }
});