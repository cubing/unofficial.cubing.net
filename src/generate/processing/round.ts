import { exit } from "node:process";
import { AttemptResultTime } from "../data/attempts";
import { CompetitionRoundInfo } from "../data/competiton";
import { CompetitorInfo } from "../data/competitors";
import { EventID, EventMetadata, events } from "../data/events";
import { RoundFormatInfo, roundFormats } from "../data/rounds";
import { sharedDocument } from "../jsdom";
import { CSVColumn } from "../data/csv";
import { CompetitionEvent } from "./event";

class CompetitorRoundResult {
  constructor(
    public roundFormatInfo: RoundFormatInfo,
    public rank: number,
    public competitorInfo: CompetitorInfo,
    public averageResult: AttemptResultTime | undefined,
    public bestResult: AttemptResultTime,
    public attempts: AttemptResultTime[],
  ) {}

  toHTML(doc: Document): HTMLTableRowElement {
    const tr = doc.createElement("tr");
    tr.appendChild(doc.createElement("td")).textContent = this.rank.toString();
    tr.appendChild(doc.createElement("td")).appendChild(
      this.competitorInfo.toHTML(doc),
    );
    if (this.roundFormatInfo.rankedByBest) {
      tr.appendChild(doc.createElement("td")).textContent =
        this.bestResult.toString();
      tr.appendChild(doc.createElement("td")).textContent =
        // rome-ignore lint/style/noNonNullAssertion: TODO: make invalid states unrepresentable
        this.averageResult!.toString();
    } else {
      tr.appendChild(doc.createElement("td")).textContent =
        // rome-ignore lint/style/noNonNullAssertion: TODO: make invalid states unrepresentable
        this.averageResult!.toString();
      tr.appendChild(doc.createElement("td")).textContent =
        this.bestResult.toString();
    }

    const idx = new Array(this.roundFormatInfo.numAttempts)
      .fill(0)
      .map((_, i) => i);
    idx.sort((i, j) => this.attempts[i].compare(this.attempts[j]));
    const bestIdx = idx[0];
    const worstIdx = idx.at(-1);

    for (let i = 0; i < this.attempts.length; i++) {
      const td = tr.appendChild(doc.createElement("td"));
      let s = this.attempts[i].toString();
      if (this.roundFormatInfo.rankedByBest) {
        if (![bestIdx].includes(i)) {
          s = `(${s})`;
          td.classList.add("not-counted-in-average");
        }
      } else if ([bestIdx, worstIdx].includes(i)) {
        s = `(${s})`;
        td.classList.add("not-counted-in-average");
      }
      td.textContent = s;
    }
    return tr;
  }
}

export class CompetitionRound {
  constructor(
    public competitionEvent: CompetitionEvent,
    public eventID: EventID,
    public roundInfo: CompetitionRoundInfo,
    public roundNumber: number,
  ) {}

  async getCSV(): Promise<CSVColumn[]> {
    return (await this.competitionEvent.competition.dataFolder())
      .getRelative("round-results")
      .getRelative(`${this.eventID}-round${this.roundNumber}.csv`)
      .readCSV();
  }

  private get roundFormatInfo(): RoundFormatInfo {
    return roundFormats[this.roundInfo.roundFormatID]; // TODO: cache?
  }

  private get eventMetadata(): EventMetadata {
    return events[this.eventID]; // TODO: cache?
  }

  async results(): Promise<CompetitorRoundResult[]> {
    const data = await this.getCSV();
    if (data.length === 0) {
      console.error("Error: Round with 0 results!");
      exit(1);
    }

    const competitorRoundResults: CompetitorRoundResult[] = [];
    for (const row of data) {
      const {name} = row;

      const attempts: AttemptResultTime[] = [];
      for (let i = 1; i <= this.roundFormatInfo.numAttempts; i++) {
        const attemptStr = row[`attempt${i}`];
        if (!attemptStr) {
          console.error(`Attempt #${i} missing for competitor: ${row.name}`);
          exit(3);
        }
        attempts.push(AttemptResultTime.fromString(attemptStr));
      }

      try {
        const averageResult = AttemptResultTime.fromString(row.average);
        const competitorRoundResult: CompetitorRoundResult =
          new CompetitorRoundResult(
            this.roundFormatInfo,
            parseInt(row.rank),
            new CompetitorInfo(name, row.wcaID),
            averageResult,
            AttemptResultTime.fromString(row.best),
            attempts,
          );
        competitorRoundResults.push(competitorRoundResult);

      } catch (e) {
        console.error("Invalid attempt", this.competitionEvent.competition.ID, this.competitionEvent.eventID, this.roundNumber, name)
      }
    }
    return competitorRoundResults;
  }

  private theadHTML(doc: Document): HTMLTableRowElement {
    const tr = doc.createElement("tr");
    tr.appendChild(doc.createElement("td")).textContent = "Rank";
    tr.appendChild(doc.createElement("td")).textContent = `Competitor${
      this.eventMetadata.team ? "s" : ""
    }`;
    if (!this.roundFormatInfo.rankedByBest) {
      tr.appendChild(doc.createElement("td")).textContent =
        this.roundFormatInfo.averageName;
    }
    tr.appendChild(doc.createElement("td")).textContent = "Best";
    if (this.roundFormatInfo.rankedByBest) {
      tr.appendChild(doc.createElement("td")).textContent =
        this.roundFormatInfo.averageName;
    }
    const attempts = tr.appendChild(doc.createElement("td"));
    attempts.textContent = "Attempts";
    attempts.colSpan = this.roundFormatInfo.numAttempts;
    return tr;
  }

  public async toHTML(): Promise<HTMLTableElement> {
    const table = sharedDocument.createElement("table");
    table.classList.add("results");
    table.classList.add(`num-attempts-${this.roundFormatInfo.numAttempts}`);
    if (this.roundFormatInfo.rankedByBest) {
      table.classList.add("ranked-by-best");
    }

    const thead = table.appendChild(sharedDocument.createElement("thead"));
    thead.appendChild(this.theadHTML(sharedDocument));

    const tbody = table.appendChild(sharedDocument.createElement("tbody"));
    for (const competitorRoundResult of await this.results()) {
      tbody.appendChild(competitorRoundResult.toHTML(sharedDocument));
    }
    return table;
  }
}
