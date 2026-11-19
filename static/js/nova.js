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
            showTypingThen("Hi there! 👋 I'm Nova, your Learnova study buddy. Ask me anything about Learnova!");
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
    // Nova's brain. For now: built-in answers about Learnova.
    // LATER: we replace this function with a call to Flask + Gemini.
    // ============================================================
    async function getNovaReply(message) {
        const m = message.toLowerCase();

        if (/\b(hi|hello|hey|hii|salam)\b/.test(m)) {
            return "Hello! 😊 How can I help you today?";
        }
        if (m.includes("what is learnova") || m.includes("about")) {
            return "Learnova is an AI-powered study assistant. You can chat with AI, summarize your notes, generate quizzes and get simple explanations of tough concepts — all in one place.";
        }
        if (m.includes("feature") || m.includes("what can you do")) {
            return "Learnova has 4 main features:\n💬 AI Chat\n📝 Notes Summarizer\n🧠 Quiz Generator\n💡 Concept Explainer";
        }
        if (m.includes("quiz")) {
            return "Just enter a topic or paste your notes, and Learnova creates multiple-choice questions for you. Answer them and you'll see your score instantly! 🧠";
        }
        if (m.includes("summar") || m.includes("notes")) {
            return "Paste your notes or upload a file, and Learnova turns them into a short summary with the key points. 📝";
        }
        if (m.includes("free") || m.includes("price") || m.includes("cost")) {
            return "Yes! Learnova is completely free to use. 🎉";
        }
        if (m.includes("sign") || m.includes("account") || m.includes("login") || m.includes("register")) {
            return "Click \"Get Started\" on the home page to create a free account. Already have one? Click \"I already have an account\" to log in.";
        }
        if (m.includes("who made") || m.includes("who built") || m.includes("creator")) {
            return "Learnova was built by CSE students as their minor project. 👩‍💻";
        }
        if (m.includes("thank")) {
            return "You're welcome! Happy studying! 📚";
        }

        return "Good question! 🤔 Right now I can only answer questions about Learnova. Soon I'll be connected to AI and able to answer any study question. Try asking: \"What is Learnova?\"";
    }
});