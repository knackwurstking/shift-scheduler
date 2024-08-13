interface DB_Entry {
  year: number;
  month: number;
  date: number;
  shift: DB_Shift | null;
  note: string;
}
