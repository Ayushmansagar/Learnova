document.addEventListener("DOMContentLoaded", function () {
    const launcher = document.getElementById("novaLauncher");
    const chat = document.getElementById("novaChat");
    const closeBtn = document.getElementById("novaClose");
    const greeting = document.getElementById("novaGreeting");
    const greetingClose = document.getElementById("novaGreetingClose");
    const messages = document.getElementById("novaMessages");
    const form = document.getElementById("novaForm");
    const input = document.getElementById("novaInput");
    const suggestions = document.getElementById("novaSuggestions");

    let welcomed = false;

    // Show the "Hi!" bubble shortly after the page loads
    setTimeout(function () {
        if (!chat.classList.contains("open")) {
            greeting.classList.add("show");
        }
    }, 1500);

    greetingClose.addEventListener("click", function (e) {
        e.stopPropagation();
        greeting.classList.remove("show");
    });

    greeting.addEventListener("click", openChat);
    launcher.addEventListener("click", function () {
        chat.classList.contains("open") ? closeChat() : openChat();
    });
    closeBtn.addEventListener("click", closeChat);

    function openChat() {
        chat.classList.add("open");
        document.body.classList.add("nova-open");
        greeting.classList.remove("show");
        launcher.textContent = "✕";
        input.focus();

        if (!welcomed) {
            welcomed = true;
            showTypingThen("Hi there! 👋 I'm Nova, your study buddy. Ask me any study question — I can explain concepts, help with doubts, and more!");
        }
    }

    function closeChat() {
        chat.classList.remove("open");
        document.body.classList.remove("nova-open");
        launcher.textContent = "🤖";
    }

    // Suggestion chips
    suggestions.querySelectorAll("button").forEach(function (btn) {
        btn.addEventListener("click", function () {
            sendMessage(btn.textContent);
        });
    });

    form.addEventListener("submit", function (e) {
        e.preventDefault();
        const text = input.value.trim();
        if (text) sendMessage(text);
    });

    async function sendMessage(text) {
        addMessage(text, "user");
        input.value = "";
        suggestions.style.display = "none";

        const typing = addTyping();
        const reply = await getNovaReply(text);

        // Small delay so it feels natural
        setTimeout(function () {
            typing.remove();
            addMessage(reply, "bot");
        }, 600);
    }

    function showTypingThen(text) {
        const typing = addTyping();
        setTimeout(function () {
            typing.remove();
            addMessage(text, "bot");
        }, 700);
    }

    function addMessage(text, sender) {
        const msg = document.createElement("div");
        msg.className = "nova-msg " + sender;
        msg.textContent = text; // textContent keeps it safe from HTML injection
        messages.appendChild(msg);
        messages.scrollTop = messages.scrollHeight;
        return msg;
    }

    function addTyping() {
        const typing = document.createElement("div");
        typing.className = "nova-msg bot typing";
        typing.innerHTML = "<span></span><span></span><span></span>";
        messages.appendChild(typing);
        messages.scrollTop = messages.scrollHeight;
        return typing;
    }

        // ============================================================
    // Nova's brain: asks Flask, which asks Gemini
    // ============================================================
    const history = [];

    async function getNovaReply(message) {
        history.push({ role: "user", text: message });

        try {
            const res = await fetch("/api/nova", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ messages: history })
            });
            const data = await res.json();

            if (!res.ok) throw new Error(data.error || "Request failed");

            history.push({ role: "bot", text: data.reply });
            return data.reply;
        } catch (err) {
            history.pop(); // remove the question that failed
            return err.message.includes("break")
                ? err.message
                : "Sorry, I couldn't connect right now. Please check that the server is running and try again.";
        }
    }
});