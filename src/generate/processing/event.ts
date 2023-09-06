import { EventID, EventMetadata, events } from "../data/events";
import { roundFormats } from "../data/rounds";
import { Path } from "../path";
import { eventPageTemplate } from "../template";
import { CompetitionRound } from "./round";
import type { Competition } from "./competition";
import { CompetitionRoundInfo } from "../data/competiton";

export class CompetitionEvent {
  constructor(
    public competition: Competition,
    public eventID: EventID,
    public competitionRoundsByEvent: CompetitionRoundInfo[],
  ) {}

  async *rounds(): AsyncGenerator<CompetitionRound> {
    for (const roundInfo of this.competitionRoundsByEvent) {
      yield new CompetitionRound(this, this.eventID, roundInfo, 1);
    }
  }

  private get eventMetadata(): EventMetadata {
    return events[this.eventID];
  }

  async outputFolderPath(): Promise<Path> {
    return (await this.competition.outputFolderPath())
      .getRelative(this.eventID)
      .ensureFolderExists();
  }

  async writeHTML(): Promise<void> {
    if (this.competitionRoundsByEvent[1]) {
      console.error("TODO: Multiple rounds not supported yet.");
      // exit(1);
    }
    const roundFormat =
      roundFormats[this.competitionRoundsByEvent[0].roundFormatID]; // TODO: PER ROUND
    const outputDocument = await eventPageTemplate.apply({
      "competition-name": (await this.competition.info()).fullName,
      "event-icon-class": this.eventMetadata.cubingIconClass,
      "event-icon-skew": this.eventMetadata.cubingIconSkew ? "skew" : null,
      "event-name": this.eventMetadata.fullName,
      "round-format": roundFormat.description,
      "num-attempts": `num-attempts-${roundFormat.numAttempts}`,
    });

    // for await (const competitionRoundResult of this.rounds()) {} // TODO
    outputDocument
      .querySelector("table.results")
      // biome-ignore lint/style/noNonNullAssertion: <explanation>
      ?.replaceWith(await (await this.rounds().next()).value!.toHTML());

    (await this.outputFolderPath()).index.writeDOM(outputDocument);
  }
}
