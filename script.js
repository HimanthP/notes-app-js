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
    const title = note.querySelector(".title").value.toLowerCase();
const content = note.querySelector("textarea").value.toLowerCase();

if (title.includes(searchText) || content.includes(searchText)) {
  note.style.display = "block";
} else {
  note.style.display = "none";
}
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
  notes.push({
    title: note.parentElement.querySelector(".title").value,
    text: note.value,
    createdAt: new Date().toISOString()
  });
  localStorage.setItem("notes", JSON.stringify(notes));
};

const addNewNote = (data = {}) => {
  const { title = "", text = "" } = data;

  const note = document.createElement("div");
  note.classList.add("note");
  note.innerHTML = `
  <div class="tools">
    <input class="title" placeholder="Title..." />
    <div>
      <button class="edit"><i class="fas fa-edit"></i></button>
      <button class="delete"><i class="fas fa-trash-alt"></i></button>
    </div>
  </div>

  <div class="main ${text ? "" : "hidden"}"></div>
  <textarea class="${text ? "hidden" : ""}"></textarea>
`;

const titleInput = note.querySelector(".title");

  const editButton = note.querySelector(".edit");
  const deleteButton = note.querySelector(".delete");
  const main = note.querySelector(".main");
  const textArea = note.querySelector("textarea");
  textArea.value = text;
  titleInput.value = title;
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

addButton.addEventListener("click", () => {
  const msg = document.querySelector("h2");
  if (msg) msg.remove();

  addNewNote();
});

if (notes && notes.length > 0) {
  notes.forEach((note) => addNewNote(note));
} else {
  const msg = document.createElement("h2");
  msg.innerText = "No notes yet. Click + to add one.";
  msg.style.color = "#333";
  msg.style.width = "100%";
  msg.style.textAlign = "center";

  document.body.appendChild(msg);
}