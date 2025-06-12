const button_new = document.getElementById("btn-new");
const button_save = document.getElementById("btn-save");
const button_delete = document.getElementById("btn-del");
const input_title = document.getElementById("note-title");
const input_content = document.getElementById("note-content");
const panel2 = document.querySelector(".panel2");

button_new.onclick = () => {
  input_title.value = "";
  input_content.value = "";

  panel2.classList.add("show");
};

button_delete.onclick = () => {
  // TODO: recognise which note is going to be deleted
  console.log("deleted or discarded note");

  panel2.classList.remove("show");
};

button_save.onclick = () => {
  // TODO: recognise if note is going to be created or updated
  const title = input_title.value;
  const content = input_content.value;
  console.log(`Created or updated note ("${title}", "${content}")`);

  panel2.classList.remove("show");
};

function update_listeners_li() {
  const lis = document.querySelectorAll("li");

  for (const el of lis) {
    el.onclick = () => {
      // TODO: recognise which note is clicked (id?)
      console.log("note clicked");

      input_title.value = "Sample title";
      input_content.value = "Sample content";

      panel2.classList.add("show");
    };
  }
}

update_listeners_li();
