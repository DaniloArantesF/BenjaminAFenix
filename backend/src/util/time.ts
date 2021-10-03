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
  const durationObj = parse(isoDuration);

  for (const period in durationObj) {
    if (!period) continue;
    const curPeriod = (durationObj as Duration)[period];
    const conversion = KeysToMS[period] || 1;
    if (curPeriod) {
      durationMilli += curPeriod * conversion;
    }
  }
  return durationMilli;
};