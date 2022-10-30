const books = [];
const STORAGE_KEY = "Books_item";
const SAVED_BOOKS = "save_books";
const RENDER_EVENT = "render-books";

document.addEventListener("DOMContentLoaded", function () {
  const submitBook = document.getElementById("form");
  submitBook.addEventListener("submit", function (event) {
    event.preventDefault();
    addBook();
  });
  if (supportStorage()) {
    loadBookFromStorage();
  }
});

function supportStorage() {
  if (typeof storage === undefined) {
    alert("Browser anda tidak mendukung local storage");
    return false;
  }
  return true;
}

function loadBookFromStorage() {
  const getData = localStorage.getItem(STORAGE_KEY);
  const data = JSON.parse(getData);
  if (data !== null) {
    for (const book of data) {
      books.push(book);
    }
  }
  document.dispatchEvent(new Event(RENDER_EVENT));
}

function addBook() {
  const title = document.getElementById("book").value;
  const writer = document.getElementById("writer").value;
  const year = document.getElementById("year").value;
  const isCompleted = document.getElementById("isCompleted").checked;

  const bookId = generateID();
  const bookObject = generateBook(bookId, title, writer, year, isCompleted);
  books.push(bookObject);

  document.dispatchEvent(new Event(RENDER_EVENT));
  saveBooks();
}

function generateID() {
  return +new Date();
}

function generateBook(id, title, writer, year, isCompleted) {
  return {
    id,
    title,
    writer,
    year,
    isCompleted,
  };
}

function saveBooks() {
  if (supportStorage()) {
    const pushData = JSON.stringify(books);
    localStorage.setItem(STORAGE_KEY, pushData);
    document.dispatchEvent(new Event(SAVED_BOOKS));
  }
}

function doneBook(bookId) {
  const bookIdItem = findBook(bookId);
  if (bookIdItem != null) {
    bookIdItem.isCompleted = true;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveBooks();
  }
  return;
}

function resetBook(bookId) {
  const bookIdItem = findBook(bookId);
  if (bookIdItem != null) {
    bookIdItem.isCompleted = false;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveBooks();
  }
  return;
}

function deleteBook(bookId) {
  const bookIndexItem = findTodoIndex(bookId);

  if (bookIndexItem === -1) return;

  books.splice(bookIndexItem, 1);
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveBooks();
}

function searchBook() {
  let titleBook = document.getElementById("search").value.toUpperCase();
  let container = document.getElementById("content");
  let card = container.getElementsByClassName("card-group");

  for (i = 0; i < card.length; i++) {
    let cardTitle = card[i].getElementsByClassName("card-title")[0];
    if (cardTitle.innerText.toUpperCase().indexOf(titleBook) > -1) {
      card[i].style.display = "flex";
    } else {
      card[i].style.display = "none";
    }
  }
}

function findBook(bookId) {
  for (const booksItem of books) {
    if (booksItem.id == bookId) {
      return booksItem;
    }
  }
  return null;
}

function findTodoIndex(bookId) {
  for (const index in books) {
    if (books[index].id === bookId) {
      return index;
    }
  }

  return -1;
}

document.addEventListener(SAVED_BOOKS, function () {
  console.log(localStorage.getItem(STORAGE_KEY));
});

function makeBook(bookObject) {
  const cardGroup = document.createElement("div");
  cardGroup.classList.add("card-group");
  const card = document.createElement("div");
  card.classList.add("card");
  const title = document.createElement("div");
  title.classList.add("card-title");
  title.innerText = bookObject.title;
  const body = document.createElement("div");
  body.classList.add("card-body");
  const writer = document.createElement("p");
  writer.innerText = "Penulis : " + bookObject.writer;
  const year = document.createElement("p");
  year.innerText = "Tahun : " + bookObject.year;

  body.append(writer, year);
  card.append(title, body);

  const buttonField = document.createElement("div");
  buttonField.classList.add("button-field");
  const buttonCheck = document.createElement("button");
  buttonCheck.classList.add("button", "check");
  buttonCheck.addEventListener("click", function () {
    if (confirm("Apakah anda yakin sudah selesai?")) {
      doneBook(bookObject.id);
    } else {
      return;
    }
  });
  const buttonTrash = document.createElement("button");
  buttonTrash.classList.add("button", "trash");
  buttonTrash.addEventListener("click", function () {
    if (confirm("Apakah anda yakin menghapus buku?")) {
      deleteBook(bookObject.id);
    } else {
      return;
    }
  });
  const buttonReset = document.createElement("button");
  buttonReset.classList.add("button", "reset");
  buttonReset.addEventListener("click", function () {
    if (confirm("Apakah anda yakin belum selesai?")) {
      resetBook(bookObject.id);
    } else {
      return;
    }
  });
  const iconReset = document.createElement("i");
  iconReset.classList.add("bi", "bi-arrow-counterclockwise");
  const iconTrash = document.createElement("i");
  iconTrash.classList.add("bi", "bi-trash3");
  const iconCheck = document.createElement("i");
  iconCheck.classList.add("bi", "bi-check-lg");

  buttonReset.append(iconReset);
  buttonCheck.append(iconCheck);
  buttonTrash.append(iconTrash);

  if (bookObject.isCompleted) {
    buttonField.append(buttonReset, buttonTrash);
  } else {
    buttonField.append(buttonCheck, buttonTrash);
  }

  cardGroup.append(card, buttonField);

  return cardGroup;
}

document.addEventListener(RENDER_EVENT, function () {
  const uncompletedBookList = document.getElementById("list-unComplete");
  uncompletedBookList.innerHTML = `<div class="card-box-header">
  <p class="card-box-title">Belum Selesai Dibaca</p>
</div>`;

  const completedBookList = document.getElementById("list-Complete");
  completedBookList.innerHTML = `<div class="card-box-header">
  <p class="card-box-title">Selesai Dibaca</p>
</div>`;

  for (const bookItem of books) {
    const bookElement = makeBook(bookItem);
    if (!bookItem.isCompleted) uncompletedBookList.append(bookElement);
    else completedBookList.append(bookElement);
  }
});

let Navbar = document.getElementById("navbar");

window.addEventListener("scroll", () => {
  // "use strict";
  if (document.documentElement.scrollTop > 50) {
    Navbar.classList.add("nav-shadow");
  } else {
    Navbar.classList.remove("nav-shadow");
  }
});
