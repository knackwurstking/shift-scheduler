/// <reference types="vite-plugin-pwa/client" />

interface DB_Shift {
  /**
   * NOTE: Just a timestamp
   */
  id: number;
  name: string;
  shortName: string;
  visible: boolean;
  color?: string | null;
}
