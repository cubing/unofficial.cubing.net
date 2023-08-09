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
    fullName: "2x2x2 Blindfolded",
    team: false,
    cubingIconClass: "unofficial-222bf",
  },
  "222_oh": {
    fullName: "2x2x2 One-Handed",
    team: false,
    cubingIconClass: "event-222",
    cubingIconSkew: true,
  },
  "333_match_the_scramble": {
    fullName: "3x3x3 Match The Scramble",
    team: false,
    cubingIconClass: "unofficial-333mts",
  },
  "333_mirror_blocks": {
    fullName: "3x3x3 Mirror Blocks",
    team: false,
    // cubingIconClass: "333-mirror-blocks", // TODO: https://github.com/cubing/icons/issues/102
    cubingIconClass: "333",
    cubingIconSkew: true, // TODO: https://github.com/cubing/icons/issues/102
  },
  "333_mirror_blocks_bld": {
    fullName: "3x3x3 Mirror Blocks Blindfolded",
    team: false,
    // cubingIconClass: "333-mirror-blocks", // TODO: https://github.com/cubing/icons/issues/102
    cubingIconClass: "333",
    cubingIconSkew: true,
  },
  "333_no_inspection": {
    fullName: "3x3x3 No Inspection",
    team: false,
    cubingIconClass: "event-333",
    cubingIconSkew: true,
  },
  "333_siamese": {
    fullName: "3x3x3 Siamese Cube",
    team: false,
    cubingIconClass: "event-333",
    cubingIconSkew: true,
  },
  "333_speed_bld": {
    fullName: "3x3x3 Speed Blindfolded",
    team: false,
    cubingIconClass: "event-333bf",
    cubingIconSkew: true,
  },
  rubiks_360: {
    fullName: "Rubik's 360",
    team: false,
    cubingIconClass: "event-333",
    cubingIconSkew: true,
  },
  magic_oh: {
    fullName: "Magic One-Handed",
    team: false,
    cubingIconClass: "event-magic",
    cubingIconSkew: true,
  },
  rainbow_cube: {
    fullName: "Rainbow Cube",
    team: false,
    cubingIconClass: "event-skewb",
    cubingIconSkew: true,
  },
  relay_222_333_444: {
    fullName: "Relay — 2x2x2, 3x3x3, 4x4x4",
    team: false,
    cubingIconClass: "unofficial-234relay",
  },
  relay_333_333_333: {
    fullName: "Relay — Three 3x3x3 Cubes",
    team: false,
    cubingIconClass: "event-333",
    cubingIconSkew: true,
  },
  skewb: {
    fullName: "Skewb",
    team: false,
    cubingIconClass: "event-skewb",
  },
  snake: {
    fullName: "Snake",
    team: false,
    cubingIconClass: "event-333",
    cubingIconSkew: true,
  },
  square1_bld: {
    fullName: "Square-1 Blindfolded",
    team: false,
    cubingIconClass: "event-sq1",
    cubingIconSkew: true,
  },
};

export type EventID = keyof typeof events;

export function setCubingIconAttributes(
  elem: HTMLElement,
  eventID: EventID,
): void {
  elem.classList.add("cubing-icon");
  elem.classList.add(events[eventID].cubingIconClass);
  if (events[eventID].cubingIconSkew) {
    elem.classList.add("skew");
  }
  elem.title = events[eventID].fullName;
}
