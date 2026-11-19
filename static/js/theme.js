// Apply the saved theme before the page shows (avoids a white flash)
(function () {
    let theme = null;
    try {
        theme = localStorage.getItem("theme");
    } catch (e) {}

    if (!theme && window.matchMedia("(prefers-color-scheme: dark)").matches) {
        theme = "dark";
    }

    if (theme === "dark") {
        document.documentElement.classList.add("dark");
    }
})();

document.addEventListener("DOMContentLoaded", function () {
    const btn = document.getElementById("themeToggle");
    if (!btn) return;

    function updateLabel() {
        const isDark = document.documentElement.classList.contains("dark");
        btn.title = isDark ? "Switch to light mode" : "Switch to dark mode";
        btn.setAttribute("aria-pressed", isDark);
    }

    updateLabel();

    btn.addEventListener("click", function () {
        const isDark = document.documentElement.classList.toggle("dark");
        try {
            localStorage.setItem("theme", isDark ? "dark" : "light");
        } catch (e) {}
        updateLabel();
    });
});