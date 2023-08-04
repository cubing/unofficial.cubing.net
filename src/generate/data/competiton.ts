import { Path } from "../path";
import { EventID } from "./events";
import { RoundFormatID } from "./rounds";

export type CompetitionID = string;

export interface CompetitionRoundInfo {
  roundFormatID: RoundFormatID;
  roundEndDate: string; // YYYY-MM-DD
}

export interface CompetitionInfo {
  id: string;
  fullName: string;
  roundsByEvent: Record<EventID, CompetitionRoundInfo[]>;
}
