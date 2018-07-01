import moment from "moment-timezone";
import { timezone } from "../env.js";

import type { Session } from "../reducers/sessions";

const CONFERENCE_DATES = [1492473600000, 1492560000000];

export function parseTimeToUTC(unix: number): number {
  const offset = moment.tz.zone(timezone).offset(unix);
  const utc = moment.utc(unix);
  const fixed = utc.clone().add(offset, "minutes");
  return fixed.valueOf();
}

function minutesSinceMidnight(): number {
  const now = moment().tz(timezone);
  const dayStart = now.clone().startOf("day");
  return now.diff(dayStart, "minutes");
}

export function currentTimeOnConferenceDay(day: number = 1): number {
  const utc = moment.utc(parseTimeToUTC(CONFERENCE_DATES[day - 1]));
  const mappedTime = utc.clone().add(minutesSinceMidnight(), "minutes");
  return mappedTime.valueOf();
}

export function sessionsHappeningNow(
  now: number,
  sessions: Array<Session> = []
): boolean {
  if (sessions.length) {
    let start, end;
    sessions.map(session => {
      if (!start || start > session.startTime) {
        start = session.startTime;
      }
      if (!end || end < session.endTime) {
        end = session.startTime;
      }
    });
    return now >= start && now <= end;
  } else {
    return false;
  }
}

export function sessionsHappeningToday(now: number): boolean {
  const day1Start = new Date(
    "Tue Apr 18 2017 00:00:00 GMT-0700 (PDT)"
  ).getTime();
  const day2End = new Date("Wed Apr 19 2017 23:59:59 GMT-0700 (PDT)").getTime();
  return now >= day1Start && now <= day2End;
}
