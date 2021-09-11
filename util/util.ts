import { parse } from 'tinyduration';

export type Duration = {
  [index: string]: number | undefined,
  years?: number,
  months?: number,
  days?: number,
  hours?: number,
  minutes?: number,
  seconds?: number,
}

export const msToMinSec = (ms: number) => {
  const minutes: number = Math.floor(ms / 60000);
  const seconds: number = Number(((ms % 60000) / 1000).toFixed(0));
  return seconds === 60
    ? minutes + 1 + ':00'
    : minutes + ':' + (seconds < 10 ? '0' : '') + seconds;
};

export const convertISODurationToMS = (isoDuration: string) => {
  const KeysToMS: Duration = {
    "years": 31556952000,
    "months": 2629800000,
    "days": 86400000,
    "hours": 3600000,
    "minutes": 60000,
    "seconds": 1000,
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
