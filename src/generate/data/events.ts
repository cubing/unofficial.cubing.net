import { RoundFormatID } from "./rounds";

export type EventMetadata = {
  fullName: string;
  team?: boolean;
  cubingIconClass: string;
  cubingIconSkew?: boolean;
};

// TODO: decouple formats from events
export const events: Record<string, EventMetadata> = {
  fto: {
    fullName: "Face-Turning Octahedron (FTO)",
    cubingIconClass: "unofficial-fto",
  },
  magic: {
    fullName: "Magic",
    cubingIconClass: "event-magic",
  },
  "333_team_bld": {
    fullName: "3x3x3 Team Blindfolded",
    team: true,
    cubingIconClass: "event-333bf", // TODO
    cubingIconSkew: true,
  },
  "222_bld": {
    fullName: "222_bld",
    team: false,
    cubingIconClass: "unofficial-222bf",
  },
  "222_oh": {
    fullName: "222_oh",
    team: false,
    cubingIconClass: "event-222",
    cubingIconSkew: true,
  },
  "333_match_the_scramble": {
    fullName: "333_match_the_scramble",
    team: false,
    cubingIconClass: "unofficial-333mts",
  },
  "333_mirror_blocks": {
    fullName: "333_mirror_blocks",
    team: false,
    // cubingIconClass: "333-mirror-blocks", // TODO: https://github.com/cubing/icons/issues/102
    cubingIconClass: "333",
    cubingIconSkew: true, // TODO: https://github.com/cubing/icons/issues/102
  },
  "333_mirror_blocks_bld": {
    fullName: "333_mirror_blocks_bld",
    team: false,
    // cubingIconClass: "333-mirror-blocks", // TODO: https://github.com/cubing/icons/issues/102
    cubingIconClass: "333",
    cubingIconSkew: true,
  },
  "333_no_inspection": {
    fullName: "333_no_inspection",
    team: false,
    cubingIconClass: "event-333",
    cubingIconSkew: true,
  },
  "333_siamese": {
    fullName: "333_siamese",
    team: false,
    cubingIconClass: "event-333",
    cubingIconSkew: true,
  },
  "333_speed_bld": {
    fullName: "333_speed_bld",
    team: false,
    cubingIconClass: "event-333bf",
    cubingIconSkew: true,
  },
  rubiks_360: {
    fullName: "rubiks_360",
    team: false,
    cubingIconClass: "event-333",
    cubingIconSkew: true,
  },
  magic_oh: {
    fullName: "magic_oh",
    team: false,
    cubingIconClass: "event-magic",
    cubingIconSkew: true,
  },
  rainbow_cube: {
    fullName: "rainbow_cube",
    team: false,
    cubingIconClass: "event-skewb",
    cubingIconSkew: true,
  },
  relay_222_333_444: {
    fullName: "relay_222_333_444",
    team: false,
    cubingIconClass: "unofficial-234relay",
  },
  relay_333_333_333: {
    fullName: "relay_333_333_333",
    team: false,
    cubingIconClass: "event-333",
    cubingIconSkew: true,
  },
  skewb: {
    fullName: "skewb",
    team: false,
    cubingIconClass: "event-skewb",
  },
  snake: {
    fullName: "snake",
    team: false,
    cubingIconClass: "event-333",
    cubingIconSkew: true,
  },
  square1_bld: {
    fullName: "square1_bld",
    team: false,
    cubingIconClass: "event-sq1",
    cubingIconSkew: true,
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

export function addIconClasses(elem: HTMLElement, eventID: EventID): void {
  elem.classList.add("cubing-icon");
  elem.classList.add(events[eventID].cubingIconClass);
  if (events[eventID].cubingIconSkew) {
    elem.classList.add("skew");
  }
}
