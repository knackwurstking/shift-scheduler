/// <reference types="svelte" />
/// <reference types="vite/client" />

interface _DBDataValue {
  shift: _Shift | null;
  note: string;
}

interface _DBData {
  [date: string]: DBDataValue;
}

interface _Shift {
  id: number;
  name: string;
  shortName: string;
  visible: boolean;
  color?: string;
}

interface _Day {
  date: Date;
  data: _DBDataValue;
}

interface _DayDialogSubmit {
  date: {
    year: number;
    month: number;
    date: number;
  },
  shift: Shift | null;
  note: string;
}

// TODO: "lang" types here ...
