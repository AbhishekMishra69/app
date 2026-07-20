let currentUser = "";
var stompClient = null;

function setConnected(connected) {
    document.getElementById('sendMessage').disabled = !connected;
}

function connect() {

    var socket = new SockJS('/chat');
    stompClient = Stomp.over(socket);

    stompClient.connect({}, function (frame) {

        setConnected(true);

        stompClient.subscribe('/topic/messages', function (message) {

            showMessage(JSON.parse(message.body));

        });

    });
}


function showMessage(message) {

    const chat = document.getElementById("chat");

    const isMe = message.sender === currentUser;

    const messageRow = document.createElement("div");
    messageRow.className = isMe ? "message-row me" : "message-row";

    const avatar = document.createElement("div");
    avatar.className = "message-avatar";
    avatar.innerHTML = message.sender.charAt(0).toUpperCase();

    const bubble = document.createElement("div");
    bubble.className = isMe ? "message-bubble me" : "message-bubble";

    const sender = document.createElement("div");
    sender.className = "sender-name";
    sender.innerHTML = isMe ? "You" : message.sender;

    const text = document.createElement("div");
    text.className = "message-text";
    text.innerHTML = message.content;

    const time = document.createElement("div");
    time.className = "message-time";

    const now = new Date();

    time.innerHTML =
        now.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit"
        });

    bubble.appendChild(sender);
    bubble.appendChild(text);
    bubble.appendChild(time);

    if (isMe) {

        messageRow.appendChild(bubble);
        messageRow.appendChild(avatar);

    } else {

        messageRow.appendChild(avatar);
        messageRow.appendChild(bubble);

    }

    chat.appendChild(messageRow);

    chat.scrollTop = chat.scrollHeight;

}
function sendMessage() {

    const sender = currentUser;

    const content = document.getElementById("messageInput").value.trim();

    if (sender === "" || content === "") {
        return;
    }

    const chatMessage = {

        sender: sender,

        content: content

    };

    stompClient.send(
        "/app/sendMessage",
        {},
        JSON.stringify(chatMessage)
    );

    document.getElementById("messageInput").value = "";
    document.getElementById("messageInput").focus();

}
document.getElementById("sendMessage").addEventListener("click", sendMessage);

document.getElementById("messageInput").addEventListener("keypress", function (e) {

    if (e.key === "Enter") {

        sendMessage();

    }

});

const joinBtn = document.getElementById("joinBtn");

if (joinBtn) {

    joinBtn.addEventListener("click", function () {

        const name = document.getElementById("senderInput").value.trim();

        if (name === "") {
            alert("Please enter your name");
            return;
        }

        currentUser = name;

        document.getElementById("currentUser").innerHTML = name;

        document.getElementById("headerAvatar").innerHTML =
            name.charAt(0).toUpperCase();

        document.getElementById("joinScreen").style.display = "none";

        document.getElementById("chatScreen").style.display = "flex";

        connect();
        document.getElementById("messageInput").focus();

    });

}

// Theme Toggle

const themeBtn = document.getElementById("themeBtn");

if (themeBtn) {

    const savedTheme = localStorage.getItem("theme");

    if (savedTheme === "dark") {

        document.body.classList.add("dark");
        themeBtn.innerHTML = "☀️";

    }

    themeBtn.addEventListener("click", function () {

        document.body.classList.toggle("dark");

        if (document.body.classList.contains("dark")) {

            localStorage.setItem("theme", "dark");
            themeBtn.innerHTML = "☀️";

        } else {

            localStorage.setItem("theme", "light");
            themeBtn.innerHTML = "🌙";

        }

    });

}