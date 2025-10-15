/// <reference types="vite/client" />

interface SmartPlayerInstance {
  resume?: {
    inResume?: boolean;
  };
  on: (event: string, callback: (data?: any) => void) => void;
  pause: () => void;
  play: () => void;
  options: {
    id: string;
  };
}

interface Window {
  smartplayer?: {
    instances?: SmartPlayerInstance[];
  };
}
