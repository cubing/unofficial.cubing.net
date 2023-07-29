// @ts-ignore
import { parse } from "csv-parse/browser/esm/sync";
import { readFile, writeFile } from "fs/promises";
import { RoundResults } from "./attempt";
import { JSDOM } from "jsdom";

const fileNames = process.argv.slice(2);

export interface CSVColumn {
  rank: string;
  name: string;
  wcaID?: string;
  avg5?: string;
  mo3?: string;
  bo3?: string;
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

  const roundResults = new RoundResults(parsed);
  const dom = new JSDOM("<!DOCTYPE html>");
  const outputFileName = `${fileName}.html`;
  console.log("Writing:", outputFileName);
  writeFile(outputFileName, roundResults.toHTML(dom.window.document).outerHTML);
}
