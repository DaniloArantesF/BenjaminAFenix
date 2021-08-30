
export interface Command {
  id: number,
  value: string;
  description: string;
  priviledged: boolean;
  aliases?: Array<string>;
  execute: (...args: any[]) => void;
}

export interface Track {
  title: string;
  author: string;
  duration: number;
  url: string;
  user: string;         // user who requested track
}