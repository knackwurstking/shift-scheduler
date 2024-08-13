// TODO: Backup types here... (Settings_*)

interface Settings_BackupV1 {
  settings: SchedulerStore_Settings;
  indexedDB: {
    version: number;
    data: DB_Entry[];
  };
}

interface Settings_BackupV0 {
  settings: SchedulerStore_Settings;
  storage: {
    [key: string]: {
      [key: string]: {
        shift: Shift | null;
        note: string;
      };
    };
  };
}
