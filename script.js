const searchInput = document.createElement("input");
searchInput.placeholder = "Search notes...";
searchInput.style.position = "fixed";
searchInput.style.top = "1rem";
searchInput.style.left = "1rem";
searchInput.style.padding = "5px";

document.body.appendChild(searchInput);

searchInput.addEventListener("input", (e) => {
  const searchText = e.target.value.toLowerCase();
  const notes = document.querySelectorAll(".note");

  notes.forEach((note) => {
    const content = note.querySelector("textarea").value.toLowerCase();
    if (content.includes(searchText)) {
      note.style.display = "block";
    } else {
      note.style.display = "none";
    }
  });
});

const addButton = document.getElementById("add");
const notes = JSON.parse(localStorage.getItem("notes"));

const updateLocalStorage = () => {
  const notesText = document.querySelectorAll("textarea");
  const notes = [];
  notesText.forEach((note) => notes.push(note.value));
  localStorage.setItem("notes", JSON.stringify(notes));
};

const addNewNote = (text = "") => {
  const note = document.createElement("div");
  note.classList.add("note");
  note.innerHTML = `
  <div class="tools">
        <button class="edit"><i class="fas fa-edit"></i></button>
        <button class="delete"><i class="fas fa-trash-alt"></i></button>
  </div>
  <div class="main ${text ? "" : "hidden"}"></div>
  <textarea class="${text ? "hidden" : ""}"></textarea>`;

  const editButton = note.querySelector(".edit");
  const deleteButton = note.querySelector(".delete");
  const main = note.querySelector(".main");
  const textArea = note.querySelector("textarea");
  textArea.value = text;
  main.innerHTML = marked(text);

  deleteButton.addEventListener("click", () => {
    note.remove();
    updateLocalStorage();
  });
  editButton.addEventListener("click", () => {
    main.classList.toggle("hidden");
    textArea.classList.toggle("hidden");
  });
  textArea.addEventListener("input", (e) => {
    const { value } = e.target;
    main.innerHTML = marked(value);
    updateLocalStorage();
  });
  document.body.appendChild(note);
};

addButton.addEventListener("click", () => addNewNote());

if (notes) {
  notes.forEach((note) => addNewNote(note));
}