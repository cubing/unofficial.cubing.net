import { RoundFormatID } from "./rounds";

export type EventMetadata = {
  fullName: string;
  team?: boolean;
  validRoundFormatIDs: RoundFormatID[]; // The first entry is taken as the default.
  cubingIconClass: string;
};

// TODO: decouple formats from events
export const events: Record<string, EventMetadata> = {
  fto: {
    fullName: "Face-Turning Octahedron (FTO)",
    validRoundFormatIDs: [RoundFormatID.AverageOf5],
    cubingIconClass: "unofficial-fto",
  },
  magic: {
    fullName: "Magic",
    validRoundFormatIDs: [RoundFormatID.AverageOf5],
    cubingIconClass: "event-magic",
  },
  "333_team_bld": {
    fullName: "3x3x3 Team Blindfolded",
    team: true,
    validRoundFormatIDs: [RoundFormatID.BestOf3],
    cubingIconClass: "event-333bf", // TODO
  },
};

export type EventID = keyof typeof events;
