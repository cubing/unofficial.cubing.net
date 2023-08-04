export enum RoundFormatID {
  AverageOf5 = "avg5",
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
