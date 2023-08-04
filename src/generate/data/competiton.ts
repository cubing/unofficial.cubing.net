import { Path } from "../path";
import { EventID } from "./events";
import { RoundFormatID } from "./rounds";

export type CompetitionID = string;
export type EndDate = string; // YYYY-MM-DD — Round end date or competition end date

export interface CompetitionRoundInfo {
  roundFormatID: RoundFormatID;
  roundEndDate: EndDate;
}

export interface CompetitionInfo {
  id: string;
  fullName: string;
  roundsByEvent: Record<EventID, CompetitionRoundInfo[]>;
}

export function compareEndDates(a: EndDate, b: EndDate): number {
  return a.localeCompare(b);
}
