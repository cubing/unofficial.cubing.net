import { exit } from "node:process";

const WCAIDRegex = /\d{4}(A-Z){4}\d{2}/;

export class CompetitorInfo {
  constructor(public name: string, public wcaID?: string) {
    if (wcaID && !wcaID.match(WCAIDRegex)) {
      console.error("Invalid WCA ID:", wcaID);
      exit(1);
    }
  }

  toHTML(doc: Document): HTMLAnchorElement | Text {
    if (this.wcaID) {
      const a = doc.createElement("a");
      a.href = `https://www.worldcubeassociation.org/persons/${this.wcaID}`;
      return a;
    }
    return doc.createTextNode(this.name);
  }
}
