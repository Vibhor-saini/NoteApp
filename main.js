const noteListDiv = document.querySelector(".note-list");
let noteID = 1;

function Note(id, title, content, date) {
  this.id = id;
  this.title = title;
  this.content = content;
  this.date = date;
}

function eventListeners() {
  document.addEventListener("DOMContentLoaded", displayNotes);
  document.getElementById("add-note-btn").addEventListener("click", addNewNote);
  document.getElementById("update-note-btn").addEventListener("click", updateNote);
  noteListDiv.addEventListener("click", handleNoteClick);
  document.getElementById("delete-all-btn").addEventListener("click", deleteAllNotes);
}

eventListeners();

function getDataFromStorage() {
  return localStorage.getItem("notes")
    ? JSON.parse(localStorage.getItem("notes"))
    : [];
}


// function for add new note 

function addNewNote() {
  const noteTitle = document.getElementById("note-title"),
    noteContent = document.getElementById("note-content");
  if (validateInput(noteTitle, noteContent)) {
    let notes = getDataFromStorage();
    let currentDate = new Date();
    let noteItem = new Note(
      noteID,
      noteTitle.value,
      noteContent.value,
      currentDate.toLocaleString()
    );
    noteID++;
    notes.push(noteItem);
    createNote(noteItem);
    localStorage.setItem("notes", JSON.stringify(notes));
    noteTitle.value = "";
    noteContent.value = "";
  }
}

function validateInput(title, content) {
  if (title.value !== "" && content.value !== "") {
    return true;
  } else {
    if (title.value === "") title.classList.add("warning");
    if (content.value === "") content.classList.add("warning");
  }
  setTimeout(() => {
    title.classList.remove("warning");
    content.classList.remove("warning");
  }, 1500);
}


// function for create note

function createNote(noteItem) {
  const div = document.createElement("div");
  div.classList.add("note-item");
  div.setAttribute("data-id", noteItem.id);
  div.innerHTML = `
        <h3>${noteItem.title}</h3>
        <p>${noteItem.content}</p>
        <p>Created on: ${noteItem.date}</p>
        <button type="button" class="btn edit-note-btn">
          <span><i class="fas fa-edit"></i></span>
          Edit
        </button>
        <button type="button" class="btn delete-note-btn">
          <span><i class="fas fa-trash"></i></span>
          Remove
        </button>      
    `;
  noteListDiv.appendChild(div);
}

function displayNotes() {
  let notes = getDataFromStorage();
  if (notes.length > 0) {
    noteID = notes[notes.length - 1].id;
    noteID++;
  } else {
    noteID = 1;
  }
  notes.forEach((item) => {
    createNote(item);
  });
}

function handleNoteClick(e) {
  if (e.target.classList.contains("delete-note-btn")) {
    deleteNote(e);
  } else if (e.target.classList.contains("edit-note-btn")) {
    editNote(e);
  } else if (e.target.classList.contains("update-note-btn")) {
    updateNote();
  }
}

function deleteNote(e) {
  if (e.target.classList.contains("delete-note-btn")) {
    e.target.parentElement.remove();
    let divID = e.target.parentElement.dataset.id;
    let notes = getDataFromStorage();
    let newNotesList = notes.filter((item) => {
      return item.id !== parseInt(divID);
    });
    localStorage.setItem("notes", JSON.stringify(newNotesList));
  }
}

function editNote(e) {
  if (e.target.classList.contains("edit-note-btn")) {
    let divID = e.target.parentElement.dataset.id;
    let notes = getDataFromStorage();
    let noteToEdit = notes.find((item) => item.id === parseInt(divID));
    if (noteToEdit) {
      document.getElementById("note-title").value = noteToEdit.title;
      document.getElementById("note-content").value = noteToEdit.content;
      e.target.parentElement.classList.add("editing");
    }
  }
}


function updateNote() {
  const noteTitle = document.getElementById("note-title");
  const noteContent = document.getElementById("note-content");

  if (validateInput(noteTitle, noteContent)) {
    const updatedTitle = noteTitle.value;
    const updatedContent = noteContent.value;

    const noteDiv = document.querySelector(".note-item.editing");
    if (noteDiv) {
      const noteID = noteDiv.dataset.id;

      let notes = getDataFromStorage();
      notes = notes.map((item) => {
        if (item.id === parseInt(noteID)) {
          item.title = updatedTitle;
          item.content = updatedContent;
          item.date = new Date().toLocaleString();
        }
        return item;
      });
      localStorage.setItem("notes", JSON.stringify(notes));

      updateNoteUI(noteID, updatedTitle, updatedContent);

      noteTitle.value = "";
      noteContent.value = "";

      noteDiv.classList.remove("editing");
    }
  }
}


// update UI
function updateNoteUI(id, updatedTitle, updatedContent) {
  let noteDiv = document.querySelector(`.note-item[data-id="${id}"]`);
  if (noteDiv) {
    noteDiv.querySelector("h3").textContent = updatedTitle;
    noteDiv.querySelector("p").textContent = updatedContent;
  }
}

// Delete all nodes

function deleteAllNotes() {
  localStorage.removeItem("notes");
  let noteList = document.querySelectorAll(".note-item");
  if (noteList.length > 0) {
    noteList.forEach((item) => {
      noteListDiv.removeChild(item);
    });
  }
  noteID = 1;
}
