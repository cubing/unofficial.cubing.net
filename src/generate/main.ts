import { RootPage, allCompetitions } from "./processing/all-competitions";

const rootPage = new RootPage();

for (const competition of await allCompetitions()) {
  for await (const competitionEvents of competition.events()) {
    await competitionEvents.writeHTML();
  }
  await competition.writeHTML();
  await rootPage.addCompetition(competition)
}

await rootPage.writeHTML();
