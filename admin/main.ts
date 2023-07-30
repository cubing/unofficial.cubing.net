// @ts-ignore
import { parse } from "csv-parse/browser/esm/sync";
import { readFile, writeFile } from "fs/promises";
import { FormatID, RoundResults } from "./attempt";
import { JSDOM } from "jsdom";

const fileNames = process.argv.slice(2);

export type EventMetadata = { team?: boolean; formatID: FormatID };

// TODO: decouple formats from events
const events: Record<string, EventMetadata> = {
  fto: { formatID: FormatID.AverageOf5 },
  "333-team-bld": {
    team: true,
    formatID: FormatID.BestOf3,
  },
};

type Event = keyof typeof events;

export interface CSVColumn {
  rank: string;
  name: string;
  wcaID?: string;
  average: string;
  best: string;
  attempt1: string;
  attempt2: string;
  attempt3: string;
  attempt4?: string;
  attempt5?: string;
}

for (const fileName of fileNames) {
  const data = await readFile(fileName, "utf-8");
  const parsed: CSVColumn[] = parse(data, {
    columns: true,
  });

  console.log(fileName.split(".")[0]);
  // rome-ignore lint/style/noNonNullAssertion: TODO
  const eventFromFilename: Event = fileName.split("/").at(-1)?.split(".")[0]!; // TODO
  const eventMetadata: EventMetadata = events[eventFromFilename];
  const roundResults = new RoundResults(parsed, eventMetadata);
  const dom = new JSDOM("<!DOCTYPE html>");
  const outputFileName = `${fileName}.html`;
  console.log("Writing:", outputFileName);
  writeFile(outputFileName, roundResults.toHTML(dom.window.document).outerHTML);
}
