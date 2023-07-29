import { exit } from "process";
import { CSVColumn } from "./main";
import { formatTime } from "./vendor/timer-db";

export const DNF_VALUE = -1;
export const DNS_VALUE = -2;

const WCAIDRegex = /\d{4}(A-Z){4}\d{2}/;
const TimeRegex = /(((\d+)\:)?(\d+)\:)?((\d+)(\.(\d{1,3}))?)/;

export class TimeResult {
  constructor(public resultTotalMs: number) {}

  public static fromString(s: string): TimeResult {
    switch (s) {
      case "-1":
      case "DNF":
        return new TimeResult(DNF_VALUE);
      case "-2":
      case "DNS":
        return new TimeResult(DNS_VALUE);
    }
    const match = s.match(TimeRegex);
    if (!match) {
      console.error("Invalid time result!", s);
      exit(2);
    }
    const [_1, _2, _3, hrStr, minStr, _4, secStr, _5, decimalsStr] = match;
    const hours = parseInt(hrStr ?? "0");
    const minutes = parseInt(minStr ?? "0");
    const seconds = parseInt(secStr ?? "0");
    const milliseconds = parseInt(decimalsStr) * 10 ** (3 - decimalsStr.length);
    return new TimeResult(
      ((hours * 60 + minutes) * 60 + seconds) * 1000 + milliseconds,
    );
  }

  toString(): string {
    return formatTime(this.resultTotalMs);
  }

  isDNFOrDNS(): boolean {
    return [DNF_VALUE, DNS_VALUE].includes(this.resultTotalMs);
  }

  compare(otherTimeResult: TimeResult): number {
    if (
      Math.sign(this.resultTotalMs) === Math.sign(otherTimeResult.resultTotalMs)
    ) {
      return this.resultTotalMs - otherTimeResult.resultTotalMs;
    }
    return otherTimeResult.isDNFOrDNS() ? -1 : 1;
  }
}

export enum FormatID {
  AverageOf5 = "avg5",
  MeanOf3 = "mo3",
  BestOf3 = "bo3",
}

const formats: FormatID[] = [
  FormatID.AverageOf5,
  FormatID.MeanOf3,
  FormatID.BestOf3,
];
const formatInfo: Record<
  FormatID,
  { numAttempts: number; theadName: string; rankedByBest: boolean }
> = {
  [FormatID.AverageOf5]: {
    numAttempts: 5,
    theadName: "Average",
    rankedByBest: false,
  },
  [FormatID.MeanOf3]: {
    numAttempts: 3,
    theadName: "Mean",
    rankedByBest: false,
  },
  [FormatID.BestOf3]: {
    numAttempts: 3,
    theadName: "Best",
    rankedByBest: true,
  },
};

class CompetitorInfo {
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

class CompetitorRoundResult {
  constructor(
    public rank: number,
    public competitorInfo: CompetitorInfo,
    public averageResult: TimeResult | undefined,
    public bestResult: TimeResult,
    public attempts: TimeResult[],
  ) {}

  toHTML(doc: Document, formatID: FormatID): HTMLTableRowElement {
    const tr = doc.createElement("tr");
    tr.appendChild(doc.createElement("td")).textContent = this.rank.toString();
    tr.appendChild(doc.createElement("td")).appendChild(
      this.competitorInfo.toHTML(doc),
    );
    if (!formatInfo[formatID].rankedByBest) {
      tr.appendChild(doc.createElement("td")).textContent =
        // rome-ignore lint/style/noNonNullAssertion: TODO: make invalid states unrepresentable
        this.averageResult!.toString();
    }
    tr.appendChild(doc.createElement("td")).textContent =
      this.bestResult.toString();

    const idx = new Array(formatInfo[formatID].numAttempts)
      .fill(0)
      .map((_, i) => i);
    idx.sort((i, j) => this.attempts[i].compare(this.attempts[j]));
    const bestIdx = idx[0];
    const worstIdx = idx.at(-1);

    for (let i = 0; i < this.attempts.length; i++) {
      let s = this.attempts[i].toString();
      if ([bestIdx, worstIdx].includes(i)) {
        s = `(${s})`;
      }
      tr.appendChild(doc.createElement("td")).textContent = s;
    }
    return tr;
  }
}

export class RoundResults {
  formatID: FormatID;
  competitorRoundResults: CompetitorRoundResult[] = [];
  constructor(data: CSVColumn[]) {
    if (data.length === 0) {
      console.error("Error: Round with 0 results!");
      exit(1);
    }

    for (const format of formats) {
      if (format in data[0]) {
        this.formatID = format;
      }
    }
    if (!this.formatID) {
      console.error("Error: Round did not have a valid format!");
      exit(1);
    }

    for (const row of data) {
      const attempts: TimeResult[] = [];
      for (let i = 1; i <= formatInfo[this.formatID].numAttempts; i++) {
        const attemptStr = row[`attempt${i}`];
        if (!attemptStr) {
          console.error(`Attempt #${i} missing for competitor: ${row.name}`);
          exit(3);
        }
        attempts.push(TimeResult.fromString(attemptStr));
      }

      let averageResult: TimeResult | undefined;
      if (!formatInfo[this.formatID].rankedByBest) {
        // rome-ignore lint/suspicious/noExplicitAny: TODO
        averageResult = TimeResult.fromString(row[this.formatID as any]);
      }

      const competitorRoundResult: CompetitorRoundResult =
        new CompetitorRoundResult(
          parseInt(row.rank),
          new CompetitorInfo(row.name, row.wcaID),
          averageResult,
          TimeResult.fromString(row.best),
          attempts,
        );
      this.competitorRoundResults.push(competitorRoundResult);
    }
  }

  theadHTML(doc: Document): HTMLTableRowElement {
    const tr = doc.createElement("tr");
    tr.appendChild(doc.createElement("td")).textContent = "Rank";
    tr.appendChild(doc.createElement("td")).textContent = "Competitor";
    if (!formatInfo[this.formatID].rankedByBest) {
      tr.appendChild(doc.createElement("td")).textContent =
        formatInfo[this.formatID].theadName;
    }
    tr.appendChild(doc.createElement("td")).textContent = "Best";
    const attempts = tr.appendChild(doc.createElement("td"));
    attempts.textContent = "Attempts";
    attempts.colSpan = formatInfo[this.formatID].numAttempts;
    return tr;
  }

  toHTML(doc: Document): HTMLTableElement {
    const table = doc.createElement("table");
    table.classList.add("results");
    table.classList.add(this.formatID);

    const thead = table.appendChild(doc.createElement("thead"));
    thead.appendChild(this.theadHTML(doc));

    const tbody = table.appendChild(doc.createElement("tbody"));
    for (const competitorRoundResult of this.competitorRoundResults) {
      tbody.appendChild(competitorRoundResult.toHTML(doc, this.formatID));
    }
    return table;
  }
}
