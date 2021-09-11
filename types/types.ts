import { BaseSyntheticEvent } from "react";

export interface Command {
  aliases?: Array<string>;
  description: string;
  execute: (...args: any[]) => void;
  id: number,
  priviledged: boolean;
  value: string;
}

export enum Services {
  Youtube,
  Spotify,
  SoundCloud,
}

export interface Track {
  author: string;
  duration: number;
  title: string;
  id: string;
  user: string;         // user who requested track
  service: Services;
}

export type InputHandler = (event: BaseSyntheticEvent) => Promise<number> | void;