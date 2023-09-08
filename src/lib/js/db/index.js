export const currentVersion = 1;
export const db = indexedDB.open("data", currentVersion);

// TODO: custom shifts and notes per day (primary key (date): "YYYY-MM-DD")