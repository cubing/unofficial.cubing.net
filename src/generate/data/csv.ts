export interface CSVColumn {
  name: string;
  wcaID?: string;

  rank: string; // TODO: Remove this and sort in code
  average: string;
  best: string;

  attempt1: string;
  attempt2: string;
  attempt3: string;
  attempt4?: string;
  attempt5?: string;
}
