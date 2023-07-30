// @ts-ignore
import { parse } from "csv-parse/browser/esm/sync";
import { mkdir, readFile, writeFile } from "fs/promises";
import { FormatID, RoundResults, formatInfos } from "./attempt";
import { JSDOM } from "jsdom";
import { join } from "path";
import { listFiles } from "./vendor/barely-a-dev-server";
import { exit } from "process";

export type EventMetadata = { team?: boolean; formatID: FormatID };

// TODO: decouple formats from events
const events: Record<string, EventMetadata> = {
  fto: { formatID: FormatID.AverageOf5 },
  magic: { formatID: FormatID.AverageOf5 },
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

const fileNames = await listFiles(
  "./",
  (path) => path.endsWith(".csv"),
  "./competitions",
);

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
  // const outputFileName = `${fileName}.html`;
  // console.log("Writing:", outputFileName);
  // writeFile(outputFileName, roundResults.toHTML(dom.window.document).outerHTML);

  const outputHTMLFolder = fileName.split(".").slice(0, -1).join(".");
  // mkdir(outputHTMLFolder, {recursive: true});
  const outputHTMLFileName = join(outputHTMLFolder, "index.html");
  const domParser = new dom.window.DOMParser();
  const existingIndex = domParser.parseFromString(
    await readFile(outputHTMLFileName, "utf-8"),
    "text/html",
  );
  existingIndex
    .querySelector("table.results")
    ?.replaceWith(roundResults.toHTML(dom.window.document));
  // rome-ignore lint/style/noNonNullAssertion: <explanation>
  existingIndex.querySelector("#round-format")!.textContent =
    formatInfos[eventMetadata.formatID].description;
  const xmlSerializer = new dom.window.XMLSerializer();
  writeFile(outputHTMLFileName, xmlSerializer.serializeToString(existingIndex));
}
