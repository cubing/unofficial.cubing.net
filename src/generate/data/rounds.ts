export enum RoundFormatID {
  AverageOf5 = "avg5",
  BestOf1 = "bo1",
  BestOf2 = "bo2",
  BestOf3 = "bo3",
  MeanOf3 = "mo3",
}

export interface RoundFormatInfo {
  id: RoundFormatID;
  numAttempts: number;
  averageName: string;
  rankedByBest: boolean;
  description: string;
}

export const roundFormats: Record<RoundFormatID, RoundFormatInfo> = {
  [RoundFormatID.AverageOf5]: {
    id: RoundFormatID.AverageOf5,
    numAttempts: 5,
    averageName: "Average",
    rankedByBest: false,
    description: "Average of 5",
  },
  [RoundFormatID.BestOf1]: {
    id: RoundFormatID.BestOf1,
    numAttempts: 1,
    averageName: "Best", // TODO
    rankedByBest: true,
    description: "Best of 1",
  },
  [RoundFormatID.BestOf2]: {
    id: RoundFormatID.BestOf2,
    numAttempts: 2,
    averageName: "Mean", // TODO
    rankedByBest: true,
    description: "Best of 2",
  },
  [RoundFormatID.BestOf3]: {
    id: RoundFormatID.BestOf3,
    numAttempts: 3,
    averageName: "Mean",
    rankedByBest: true,
    description: "Best of 3",
  },
  [RoundFormatID.MeanOf3]: {
    id: RoundFormatID.MeanOf3,
    numAttempts: 3,
    averageName: "Mean",
    rankedByBest: false,
    description: "Mean of 3",
  },
};
