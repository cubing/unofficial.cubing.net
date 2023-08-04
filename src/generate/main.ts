import { readdir } from "node:fs/promises";
import { Competition } from "./processing/competition";

// *shakes fist at Apple*
function exclude_DSStore(paths: string[]): string[] {
  return paths.filter((folderName) => !folderName.startsWith("."));
}

const competitionIDs = exclude_DSStore(await readdir("./data/competitions"));

for (const competitionID of competitionIDs) {
  const competition = new Competition(competitionID);
  for await (const competitionEvents of competition.events()) {
    await competitionEvents.writeHTML();
  }
}
