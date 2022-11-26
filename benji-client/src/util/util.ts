import { parse } from 'tinyduration';

export type Duration = {
  [index: string]: number | undefined;
  years?: number;
  months?: number;
  days?: number;
  hours?: number;
  minutes?: number;
  seconds?: number;
};

export const msToMinSec = (ms: number): string => {
  let hours = Math.floor(ms / 3600000);
  let minutes = Math.floor((ms % 3600000) / 60000);
  let seconds = Number((((ms % 3600000) % 60000) / 1000).toFixed(0));

  if (seconds === 60) {
    minutes++;
    seconds -= 60;
  }

  if (minutes >= 60) {
    minutes -= 60;
    hours += 1;
  }

  return `${hours ? hours + ':' : ''}${
    minutes ? (minutes < 10 ? '0' : '') + minutes : '00'
  }:${seconds ? (seconds < 10 ? '0' : '') + seconds : '00'}`;
};

export const convertISODurationToMS = (isoDuration: string): number => {
  const KeysToMS: Duration = {
    years: 31556952000,
    months: 2629800000,
    days: 86400000,
    hours: 3600000,
    minutes: 60000,
    seconds: 1000,
  };
  let durationMilli = 0;
  const durationObj = parse(isoDuration);

  for (const period in durationObj) {
    const curPeriod = (durationObj as Duration)[period];
    const conversion = KeysToMS[period] || 1;
    if (curPeriod) {
      durationMilli += curPeriod * conversion;
    }
  }
  return durationMilli;
};

export const captalizeName = (name: string): string =>
  name.charAt(0).toUpperCase() + name.slice(1);
