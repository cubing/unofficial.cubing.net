import { readFile } from "fs/promises";
import { CompetitionInfo } from "./data/competiton";
import { Path } from "./path";
import { CompetitionRoundResults, RoundSpecifier } from "./data/rounds";

const COMPETITON_DATA_FOLDER =
  Path.fromProjectRootRelative("data/competitions");

export class Competition {
  constructor(private competitionID: string) {}

  ID(): string {
    return this.competitionID;
  }

  async dataFolder(): Promise<Path> {
    return COMPETITON_DATA_FOLDER.getRelative(this.competitionID);
  }

  async info(): Promise<CompetitionInfo> {
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
  }

  async *rounds(): AsyncGenerator<RoundSpecifier> {
    const info = await this.info();
    for (const [eventID, eventInfo] of Object.entries(info.eventInfo)) {
      if (typeof eventInfo === "string") {
        yield {
          competitionID: this.competitionID,
          eventID: eventInfo,
          roundNumber: 1,
        };
      }
    }
    yield "hi";
  }
}
