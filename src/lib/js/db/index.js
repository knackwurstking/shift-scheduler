export const currentVersion = 1;
export const db = indexedDB.open("db", currentVersion);

// TODO: custom shifts and notes per day (primary key (date): "YYYY-MM-DD")

db.onupgradeneeded = (ev) => {
    switch (ev.oldVersion) {
        case 0:
            const result = db.result;
            if (!result.objectStoreNames.contains("data")) {
                result.createObjectStore("data", { keyPath: "date" });
            }
    }
}

db.onerror = () => {
    console.error("DB Error:", db.error);
}

db.onsuccess = () => {
    // TODO: working with db object
}
