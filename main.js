/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
var __webpack_exports__ = {};

;// CONCATENATED MODULE: ./src/js/modal.js
const container = document.querySelector(".container");
const url = "http://localhost:3000/";
let tickedId;
function init() {
  showLoader();
  fetch(url + "?method=allTickets").then(res => res.json()).then(json => {
    json.forEach(ticket => {
      const date = formatDate(ticket.created);
      const newTicket = createTicketElement(ticket.id, ticket.name, date, ticket.status);
      const listTickets = container.querySelector(".list-tickets");
      listTickets.appendChild(newTicket);
      hideLoader();
    });
  });
}
function createTicketElement(id, title, date, status, description = null) {
  // Создаем основной div.ticket
  const ticketDiv = document.createElement("div");
  ticketDiv.classList.add("ticket");
  ticketDiv.id = id;

  // Создаем div.wrap
  const wrapDiv = document.createElement("div");
  wrapDiv.classList.add("wrap");

  // Создаем div.ticket-input-wrap
  const inputWrapDiv = document.createElement("div");
  inputWrapDiv.classList.add("ticket-input-wrap");

  // Создаем label
  const labelElement = document.createElement("label");

  // Создаем input
  const inputElement = document.createElement("input");
  inputElement.type = "checkbox";
  inputElement.classList.add("ticket-input");
  if (status) {
    inputElement.checked = true;
  }

  // Создаем span.ticket-input-span
  const inputSpanElement = document.createElement("span");
  inputSpanElement.classList.add("ticket-input-span");

  // Создаем span.ticket-title
  const titleSpanElement = document.createElement("span");
  titleSpanElement.classList.add("ticket-title");
  titleSpanElement.textContent = title;

  // Создаем div.ticket-btns
  const btnsDiv = document.createElement("div");
  btnsDiv.classList.add("ticket-btns");

  // Создаем span.ticket-date
  const dateSpanElement = document.createElement("span");
  dateSpanElement.classList.add("ticket-date");
  dateSpanElement.textContent = date;

  // Создаем button.ticket-btn-edit
  const editButtonElement = document.createElement("button");
  editButtonElement.classList.add("ticket-btn-edit");

  // Создаем button.ticket-btn-delete
  const deleteButtonElement = document.createElement("button");
  deleteButtonElement.classList.add("ticket-btn-delete");

  // Создаем p.description
  const descriptionElement = document.createElement("p");
  descriptionElement.classList.add("description");
  descriptionElement.textContent = description;

  // Собираем структуру
  labelElement.appendChild(inputElement);
  labelElement.appendChild(inputSpanElement);
  inputWrapDiv.appendChild(labelElement);
  inputWrapDiv.appendChild(titleSpanElement);
  btnsDiv.appendChild(dateSpanElement);
  btnsDiv.appendChild(editButtonElement);
  btnsDiv.appendChild(deleteButtonElement);
  wrapDiv.appendChild(inputWrapDiv);
  wrapDiv.appendChild(btnsDiv);
  ticketDiv.appendChild(wrapDiv);
  ticketDiv.appendChild(descriptionElement);
  return ticketDiv;
}
container.addEventListener("click", e => {
  if (e.target.classList.contains("add-tickets")) {
    const modal = document.querySelector(".add");
    modal.style.display = "block";
  } else if (e.target.classList.contains("ticket-btn-edit")) {
    const parent = e.target.closest(".ticket");
    tickedId = parent.id;
    const modal = document.querySelector(".edit");
    modal.style.display = "block";
  } else if (e.target.classList.contains("ticket-btn-delete")) {
    const parent = e.target.closest(".ticket");
    tickedId = parent.id;
    const modal = document.querySelector(".delete");
    modal.style.display = "block";
  } else if (e.target.classList.contains("ticket-title")) {
    const parent = e.target.closest(".ticket");
    const description = parent.querySelector(".description");
    const uri = `?method=ticketById&id=${parent.id}`;
    fetch(url + uri).then(res => res.json()).then(json => {
      description.textContent = json.description;
      toggleDisplay(description);
    });
  } else if (e.target.classList.contains("ticket-input-span")) {
    const parent = e.target.closest(".ticket");
    const checkedEl = parent.querySelector(".ticket-input");
    let status;
    if (checkedEl.checked === true) {
      status = false;
    } else {
      status = true;
    }
    const body = {
      status: status
    };
    const uri = `?method=updateTicketStatus&id=${parent.id}`;
    fetch(url + uri, {
      method: "PATCH",
      body: JSON.stringify(body),
      headers: {
        "Content-Type": "application/json"
      }
    }).then(response => response.json()).then(json => {
      console.log("Status updated:", json);
    }).catch(error => {
      console.error("Error updating status:", error);
    });
  }
});
document.querySelectorAll(".modal").forEach(modal => {
  modal.addEventListener("click", e => {
    if (e.target.classList.contains("btn-cancel")) {
      modal.style.display = "none";
    } else if (e.target.classList.contains("btn-ok")) {
      if (modal.classList.contains("add")) {
        const name = modal.querySelector(".modal-input").value;
        const description = modal.querySelector(".modal-textarea").value;
        const newTicket = {
          name: name,
          description: description,
          status: false
        };
        requestMy("?method=createTicket", {
          method: "POST",
          body: JSON.stringify(newTicket),
          headers: {
            "Content-Type": "application/json"
          }
        });
      } else if (modal.classList.contains("delete")) {
        const uri = `?method=ticketDelById&id=${tickedId}`;
        fetch(url + uri).then(res => res.json()).then(json => {
          return json;
        });
      } else if (modal.classList.contains("edit")) {
        const updatedName = modal.querySelector(".modal-input").value;
        const updatedDescription = modal.querySelector(".modal-textarea").value;
        const data = {
          name: updatedName,
          description: updatedDescription
        };
        const uri = `?method=updateTicket&id=${tickedId}`;
        const urlNew = url + uri;
        fetch(urlNew, {
          method: "PATCH",
          body: JSON.stringify(data),
          headers: {
            "Content-Type": "application/json"
          }
        }).then(response => response.json()).then(json => {
          console.log("Ticket updated:", json);
        }).catch(error => {
          console.error("Error updating ticket:", error);
        });
      }
    }
  });
});
function toggleDisplay(description) {
  description.style.display = description.style.display === "none" ? "block" : "none";
}
function requestMy(uri, options = null) {
  const urlNew = url + uri;
  fetch(urlNew, options).then(res => res.json()).then(json => {
    return json;
  });
}
function formatDate(timestamp) {
  const date = new Date(timestamp);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Месяцы в JavaScript идут с 0
  const year = String(date.getFullYear()).slice(-2);
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${day}.${month}.${year} ${hours}:${minutes}`;
}

// Функция для показа иконки загрузки
function showLoader() {
  const loaderContainer = document.getElementById('loader');
  loaderContainer.style.display = 'flex';
}

// Функция для скрытия иконки загрузки
function hideLoader() {
  const loaderContainer = document.getElementById('loader');
  loaderContainer.style.display = 'none';
}
;// CONCATENATED MODULE: ./src/js/app.js


init();
;// CONCATENATED MODULE: ./src/index.js



// TODO: write your code in app.js
/******/ })()
;