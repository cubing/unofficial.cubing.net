import { CompetitionInfo } from "../data/competiton";
import { Path } from "../path";
import { CompetitionEvent } from "./event";

const COMPETITON_SOURCE_DATA_FOLDER =
  Path.fromProjectRootRelative("data/competitions");

export class Competition {
  constructor(private competitionID: string) {}

  ID(): string {
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
    for (const [eventID, competitionRoundsByEvent] of Object.entries(info.roundsByEvent)) {
      yield new CompetitionEvent(this, eventID, competitionRoundsByEvent);
    }
  }
}
