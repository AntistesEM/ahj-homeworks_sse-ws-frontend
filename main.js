/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 403:
/***/ (() => {

// Создаем новое WebSocket-соединение с сервером на ws://localhost:8080
// const socket = new WebSocket('ws://localhost:8080');
const socket = new WebSocket('ws://ahj-homeworks-sse-ws-backend.onrender.com:8080');

// Получаем ссылки на элементы интерфейса
const pseudonymDiv = document.querySelector('.modal-pseudonym');
const messageInput = pseudonymDiv.querySelector('.pseudonym-text');
const sendButton = pseudonymDiv.querySelector('.pseudonym-btn');
const wrap = document.querySelector(".wrap");
const chatMessages = document.querySelector('.chat-messages');
const chatInputText = document.querySelector(".chat-input-text");
let nameUs = "";

// Функция, которая вызывается при открытии WebSocket-соединения
socket.onopen = function () {
  console.log('WebSocket connection opened');
};

// Функция, которая вызывается при получении сообщения от сервера
socket.onmessage = function (event) {
  const data = JSON.parse(event.data); // Получаем само сообщение

  console.log('Received message:', data); // Выводим сообщение в консоль

  if (data.chat) {
    const dataChat = data.chat.message;
    createMessages(dataChat.name, dataChat.messageDate, dataChat.message);
    scrollToBottom();
  } else if (data.error) {
    messageInput.classList.add('error');
    messageInput.setAttribute('placeholder', data.error);
  } else if (data.name) {
    nameUs = data.name.name;
    pseudonymDiv.style.display = 'none';
    wrap.style.display = 'block';
    const divUsers = wrap.querySelector(".chat-users");
    divUsers.innerHTML = "";
    createUser(nameUs);
  } else if (data.list) {
    const divUsers = wrap.querySelector(".chat-users");
    divUsers.innerHTML = "";
    data.list.forEach(name => {
      createUser(name);
    });
  }
};

// Функция, которая вызывается при закрытии WebSocket-соединения
socket.onclose = function () {
  console.log('WebSocket connection closed');
};

// Функция, которая вызывается при возникновении ошибки в WebSocket-соединении
socket.onerror = function (error) {
  console.error('WebSocket error:', error);
};

// Обработчик события клика на кнопку "Продолжить"
sendButton.addEventListener('click', function () {
  const message = messageInput.value; // Получаем текст из поля ввода
  if (message.trim() !== '') {
    // Если поле не пустое
    const messageObject = JSON.stringify({
      userName: message.toString()
    });
    socket.send(messageObject); // Отправляем сообщение на сервер
    messageInput.value = ''; // Очищаем поле ввода
  }
});

// Обработчик события нажатия клавиши в поле ввода
messageInput.addEventListener('keyup', function (event) {
  if (event.key === 'Enter' && messageInput.value.trim() !== '') {
    // Если нажата клавиша Enter и строка не пустая
    sendButton.click(); // Имитируем клик на кнопку "Продолжить"
  }
});

// Обработчик события фокусировки на поле ввода псевдонима
messageInput.addEventListener('focus', () => {
  messageInput.classList.remove('error');
  messageInput.setAttribute('placeholder', "Введите псевдоним");
});

// Обработчик события нажатия клавиши Enter в поле ввода сообщений
chatInputText.addEventListener('keyup', function (event) {
  if (event.key === 'Enter' && chatInputText.value.trim() !== '') {
    // Если нажата клавиша Enter и строка не пустая
    const message = chatInputText.value;
    const messageDate = formatDate(new Date());
    const messageObject = JSON.stringify({
      message: {
        name: nameUs,
        message: message.toString(),
        messageDate
      }
    });
    socket.send(messageObject); // Отправляем сообщение на сервер
    chatInputText.value = ''; // Очищаем поле ввода
  }
});

// Обработчик события при закрытии соединения отправляем имя
window.addEventListener('beforeunload', () => {
  if (socket.readyState === WebSocket.OPEN) {
    socket.send(JSON.stringify({
      close: nameUs
    }));
  }
});

// функция для прокручивания контейнера вниз при добавлении нового сообщения
function scrollToBottom() {
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

// функция для подсвечивания своего пользователя в окне участников
function identification() {
  const chatUsers = wrap.querySelector(".chat-users");
  const listUserNameElements = chatUsers.querySelectorAll(".user-name");
  const myUser = Array.from(listUserNameElements).find(el => {
    return el.textContent === nameUs;
  });
  if (myUser) {
    myUser.textContent = "You";
    myUser.classList.add('my-user');
  }
}

// const newString = originalString.slice(0, -2);
// функция для подсвечивания своего пользователя в окне сообщений
function identificationMessages(params) {
  const listMessageUser = chatMessages.querySelectorAll(".message-user");
  console.log("listMessageUser===", listMessageUser);
  const myMessages = Array.from(listMessageUser).filter(el => el.textContent.slice(0, -2) === nameUs);
  console.log("myMessages===", myMessages);
  myMessages.forEach(element => {
    if (element) {
      console.log("element===", element);
      element.textContent = "You, ";
      const parent = element.closest(".chat-message");
      console.log("parent=", parent);
      parent.classList.add("my-message");
    }
  });
}

// функция создания пользователя в списке участников
function createUser(name = 'Name') {
  const divUsers = wrap.querySelector(".chat-users");
  const divWrap = document.createElement('div');
  divWrap.classList.add('user-wrap');
  const img = document.createElement('img');
  img.classList.add('user-img');
  const span = document.createElement('span');
  span.classList.add('user-name');
  span.textContent = name;
  divWrap.appendChild(img);
  divWrap.appendChild(span);
  divUsers.appendChild(divWrap);
  identification();
}

// функция создания сообщения в окне чата
function createMessages(name = 'Name', date = new Date(), message = 'Message') {
  const divMessages = wrap.querySelector(".chat-messages");
  const divChatMessage = document.createElement('div');
  divChatMessage.classList.add('chat-message');
  const divMessageData = document.createElement('div');
  divMessageData.classList.add('message-data');
  const spanMessageUser = document.createElement('span');
  spanMessageUser.classList.add('message-user');
  spanMessageUser.textContent = name + ", ";
  const spanMessageDate = document.createElement('span');
  spanMessageDate.classList.add('message-date');
  spanMessageDate.textContent = date;
  const spanMessageText = document.createElement('span');
  spanMessageText.classList.add('message-text');
  spanMessageText.textContent = message;
  divMessageData.appendChild(spanMessageUser);
  divMessageData.appendChild(spanMessageDate);
  divChatMessage.appendChild(divMessageData);
  divChatMessage.appendChild(spanMessageText);
  divMessages.appendChild(divChatMessage);
  identificationMessages();
}

// функция для форматирования формата даты и времени
function formatDate(timestamp) {
  const date = new Date(timestamp);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Месяцы в JavaScript идут с 0
  const year = String(date.getFullYear()).slice(-2);
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${hours}:${minutes} ${day}.${month}.${year}`;
}

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be in strict mode.
(() => {
"use strict";

// EXTERNAL MODULE: ./src/js/chat.js
var chat = __webpack_require__(403);
;// CONCATENATED MODULE: ./src/js/app.js

;// CONCATENATED MODULE: ./src/index.js



// TODO: write your code in app.js
})();

/******/ })()
;