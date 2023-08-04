import { readdir } from "node:fs/promises";
import { rootPageTemplate } from "../template";
import { Competition } from "./competition";
import { sharedDocument } from "../jsdom";
import { Path } from "../path";

export const DIST_SITE_FOLDER =
    Path.fromProjectRootRelative("dist/unofficial.cubing.net");

// *shakes fist at Apple*
function exclude_DSStore(paths: string[]): string[] {
  return paths.filter((folderName) => !folderName.startsWith("."));
}

// TODO: sort by date
export async function allCompetitionIDs (): Promise<string[]> {
  return exclude_DSStore(await readdir("./data/competitions"));
}


export class RootPage {
  outputDocument = rootPageTemplate.apply({})
  competitionListElem = (async () => (await this.outputDocument).getElementById("competition-list")! )()

  async addCompetition(competition: Competition) {
    const tr = (await this.competitionListElem).appendChild(sharedDocument.createElement("tr"));
    const td = tr.appendChild(sharedDocument.createElement("td"));
    const a = td.appendChild(sharedDocument.createElement("a"));
    a.href = `./competitions/${competition.ID}`
    a.textContent = (await competition.info()).fullName
  }

  async writeHTML(): Promise<void> {
    await DIST_SITE_FOLDER.index.writeDOM(await this.outputDocument);
  }
}

