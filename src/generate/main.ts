import { Competition } from "./processing/competition";
import { RootPage, allCompetitionIDs } from "./processing/all-competitions";

const rootPage = new RootPage();

for (const competitionID of await allCompetitionIDs()) {
  const competition = new Competition(competitionID);
  for await (const competitionEvents of competition.events()) {
    await competitionEvents.writeHTML();
  }
  await competition.writeHTML();
  await rootPage.addCompetition(competition)
}

await rootPage.writeHTML();
