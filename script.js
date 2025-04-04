const chat = document.getElementById("chat");
const chatContainer = document.getElementById("chat-container");
const dragHandle = document.getElementById("drag-handle");
const userChat = document.getElementById("user-chat");
const userInput = document.getElementById("user-input");
const sendButton = document.getElementById("send-button");

function addMessage(username, text) {
    const msg = document.createElement("div");
    msg.classList.add("message");
    msg.innerHTML = `<strong>${username}:</strong> ${text}`;
    chat.appendChild(msg);
    chat.scrollTop = chat.scrollHeight;
    if (chat.children.length > 10) {
        chat.removeChild(chat.children[0]);
    }
}

sendButton.addEventListener("click", () => {
    const text = userInput.value;
    if (text.trim() !== "") {
        const msg = document.createElement("div");
        msg.classList.add("message");
        msg.innerHTML = `<strong>Вы:</strong> ${text}`;
        userChat.appendChild(msg);
        userChat.scrollTop = userChat.scrollHeight;
        userInput.value = "";
    }
});

// Добавление функции перетаскивания окна
let offsetX, offsetY, isDragging = false;

dragHandle.addEventListener("mousedown", (e) => {
    isDragging = true;
    offsetX = e.clientX - chatContainer.offsetLeft;
    offsetY = e.clientY - chatContainer.offsetTop;
    chatContainer.style.cursor = "grabbing";
});

document.addEventListener("mousemove", (e) => {
    if (isDragging) {
        chatContainer.style.left = `${e.clientX - offsetX}px`;
        chatContainer.style.top = `${e.clientY - offsetY}px`;
    }
});

document.addEventListener("mouseup", () => {
    isDragging = false;
    chatContainer.style.cursor = "grab";
});

// Получение сообщений с Twitch
const ws = new WebSocket("wss://irc-ws.chat.twitch.tv");
ws.onopen = function () {
    ws.send("PASS oauth:your_oauth_token");
    ws.send("NICK your_twitch_nickname");
    ws.send("JOIN #your_channel_name");
};
ws.onmessage = function (event) {
    const match = event.data.match(/:(\w+)!.*PRIVMSG.*:(.*)/);
    if (match) {
        addMessage(match[1], match[2]);
    }
};