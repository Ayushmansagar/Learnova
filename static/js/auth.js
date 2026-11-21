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

    function showError(e, message, input) {
        e.preventDefault(); // stop the form only when something is wrong
        errorMsg.textContent = message;
        errorMsg.classList.remove("shake");
        void errorMsg.offsetWidth;
        errorMsg.classList.add("shake");
        if (input) input.focus();
    }

    function isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    // Shake the server error too, if Flask sent one
    if (errorMsg && errorMsg.textContent.trim()) {
        errorMsg.classList.add("shake");
    }

    const loginForm = document.getElementById("loginForm");
    if (loginForm) {
        loginForm.addEventListener("submit", function (e) {
            const email = document.getElementById("email");
            const password = document.getElementById("password");

            if (!isValidEmail(email.value.trim())) return showError(e, "Please enter a valid email address.", email);
            if (!password.value) return showError(e, "Please enter your password.", password);
        });
    }

    const signupForm = document.getElementById("signupForm");
    if (signupForm) {
        signupForm.addEventListener("submit", function (e) {
            const name = document.getElementById("name");
            const email = document.getElementById("email");
            const password = document.getElementById("password");
            const confirm = document.getElementById("confirm");

            if (!name.value.trim()) return showError(e, "Please enter your name.", name);
            if (!isValidEmail(email.value.trim())) return showError(e, "Please enter a valid email address.", email);
            if (password.value.length < 6) return showError(e, "Password must be at least 6 characters.", password);
            if (password.value !== confirm.value) return showError(e, "Passwords do not match.", confirm);
        });
    }
        // Disable the button after the first click so the form isn't sent twice
    document.querySelectorAll("form").forEach(function (form) {
        form.addEventListener("submit", function (e) {
            if (e.defaultPrevented) return; // a check failed, keep the button active
            const btn = form.querySelector('button[type="submit"]');
            btn.disabled = true;
            btn.textContent = "Please wait...";
        });
    });
});