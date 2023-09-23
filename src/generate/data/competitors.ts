import { exit } from "node:process";
import { sharedDocument } from "../jsdom";
import { CSVColumns } from "./csv";
import { EventMetadata } from "./events";

const WCAIDRegex = /^\d{4}[A-Z]{4}\d{2}$/;

export class CompetitorIdentity {
  constructor(public name: string, public wcaID?: string) {
    if (wcaID && !wcaID.match(WCAIDRegex)) {
      console.error("Invalid WCA ID:", wcaID);
      exit(1);
    }
  }

  toString(): string {
    return this.name;
  }

  toHTML(): HTMLAnchorElement | Text {
    if (this.wcaID) {
      const a = sharedDocument.createElement("a");
      a.href = `https://www.worldcubeassociation.org/persons/${this.wcaID}`;
      a.textContent = this.toString();
      return a;
    }
    return sharedDocument.createTextNode(this.toString());
  }
}

export class CompetitorOrTeamIdentity {
  competitors: CompetitorIdentity[];
  constructor(csvColumns: CSVColumns, eventMetadata: EventMetadata) {
    if (eventMetadata.team) {
      this.competitors = [
        new CompetitorIdentity(csvColumns.name1, csvColumns.wcaID1),
        new CompetitorIdentity(csvColumns.name2, csvColumns.wcaID2),
      ]; // TODO: more than 2 team members? (Guildford challenge)
    } else {
      this.competitors = [
        new CompetitorIdentity(csvColumns.name, csvColumns.wcaID),
      ];
    }
  }

  //
  toHTML(): DocumentFragment {
    const fragment = sharedDocument.createDocumentFragment();
    fragment.appendChild(this.competitors[0].toHTML());
    for (const competitor of this.competitors.slice(1)) {
      fragment.append(", ");
      fragment.appendChild(competitor.toHTML());
    }
    return fragment;
  }
}
