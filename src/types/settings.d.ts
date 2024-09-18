interface Settings_BackupV1 {
  settings: SchedulerStore_Settings;
  indexedDB: BackupV1_IndexedDB;
}

interface BackupV1_IndexedDB {
  version: number;
  data: DB_Entry[];
}

interface Settings_BackupV0 {
  settings: SchedulerStore_Settings;
  storage: BackupV0_Storage;
}

interface BackupV0_Storage {
  [key: string]: {
    [key: string]: {
      shift: Shift | null;
      note: string;
    };
  };
}
