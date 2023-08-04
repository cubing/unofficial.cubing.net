import { CompetitionRoundInfo, CompetitionRoundsByEvent } from "../data/competiton";
import { EventID, EventMetadata, events } from "../data/events";
import { roundFormats } from "../data/rounds";
import { Path } from "../path";
import { eventPageTemplate } from "../template";
import { CompetitionRound } from "./round";
import type { Competition } from "./competition";

const DIST_COMPETITIONS_FOLDER =
  Path.fromProjectRootRelative("dist/unofficial.cubing.net/competitions");

export class CompetitionEvent {
  constructor(public competition: Competition, public eventID: EventID, public competitionRoundsByEvent: CompetitionRoundsByEvent) {}

  private get roundInfos(): CompetitionRoundInfo[] {
    return typeof this.competitionRoundsByEvent === "string"
        ? [
            {
              roundFormatID: this.competitionRoundsByEvent,
            },
          ]
        : this.competitionRoundsByEvent;
  }

  async *rounds(): AsyncGenerator<CompetitionRound> {
    for (const roundInfo of this.roundInfos) {
      yield new CompetitionRound(this, this.eventID, roundInfo, 1);
    }
  }

  private get eventMetadata(): EventMetadata {
    return events[this.eventID];
  }

  async outputFilePath(): Promise<Path> {
    return (
      await DIST_COMPETITIONS_FOLDER.getRelative(this.competition.ID())
        .getRelative(this.eventID)
        .ensureFolderExists()
    )
      .getRelative("index.html");
  }

  async writeHTML(): Promise<void> {
    const roundFormat = roundFormats[this.roundInfos[0].roundFormatID]; // TODO: PER ROUND
    const outputDocument = await eventPageTemplate.apply({
      "competition-name": (await this.competition.info()).fullName,
      "event-icon-class": this.eventMetadata.cubingIconClass,
      "event-name": this.eventMetadata.fullName,
      "round-format": roundFormat.description,
      "num-attempts": `num-attempts-${roundFormat.numAttempts}`,
    });


    // for await (const competitionRoundResult of this.rounds()) {} // TODO
    outputDocument
      .querySelector("table.results")
      ?.replaceWith(await (await this.rounds().next()).value!.toHTML());

    (await this.outputFilePath()).writeDOM(outputDocument)
  }
}