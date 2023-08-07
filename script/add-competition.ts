#!/usr/bin/env bun

import { argv, exit } from "node:process";
import { sharedDOMParser } from "../src/generate/jsdom";
import {
  CompetitionInfo,
  CompetitionRoundInfo,
} from "../src/generate/data/competiton";
import { EventID, events } from "../src/generate/data/events";
import { COMPETITON_SOURCE_DATA_FOLDER } from "../src/generate/processing/folders";

const output: any[] = [];
for (const competitionID of [
  "AachenOpen2010",
  "AuroraSummer2009",
  "BelgianOpen2009",
  "BerkeleySpring2010",
  "ChalmersOpen2005",
  "ClermontOpen2008",
  "ClermontOpen2009",
  "CzechOpen2006",
  "DauphineOpen2009",
  "DutchOpen2005",
  "DutchOpen2006",
  "Euro2006",
  "FinnishOpen2007",
  "FinnishOpen2008",
  "FinnishOpen2010",
  "GaleriesLafayetteOpen2010",
  "HelsinkiOpen2007",
  "HelsinkiOpen2008",
  "HelsinkiOpen2009",
  "HoraceMann2005",
  "HoustonOpen2009",
  "KanazawaOpen2008",
  "MinnesotaOpen2008",
  "MunichOpen2010",
  "MurciaOpen2009",
  "ObeiObeiOpen2009",
  "OhioOpen2010",
  "OsakaOpen2008",
  "OsakaOpen2009",
  "PolishOpen2006",
  "SandoOpen2009",
  "SkarupSpring2010",
  "StanfordSpring2010",
  "Svekub2005",
  "Svekub2006",
  "SwedishCubeDay2006",
  "SwedishCubeDay2007",
  "SwedishCubeDay2008",
  "SwedishCubeDay2009",
  "SwedishCubeday2005",
  "SwedishOpen2005",
  "SwedishOpen2006",
  "SwedishOpen2008",
  "TampereOpen2008",
  "TwinCities2009",
  "UKMasters2009",
  "UKOpen2009",
  "UtahFall2009",
  "UtahSummer2010",
  "VasterasOpen2009",
  "Vastervik2008",
  "WC2003",
  "WC2005",
  "WC2009",
]) {
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
  console.error(`Found competition at: ${competitionWCAURL}`);
  const date =
    // rome-ignore lint/style/noNonNullAssertion: <explanation>
    html
      .querySelector('a[title="Add to calendar"]')!
      .parentElement!.textContent!.trim() +
    " // change this to the format `YYYY-MM-DD`! For a multi-day comp, pick the final day of the competition if unsure on which date the specific event ended.";
  const entry = { id: competitionID, name: fullName, date };
  output.push(entry);
  console.error(entry);
}
console.log(JSON.stringify(output, null, " "));
