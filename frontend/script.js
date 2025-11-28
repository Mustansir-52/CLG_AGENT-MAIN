const BACKEND_URL = "http://127.0.0.1:5000/chat";
const STORAGE_KEY = "campusguide_chat";
const SESSION_KEY = "campusguide_session";

const openBtn = document.getElementById("cg-open-btn");
const widget = document.getElementById("cg-widget");
const closeBtn = document.getElementById("cg-close-btn");
const chatbox = document.getElementById("cg-chatbox");
const sendBtn = document.getElementById("cg-send");
const inputEl = document.getElementById("cg-input");
const typingEl = document.getElementById("typing-indicator");
const clearBtn = document.getElementById("clear-chat");

let sessionId = localStorage.getItem(SESSION_KEY);
if (!sessionId) {
  sessionId = "sess_" + Math.random().toString(36).slice(2, 10);
  localStorage.setItem(SESSION_KEY, sessionId);
}

let messages = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
renderMessages();

openBtn.addEventListener("click", () => widget.classList.remove("hidden"));
closeBtn && closeBtn.addEventListener("click", () => widget.classList.add("hidden"));
sendBtn.addEventListener("click", onSend);
inputEl.addEventListener("keydown", e => { if (e.key === "Enter") onSend(); });
clearBtn && clearBtn.addEventListener("click", clearChat);

function renderMessages() {
  chatbox.innerHTML = "";
  messages.forEach(m => {
    const el = createMessageEl(m.sender, m.text);
    chatbox.appendChild(el);
  });
  chatbox.scrollTop = chatbox.scrollHeight;
}

function createMessageEl(sender, text) {
  const div = document.createElement("div");
  div.className = "msg " + (sender === "user" ? "user" : "bot");
  div.textContent = (sender === "user" ? "You: " : "Bot: ") + text;
  return div;
}

function showTyping(on = true) {
  if (on) typingEl.classList.remove("hidden");
  else typingEl.classList.add("hidden");
}

function persist() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
}

async function onSend() {
  const text = inputEl.value.trim();
  if (!text) return;
  inputEl.value = "";

  messages.push({ sender: "user", text });
  persist();

  chatbox.appendChild(createMessageEl("user", text));
  chatbox.scrollTop = chatbox.scrollHeight;

  showTyping(true);

  // ----------------------------------------------------
  // DAY ORDER ENGINE (today, tomorrow, day after, DO#)
  // ----------------------------------------------------
  const lower = text.toLowerCase();
  if (lower.includes("day order")) {

    const now = new Date();
    let targetDate = new Date();

    // tomorrow
    if (lower.includes("tomorrow")) {
      targetDate.setDate(now.getDate() + 1);
    }

    // day after tomorrow
    else if (lower.includes("day after")) {
      targetDate.setDate(now.getDate() + 2);
    }

    // day order 1/2/3/4/5/6
    const matchNum = lower.match(/day order\s*(\d)/);
    if (matchNum) {
      const num = parseInt(matchNum[1]);
      if (num >= 1 && num <= 6) {
        showTyping(false);
        const reply = `Day Order ${num}.`;
        messages.push({ sender: "bot", text: reply });
        persist();
        chatbox.appendChild(createMessageEl("bot", reply));
        chatbox.scrollTop = chatbox.scrollHeight;
        return;
      }
    }

    const weekday = targetDate.getDay(); // Sun=0

    const orderMap = {
      1: "Day Order 1",
      2: "Day Order 2",
      3: "Day Order 3",
      4: "Day Order 4",
      5: "Day Order 5",
      6: "Day Order 6"
    };

    let reply;
    if (weekday === 0) {
      reply = "It is Sunday. No day order.";
    } else {
      reply = `The day order for that day is ${orderMap[weekday]}.`;
    }

    showTyping(false);
    messages.push({ sender: "bot", text: reply });
    persist();
    chatbox.appendChild(createMessageEl("bot", reply));
    chatbox.scrollTop = chatbox.scrollHeight;
    return;
  }

  // ----------------------------------------------------
  // BACKEND CALL (normal chat)
  // ----------------------------------------------------
  try {
    const r = await fetch(BACKEND_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: text, sessionId })
    });

    const data = await r.json();
    const reply = data.reply || "⚠ No reply from server.";

    messages.push({ sender: "bot", text: reply });
    persist();

    showTyping(false);
    chatbox.appendChild(createMessageEl("bot", reply));
    chatbox.scrollTop = chatbox.scrollHeight;

  } catch (err) {
    showTyping(false);
    const errText = "❌ Cannot connect to backend.";
    messages.push({ sender: "bot", text: errText });
    persist();
    chatbox.appendChild(createMessageEl("bot", errText));
    chatbox.scrollTop = chatbox.scrollHeight;
  }
}

function clearChat() {
  messages = [];
  persist();
  chatbox.innerHTML = "";

  sessionId = "sess_" + Math.random().toString(36).slice(2, 10);
  localStorage.setItem(SESSION_KEY, sessionId);
}

if (!localStorage.getItem("cg_seen_before")) {
  widget.classList.remove("hidden");
  localStorage.setItem("cg_seen_before", "1");
}
