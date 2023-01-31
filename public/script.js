const socket = io();

//!-----User connect-------
const inboxPeople = document.querySelector(".inbox_people");

let userName = "";

const newUserConnected = (user) => {
  userName = user || `User${Math.floor(Math.random() * 1000000)}`;
  socket.emit("new user", userName);
  addToUserBox(userName);
};

const addToUserBox = (userName) => {
  if (!!document.querySelector(`.${userName}-userlist`)) {
    return;
  }
  const userBox = `
  <div class='chat_id ${userName}-userlist'>
  <h5>${userName}</h5>
  </div>
  `;
  inboxPeople.innerHTML += userBox;
};

newUserConnected();

socket.on("new user", function (data) {
  data.map((user) => addToUserBox(user));
});

socket.on("user disconnected", function (userName) {
  document.querySelector(`.${userName}-userlist`).remove();
});

//!----- chat message ------
const inputField = document.querySelector(".message_form__input");
const messageForm = document.querySelector(".message_form");
const messageBox = document.querySelector(".messages__history");

const addNewMessage = ({ user, message }) => {
  const time = new Date();
  const formattedTime = time.toLocaleString("en-US", {
    hour: "numeric",
    minute: "numeric",
  });
  console.log(formattedTime);
  const receviedMsg = `
  <div className="incoming_message">
  <div className="received_message">
    <p>${message}</p>
    <div className="message_info">
        <span className="message_author">${user}</span>
        <span className="time_data">${formattedTime}</span>
    </div>
  </div>
  </div>
  `;

  const myMsg = `
  <div className="outgoin_message">
    <div className="sent_message">
        <p>${message}</p>
        <div className="message_info">
            <span className="time_data">${formattedTime}</span>
        </div>
    </div>
  </div>
  `;
  console.log(user, userName);
  messageBox.innerHTML += user === userName ? myMsg : receviedMsg;
};

messageForm.addEventListener("submit", (e) => {
  e.preventDefault();
  if (!inputField.value) {
    return;
  }
  socket.emit("chat message", {
    message: inputField.value,
    nick: userName,
  });

  inputField.value = null;
});

socket.on("chat message", function (data) {
  addNewMessage({ user: data.nick, message: data.message });
});

//!----add typing ------

const fallback = document.querySelector(".fallback");
console.log(fallback);

inputField.addEventListener("keyup", () => {
  console.log(inputField.value);
  socket.emit("typing", {
    isTyping: inputField.value.length > 0,
    nick: userName,
  });
});

socket.on("typing", function (data) {
  console.log("typing2");
  const { isTyping, nick } = data;
  console.log(isTyping);
  if (!isTyping) {
    fallback.innerHTML = "";
    return;
  }
  fallback.innerHTML = `<p>${nick} is typing...</p>`;
});
