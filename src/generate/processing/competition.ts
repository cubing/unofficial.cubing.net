import {
  compareEndDates,
  type CompetitionInfo,
  type EndDate,
} from "../data/competiton";
import { events } from "../data/events";
import { sharedDocument } from "../jsdom";
import { Path } from "../path";
import { competitionPageTemplate } from "../template";
import { CompetitionEvent } from "./event";
import {
  COMPETITON_SOURCE_DATA_FOLDER,
  DIST_COMPETITIONS_FOLDER,
} from "./folders";

export class Competition {
  constructor(private competitionID: string) {}

  get ID(): string {
    return this.competitionID;
  }

  async dataFolder(): Promise<Path> {
    return COMPETITON_SOURCE_DATA_FOLDER.getRelative(this.competitionID);
  }

  infoCached: Promise<CompetitionInfo> | undefined;
  async info(): Promise<CompetitionInfo> {
    // rome-ignore lint/suspicious/noAssignInExpressions: Caching pattern
    return (this.infoCached ??= (async () => {
      const competitionInfo: CompetitionInfo = await (
        await this.dataFolder()
      )
        .getRelative("competition-info.json")
        .readJSON();
      if (competitionInfo.id !== this.competitionID) {
        throw new Error(
          `Invalid competition ID. Expected \`${this.competitionID}\`, found \`${competitionInfo.id}\``,
        );
      }
      return competitionInfo;
    })());
  }

  async *events(): AsyncGenerator<CompetitionEvent> {
    const info = await this.info();
    for (const [eventID, competitionRoundsByEvent] of Object.entries(
      info.roundsByEvent,
    )) {
      yield new CompetitionEvent(this, eventID, competitionRoundsByEvent);
    }
  }

  wcaURL(): string {
    return `https://www.worldcubeassociation.org/competitions/${this.ID}`; // TODO: validate competition ID to avoid injection risk.
  }

  async outputFolderPath(): Promise<Path> {
    return await DIST_COMPETITIONS_FOLDER.getRelative(this.ID);
  }

  async writeHTML(): Promise<void> {
    const outputDocument = await competitionPageTemplate.apply({
      "competition-name": (await this.info()).fullName,
      "competition-wca-url": this.wcaURL(),
    });

    // for await (const competitionRoundResult of this.rounds()) {} // TODO
    const eventListElem = outputDocument.querySelector("#event-list")!;

    // Note: `in`!
    for (const eventID in (await this.info()).roundsByEvent) {
      const div = eventListElem.appendChild(
        sharedDocument.createElement("div"),
      );

      const eventMetadata = events[eventID];

      const iconElement = div.appendChild(sharedDocument.createElement("span"));
      iconElement.classList.add("cubing-icon");
      iconElement.classList.add(eventMetadata.cubingIconClass);

      div.append(" ");

      const linkElement = div.appendChild(sharedDocument.createElement("a"));
      linkElement.href = "./" + eventID + "/";
      linkElement.textContent = eventMetadata.fullName;
    }

    (await this.outputFolderPath()).index.writeDOM(outputDocument);
  }

  // TODO: use the full competition end date? (Note that the last unofficial event end date may be in a different year than the competition year/competition end date. I'm not sure which one is more intuitive to sort by.)
  async latestDate(): Promise<EndDate> {
    let latestRoundEndDate: string | undefined;
    for (const event of Object.values((await this.info()).roundsByEvent)) {
      for (const round of event) {
        if (
          !latestRoundEndDate ||
          compareEndDates(round.roundEndDate, latestRoundEndDate) > 0
        ) {
          latestRoundEndDate = round.roundEndDate;
        }
      }
    }
    if (!latestRoundEndDate) {
      throw new Error("No rounds? " + this.competitionID);
    }
    return latestRoundEndDate;
  }
}
