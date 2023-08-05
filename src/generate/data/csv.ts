export interface CSVColumns {
  name: string;
  wcaID?: string;

  // Team events
  name1: string;
  name2: string;
  wcaID1?: string;
  wcaID2?: string;

  rank: string; // TODO: Remove this and sort in code
  average: string;
  best: string;

  attempt1: string;
  attempt2: string;
  attempt3: string;
  attempt4?: string;
  attempt5?: string;
}
