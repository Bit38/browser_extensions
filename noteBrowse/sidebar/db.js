class DBIndexed {
  #db;

  constructor(db) {
    this.#db = db;
  }

  // TODO: merge into load()
  static _open() {
    return new Promise((resolve, reject) => {
      const dbReq = window.indexedDB.open("noteBrowse_notes", 1);
      dbReq.onerror = (err) => {
        console.dir(err);
        reject("Failed to open a db");
      };

      dbReq.onsuccess = (ev) => {
        resolve(ev.target.result);
      };

      dbReq.onupgradeneeded = (ev) => {
        const db = ev.target.result;
        db.onerror = (ev) => {
          reject("Failed to open db");
        };

        const notes = db.createObjectStore("notes", {
          keyPath: "id",
          autoIncrement: true,
        });

        notes.createIndex("title", "title", { unique: false });
        notes.createIndex("content", "content", { unique: false });
        notes.createIndex("created", "created", { unique: false });
      };
    });
  }

  // Loads db
  static async load() {
    const db = await DBIndexed._open();

    return new DBIndexed(db);
  }

  getNotes() {
    const os = this.#db.transaction(["notes"], "readonly").objectStore("notes");

    return new Promise((resolve, reject) => {
      const dbReq = os.getAll();
      dbReq.onsuccess = (ev) => {
        resolve(dbReq.result);
      };
      dbReq.onerror = (ev) => {
        reject(ev.error);
      };
    });
  }

  getNoteById(id) {
    const os = this.#db.transaction(["notes"], "readonly").objectStore("notes");

    return new Promise((resolve, reject) => {
      const dbReq = os.get(IDBKeyRange.only(id));
      dbReq.onsuccess = (ev) => {
        resolve(dbReq.result);
      };
      dbReq.onerror = (ev) => {
        reject(ev.error);
      };
    });
  }

  addNote(title, content) {
    const os = this.#db
      .transaction(["notes"], "readwrite")
      .objectStore("notes");

    const dbReq = os.put({
      title: title,
      content: content,
      created: new Date(),
    });

    return new Promise((resolve, reject) => {
      dbReq.onsuccess = () => {
        resolve();
      };

      dbReq.onerror = (ev) => {
        reject(ev.error);
      };
    });
  }

  updateNote(id, title, content) {
    const os = this.#db
      .transaction(["notes"], "readwrite")
      .objectStore("notes");

    const dbReq = os.put({
      id: id,
      title: title,
      content: content,
      created: new Date(),
    });

    return new Promise((resolve, reject) => {
      dbReq.onsuccess = () => {
        resolve();
      };

      dbReq.onerror = (ev) => {
        reject(ev.error);
      };
    });
  }

  deleteNote(id) {
    const os = this.#db
      .transaction(["notes"], "readwrite")
      .objectStore("notes");

    const dbReq = os.delete(id);

    return new Promise((resolve, reject) => {
      dbReq.onsuccess = () => {
        resolve();
      };

      dbReq.onerror = (ev) => {
        reject(ev.error);
      };
    });
  }

  close() {
    this.#db.close();
  }
}

export async function loadDB() {
  const loadedDB = await DBIndexed.load();
  return loadedDB;
}
