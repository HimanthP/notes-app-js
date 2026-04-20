// redeploy trigger
const addButton = document.getElementById("add");
const savedNotes = JSON.parse(localStorage.getItem("notes")) || [];


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
  });
});


const updateLocalStorage = () => {
  const noteElements = document.querySelectorAll(".note");

  const notes = [];

  noteElements.forEach((noteEl) => {
    const title = noteEl.querySelector(".title").value;
    const text = noteEl.querySelector("textarea").value;

    notes.push({
      title,
      text,
      pinned: noteEl.classList.contains("pinned"),
      createdAt: new Date().toISOString(),
    });
  });

  localStorage.setItem("notes", JSON.stringify(notes));
};


const addNewNote = (data = {}) => {
  const { title = "", text = "", pinned = false } = data;

  const note = document.createElement("div");
  note.classList.add("note");

  if (pinned) note.classList.add("pinned");

  note.innerHTML = `
    <div class="tools">
      <input class="title" placeholder="Title..." />
      <div>
        <button class="pin"><i class="fas fa-thumbtack"></i></button>
        <button class="edit"><i class="fas fa-edit"></i></button>
        <button class="delete"><i class="fas fa-trash-alt"></i></button>
      </div>
    </div>

    <div class="main ${text ? "" : "hidden"}"></div>
    <textarea class="${text ? "hidden" : ""}"></textarea>
  `;

  const titleInput = note.querySelector(".title");
  const textArea = note.querySelector("textarea");
  const main = note.querySelector(".main");

  const editButton = note.querySelector(".edit");
  const deleteButton = note.querySelector(".delete");
  const pinButton = note.querySelector(".pin");

  titleInput.value = title;
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
    main.innerHTML = marked(e.target.value);
    updateLocalStorage();
  });

  titleInput.addEventListener("input", updateLocalStorage);


  pinButton.addEventListener("click", () => {
    note.classList.toggle("pinned");
    document.body.prepend(note);
    updateLocalStorage();
  });


  if (pinned) {
    document.body.prepend(note);
  } else {
    document.body.appendChild(note);
  }
};


addButton.addEventListener("click", () => {
  const msg = document.querySelector("h2");
  if (msg) msg.remove();

  addNewNote();
});


if (savedNotes.length > 0) {
  savedNotes.forEach((note) => addNewNote(note));
} else {
  const msg = document.createElement("h2");
  msg.innerText = "No notes yet. Click + to add one.";
  msg.style.textAlign = "center";
  document.body.appendChild(msg);
}