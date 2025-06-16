import { loadDB } from "./db.js";

const button_new = document.getElementById("btn-new");
const button_save = document.getElementById("btn-save");
const button_delete = document.getElementById("btn-del");
const input_title = document.getElementById("note-title");
const input_content = document.getElementById("note-content");
const note_list = document.querySelector(".note-list");
const panel2 = document.querySelector(".panel2");

const db = await loadDB();
let currentId = null;

window.addEventListener("beforeunload", () => {
  db.close();
});

button_new.onclick = () => {
  input_title.value = "";
  input_content.value = "";
  button_delete.innerText = "Cancel";
  button_save.innerText = "Create note";

  panel2.classList.add("show");
};

button_delete.onclick = async () => {
  if (currentId !== null) {
    await db.deleteNote(currentId);
    currentId = null;
    await reload_note_list();
  }

  panel2.classList.remove("show");
};

button_save.onclick = async () => {
  const title = input_title.value;
  const content = input_content.value;

  if (currentId !== null) {
    await db.updateNote(currentId, title, content);
    currentId = null;
  } else await db.addNote(title, content);

  await reload_note_list();
  panel2.classList.remove("show");
};

async function reload_note_list() {
  const ul = document.querySelector("ul.note-list");
  const notes = await db.getNotes();

  const elements = notes.map((note) => {
    const root = document.createElement("li");
    const title = document.createElement("h2");
    const dateText = document.createElement("h4");
    const d = note.created;

    title.textContent = note.title;
    dateText.textContent = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

    root.onclick = async () => {
      const n = await db.getNoteById(note.id);
      currentId = note.id;

      input_title.value = n.title;
      input_content.value = n.content;
      button_delete.innerText = "Delete note";
      button_save.innerText = "Update note";

      panel2.classList.add("show");
    };
    root.append(title, dateText, document.createElement("span"));

    return root;
  });

  note_list.replaceChildren(...elements);
}

await reload_note_list();
