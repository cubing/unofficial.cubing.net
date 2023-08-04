#!/usr/bin/env bun

import { argv, exit } from "node:process";
import { sharedDOMParser } from "../src/generate/jsdom";
import {
  CompetitionInfo,
  CompetitionRoundInfo,
} from "../src/generate/data/competiton";
import { EventID, events } from "../src/generate/data/events";
import { COMPETITON_SOURCE_DATA_FOLDER } from "../src/generate/processing/folders";

const args = argv.slice(2);
const competitionID = args.splice(0, 1)[0];

const competitionWCAURL = `https://www.worldcubeassociation.org/competitions/${competitionID}`;
const html = sharedDOMParser.parseFromString(
  await (await fetch(competitionWCAURL)).text(),
  "text/html",
);

const fullName = html
  .querySelector("#competition-data h3")
  ?.textContent?.trim();
if (!fullName) {
  console.error(
    `Could not look up the competition name. Please ensure the competition exists on the WCA website: ${competitionWCAURL}`,
  );
  exit(1);
}
console.log(`Found competition at: ${competitionWCAURL}`);
const date =
  // rome-ignore lint/style/noNonNullAssertion: <explanation>
  html
    .querySelector('a[title="Add to calendar"]')!
    .parentElement!.textContent!.trim() +
  " // change this to the format `YYYY-MM-DD`! For a multi-day comp, pick the final day of the competition if unsure on which date the specific event ended.";

const roundsByEvent: Record<EventID, CompetitionRoundInfo[]> = {};
for (const eventID of args) {
  const eventMetadata = events[eventID];
  if (!eventMetadata) {
    throw new Error(`Unknown event: ${eventID}`);
  }
  roundsByEvent[eventID] = [
    {
      roundFormatID: eventMetadata.validRoundFormatIDs[0],
      roundEndDate: date,
    },
  ];
}

const competitionInfo: CompetitionInfo = {
  id: competitionID,
  fullName,
  roundsByEvent,
};

const outputFilePath = (
  await COMPETITON_SOURCE_DATA_FOLDER.getRelative(
    competitionID,
  ).ensureFolderExists()
).getRelative("competition-info.json");
console.log(`Writing: ${outputFilePath}`);
await outputFilePath.writeJSON(competitionInfo);
