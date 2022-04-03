import { parse } from "tinyduration";

export type Duration = {
  [index: string]: number | undefined;
  years?: number;
  months?: number;
  days?: number;
  hours?: number;
  minutes?: number;
  seconds?: number;
};

export const msToMinSec = (ms: number) => {
  let hours = Math.floor(ms / 3600000);
  let minutes: number = Math.floor((ms % 3600000) / 60000);
  let seconds: number = Number((((ms % 3600000) % 60000) / 1000).toFixed(0));

  if (seconds === 60) {
    minutes++;
    seconds -= 60;
  }

  if (minutes >= 60) {
    minutes -= 60;
    hours += 1;
  }

  return `${hours ? hours + ":" : ""}${
    minutes ? (minutes < 10 ? "0" : "") + minutes : "00"
  }:${seconds ? (seconds < 10 ? "0" : "") + seconds : "00"}`;
};

export const convertISODurationToMS = (isoDuration: string) => {
  const KeysToMS: Duration = {
    years: 31556952000,
    months: 2629800000,
    days: 86400000,
    hours: 3600000,
    minutes: 60000,
    seconds: 1000,
  };
  let durationMilli = 0;
  let durationObj = parse(isoDuration);

  for (let period in durationObj) {
    let curPeriod = (durationObj as Duration)[period];
    let conversion = KeysToMS[period] || 1;
    if (curPeriod) {
      durationMilli += curPeriod * conversion;
    }
  }
  return durationMilli;
};

export const captalizeName = (name: string) =>
  name.charAt(0).toUpperCase() + name.slice(1);
