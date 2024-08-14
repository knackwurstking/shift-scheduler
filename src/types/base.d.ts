/// <reference types="vite-plugin-pwa/client" />

interface Shift {
  /**
   * NOTE: Just a timestamp
   */
  id: number;
  name: string;
  shortName: string;
  visible: boolean;
  color?: string | null;
}
