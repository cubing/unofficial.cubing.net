import { readdir } from "node:fs/promises";
import { rootPageTemplate } from "../template";
import { Competition } from "./competition";
import { sharedDocument } from "../jsdom";
import { Path } from "../path";
import { compareEndDates } from "../data/competiton";
import { DIST_SITE_FOLDER } from "./folders";
import { events } from "../data/events";

// *shakes fist at Apple*
function exclude_DSStore(paths: string[]): string[] {
  return paths.filter((folderName) => !folderName.startsWith("."));
}

interface ValueWithComparable<T, U> {
  value: T;
  comparable: U;
}

// Does not modify `inputValues`.
async function asyncSortBy<T, U>(
  inputList: Array<T>,
  valueToComparable: (t: T) => Promise<U>,
  comparisonFn: (u1: U, u2: U) => number,
): Promise<T[]> {
  const withComparables: ValueWithComparable<T, U>[] = await Promise.all(
    inputList.map(async (value) => {
      return { value, comparable: await valueToComparable(value) };
    }),
  );
  function internalComparisonFn(
    a: ValueWithComparable<T, U>,
    b: ValueWithComparable<T, U>,
  ) {
    return comparisonFn(a.comparable, b.comparable);
  }
  withComparables.sort(internalComparisonFn);
  return withComparables.map(
    (valueWithComparable) => valueWithComparable.value,
  );
}

// Sorted by end date (oldest first)
export async function allCompetitions(): Promise<Competition[]> {
  const competitionIDs = exclude_DSStore(await readdir("./data/competitions"));
  const competitions = competitionIDs.map(
    (competitionID) => new Competition(competitionID),
  );

  return asyncSortBy(
    competitions,
    (competition) => competition.latestDate(),
    compareEndDates,
  );
}

export class RootPage {
  outputDocument = rootPageTemplate.apply({});
  competitionListElem = (async () =>
    // rome-ignore lint/style/noNonNullAssertion: <explanation>
    (await this.outputDocument).getElementById("competition-list")!)();

  async addCompetition(competition: Competition) {
    const tr = (await this.competitionListElem).appendChild(
      sharedDocument.createElement("tr"),
    );
    const td = tr.appendChild(sharedDocument.createElement("td"));
    const a = td.appendChild(sharedDocument.createElement("a"));
    a.href = `./competitions/${competition.ID}`;
    a.textContent = (await competition.info()).fullName;

    td.appendChild(sharedDocument.createElement("span")).classList.add(
      "spacer",
    );

    for (const eventID in (await competition.info()).roundsByEvent) {
      const eventLink = td.appendChild(sharedDocument.createElement("a"));
      eventLink.href = `./competitions/${competition.ID}/${eventID}/`;
      const eventSpan = eventLink.appendChild(
        sharedDocument.createElement("span"),
      );
      eventSpan.classList.add("cubing-icon");
      eventSpan.classList.add(events[eventID].cubingIconClass);
    }
  }

  async writeHTML(): Promise<void> {
    await DIST_SITE_FOLDER.index.writeDOM(await this.outputDocument);
  }
}
