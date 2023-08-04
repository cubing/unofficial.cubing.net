import { Path } from "../path";
import { EventID } from "./events";
import { RoundFormatID } from "./rounds";

export type CompetitionID = string;

export interface CompetitionRoundInfo {
  roundFormatID: RoundFormatID;
}

export type CompetitionRoundsByEvent = RoundFormatID | CompetitionRoundInfo[];

export interface CompetitionInfo {
  id: string;
  fullName: string;
  roundsByEvent: Record<EventID, CompetitionRoundsByEvent>;
}
