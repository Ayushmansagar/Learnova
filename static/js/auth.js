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
        void errorMsg.offsetWidth;
        errorMsg.classList.add("shake");
        if (input) input.focus();
    }

    function isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    // TEMPORARY: until Flask is ready, save the name and go to the dashboard
    function goToDashboard(name) {
        try {
            localStorage.setItem("learnovaUser", name);
        } catch (e) {}
        window.location.href = "dashboard.html";
    }

    // Login
    const loginForm = document.getElementById("loginForm");
    if (loginForm) {
        loginForm.addEventListener("submit", function (e) {
            e.preventDefault(); // TEMPORARY: remove when Flask handles /login
            const email = document.getElementById("email");
            const password = document.getElementById("password");

            if (!isValidEmail(email.value.trim())) {
                return showError("Please enter a valid email address.", email);
            }
            if (!password.value) {
                return showError("Please enter your password.", password);
            }

            // Use the part before @ as a display name, e.g. "nida" from nida@gmail.com
            let name = email.value.trim().split("@")[0];
            try {
                name = localStorage.getItem("learnovaUser") || name;
            } catch (err) {}
            name = name.charAt(0).toUpperCase() + name.slice(1);
            goToDashboard(name);
        });
    }

    // Signup
    const signupForm = document.getElementById("signupForm");
    if (signupForm) {
        signupForm.addEventListener("submit", function (e) {
            e.preventDefault(); // TEMPORARY: remove when Flask handles /signup
            const name = document.getElementById("name");
            const email = document.getElementById("email");
            const password = document.getElementById("password");
            const confirm = document.getElementById("confirm");

            if (!name.value.trim()) {
                return showError("Please enter your name.", name);
            }
            if (!isValidEmail(email.value.trim())) {
                return showError("Please enter a valid email address.", email);
            }
            if (password.value.length < 6) {
                return showError("Password must be at least 6 characters.", password);
            }
            if (password.value !== confirm.value) {
                return showError("Passwords do not match.", confirm);
            }

            goToDashboard(name.value.trim());
        });
    }
});