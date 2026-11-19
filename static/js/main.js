document.addEventListener("DOMContentLoaded", function () {

    // 1. Fade elements in when they scroll into view
    const revealObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add("visible");
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15 });

    document.querySelectorAll(".reveal").forEach(function (el) {
        revealObserver.observe(el);
    });

    // 2. Highlight the section after clicking a navbar link
    const links = document.querySelectorAll(".nav-links a");

    links.forEach(function (link) {
        link.addEventListener("click", function () {
            const target = document.querySelector(link.getAttribute("href"));
            if (!target) return;

            // Wait for the smooth scroll to arrive, then play the glow
            setTimeout(function () {
                target.classList.remove("flash");
                void target.offsetWidth; // restart the animation
                target.classList.add("flash");
            }, 450);
        });
    });

    // 3. Keep the current section's link highlighted while scrolling
    const sectionObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                links.forEach(function (link) {
                    link.classList.toggle(
                        "active",
                        link.getAttribute("href") === "#" + entry.target.id
                    );
                });
            }
        });
    }, { rootMargin: "-45% 0px -50% 0px" });

    document.querySelectorAll("section[id]").forEach(function (section) {
        sectionObserver.observe(section);
    });
});