
export interface Command {
  aliases?: Array<string>;
  description: string;
  execute: (...args: any[]) => void;
  id: number,
  priviledged: boolean;
  value: string;
}

export interface Track {
  author: string;
  duration: number;
  title: string;
  url: string;
  user: string;         // user who requested track
}