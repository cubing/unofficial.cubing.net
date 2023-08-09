import { exit } from "process";
import { formatTime } from "../vendor/timer-db";

export const DNF_VALUE = -1;
export const DNS_VALUE = -2;

const TimeRegex = /(((\d+)\:)?(\d+)\:)?((\d+)(\.(\d{1,3}))?)/;

export class AttemptResultTime {
  constructor(public resultTotalMs: number) {}

  public static fromString(s: string): AttemptResultTime {
    console.log(s, s === -1, s === "-1");
    switch (s) {
      case "-1":
      case "DNF":
        return new AttemptResultTime(DNF_VALUE);
      case "-2":
      case "DNS":
        return new AttemptResultTime(DNS_VALUE);
    }
    if (!s) {
      throw new Error();
    }
    const match = s.match(TimeRegex);
    if (!match) {
      console.error("Invalid time result!", s);
      exit(2);
    }
    const [_1, _2, _3, hrStr, minStr, _4, secStr, _5, decimalsStr] = match;
    const hours = parseInt(hrStr ?? "0");
    const minutes = parseInt(minStr ?? "0");
    const seconds = parseInt(secStr ?? "0");
    const milliseconds = parseInt(decimalsStr) * 10 ** (3 - decimalsStr.length);
    return new AttemptResultTime(
      ((hours * 60 + minutes) * 60 + seconds) * 1000 + milliseconds,
    );
  }

  toString(): string {
    return formatTime(this.resultTotalMs);
  }

  isDNFOrDNS(): boolean {
    return [DNF_VALUE, DNS_VALUE].includes(this.resultTotalMs);
  }

  compare(otherTimeResult: AttemptResultTime): number {
    if (
      Math.sign(this.resultTotalMs) === Math.sign(otherTimeResult.resultTotalMs)
    ) {
      return this.resultTotalMs - otherTimeResult.resultTotalMs;
    }
    return otherTimeResult.isDNFOrDNS() ? -1 : 1;
  }
}
