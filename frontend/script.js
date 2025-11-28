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

  // ----------------------------
  // 1. LOCAL DAY ORDER CHECK
  // ----------------------------
  const lower = text.toLowerCase();

  if (lower.includes("day order")) {

    const today = new Date();
    const weekday = today.getDay(); // Sun=0, Mon=1...

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
      reply = "Today is Sunday. No day order.";
    } else {
      reply = `Today's day order is ${orderMap[weekday]}.`;
    }

    showTyping(false);

    messages.push({ sender: "bot", text: reply });
    persist();

    chatbox.appendChild(createMessageEl("bot", reply));
    chatbox.scrollTop = chatbox.scrollHeight;

    return;  // STOP here. Do NOT call backend.
  }

  // ----------------------------
  // 2. NORMAL BACKEND CALL
  // ----------------------------
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

  sessionId = "sess_" + Math.random().toString(36).slice(2,10);
  localStorage.setItem(SESSION_KEY, sessionId);
}


if (!localStorage.getItem("cg_seen_before")) {
  widget.classList.remove("hidden");  
  localStorage.setItem("cg_seen_before", "1");
}
