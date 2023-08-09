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
  "222_bld": {
    fullName: "222_bld",
    team: false,
    validRoundFormatIDs: [RoundFormatID.MeanOf3],
    cubingIconClass: "unofficial-pyramorphix",
  },
  "222_oh": {
    fullName: "222_oh",
    team: false,
    validRoundFormatIDs: [RoundFormatID.MeanOf3],
    cubingIconClass: "unofficial-pyramorphix",
  },
  "333_match_the_scramble": {
    fullName: "333_match_the_scramble",
    team: false,
    validRoundFormatIDs: [RoundFormatID.MeanOf3],
    cubingIconClass: "unofficial-pyramorphix",
  },
  "333_mirror_blocks": {
    fullName: "333_mirror_blocks",
    team: false,
    validRoundFormatIDs: [RoundFormatID.MeanOf3],
    cubingIconClass: "unofficial-pyramorphix",
  },
  "333_mirror_blocks_bld": {
    fullName: "333_mirror_blocks_bld",
    team: false,
    validRoundFormatIDs: [RoundFormatID.MeanOf3],
    cubingIconClass: "unofficial-pyramorphix",
  },
  "333_no_inspection": {
    fullName: "333_no_inspection",
    team: false,
    validRoundFormatIDs: [RoundFormatID.MeanOf3],
    cubingIconClass: "unofficial-pyramorphix",
  },
  "333_siamese": {
    fullName: "333_siamese",
    team: false,
    validRoundFormatIDs: [RoundFormatID.MeanOf3],
    cubingIconClass: "unofficial-pyramorphix",
  },
  "333_speed_bld": {
    fullName: "333_speed_bld",
    team: false,
    validRoundFormatIDs: [RoundFormatID.MeanOf3],
    cubingIconClass: "unofficial-pyramorphix",
  },
  // "333_team_bld": {fullName: "333_team_bld", team: false, validRoundFormatIDs: [RoundFormatID.MeanOf3], cubingIconClass: "unofficial-pyramorphix"},
  "360": {
    fullName: "360",
    team: false,
    validRoundFormatIDs: [RoundFormatID.MeanOf3],
    cubingIconClass: "unofficial-pyramorphix",
  },
  // "fto": {fullName: "fto", team: false, validRoundFormatIDs: [RoundFormatID.MeanOf3], cubingIconClass: "unofficial-pyramorphix"},
  // "magic": {fullName: "magic", team: false, validRoundFormatIDs: [RoundFormatID.MeanOf3], cubingIconClass: "unofficial-pyramorphix"},
  magic_oh: {
    fullName: "magic_oh",
    team: false,
    validRoundFormatIDs: [RoundFormatID.MeanOf3],
    cubingIconClass: "unofficial-pyramorphix",
  },
  rainbow_cube: {
    fullName: "rainbow_cube",
    team: false,
    validRoundFormatIDs: [RoundFormatID.MeanOf3],
    cubingIconClass: "unofficial-pyramorphix",
  },
  relay_222_333_444: {
    fullName: "relay_222_333_444",
    team: false,
    validRoundFormatIDs: [RoundFormatID.MeanOf3],
    cubingIconClass: "unofficial-pyramorphix",
  },
  relay_333_333_333: {
    fullName: "relay_333_333_333",
    team: false,
    validRoundFormatIDs: [RoundFormatID.MeanOf3],
    cubingIconClass: "unofficial-pyramorphix",
  },
  skewb: {
    fullName: "skewb",
    team: false,
    validRoundFormatIDs: [RoundFormatID.MeanOf3],
    cubingIconClass: "unofficial-pyramorphix",
  },
  snake: {
    fullName: "snake",
    team: false,
    validRoundFormatIDs: [RoundFormatID.MeanOf3],
    cubingIconClass: "unofficial-pyramorphix",
  },
  square1_bld: {
    fullName: "square1_bld",
    team: false,
    validRoundFormatIDs: [RoundFormatID.MeanOf3],
    cubingIconClass: "unofficial-pyramorphix",
  },
};

export type EventID = keyof typeof events;

// "longName": "Relay — 2x2x2, 3x3x3, 4x4x4"
// "longName": "Rubik's 360"
// "longName": "6x6x6 Cube"
// "longName": "7x7x7 Cube"
// "longName": "Rainbow Cube"
// "longName": "Skewb"
// "longName": "3x3x3 Siamese Cube"
// "longName": "Snake"
// "longName": "3x3x3 Mirror Blocks"
// "longName": "3x3x3 No inspection"
// "longName": "Relay — Three 3x3x3 Cubes"
// "longName": "3x3x3 Speed Blindfolded"
// "longName": "3x3x3 Match the Scramble"
// "longName": "2x2x2 One-Handed"
// "longName": "Magic One-Handed"
// "longName": "2x2x2 Blindfolded"
// "longName": "Square-1 Blindfolded"
// "longName": "3x3x3 Mirror Blocks Blindfolded"
