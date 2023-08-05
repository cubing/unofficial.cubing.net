<img src="./src/static/img/icon_320w.png" width="160" alt="Project icon — a tilted 3x3x3 icon">

# Unofficial Cubing

Results from unofficial events at [WCA]([Title](https://www.worldcubeassociation.org/)) competitions.

## Contributing

Do you have results from a competition that is not listed?

Each round is stored as a flat `.csv` file like this:

```
rank,wcaID,name,average,best,attempt1,attempt2,attempt3,attempt4,attempt5
1,2014PAST01,Dan Pastushkov,18.50,15.70,18.88,15.70,18.39,19.15,18.22
2,2017BRYA06,Aedan Bryant,21.83,18.81,26.02,21.55,24.57,18.81,19.36
3,2016JERO01,Charles Jerome,22.79,19.21,22.05,1:02.55,21.47,19.21,24.86
…
```

The rounds for a competition are stored in JSON files like [this](https://github.com/cubing/unofficial.cubing.net/blob/9dd479776e5cf6fd24f91ec9da83c070819bba46/data/competitions/CubingUSANationals2023/competition-info.json).

Feel free to send a pull request or [file an issue](https://github.com/cubing/unofficial.cubing.net/issues) with data that can be converted into this format.

## Project maintenance

### Accepting contributions

1. If the data is not in pull request format, create a pull request matching the format of other competitions.
2. If you or the contributor were not directly involved in organizing the relevant competition results, verify with someone who was.
3. Ensure there is a `competition-info.json` file and a `.csv` file corresponding to each described round.
4. Check that CI is passing. For example, you can see that `make build` was able o generate all the competitions [here](https://github.com/cubing/unofficial.cubing.net/actions/runs/5767948616/job/15638362770).
5. Approve the pull request, merge it, and ask Lucas to deploy (until we can [deploy from CI](https://github.com/cubing/unofficial.cubing.net/issues/7)).

### Adding a competition using the commandline

If you have `bun` installed, you can add a competition using:

```shell
bun install
bun run script/add-competition.ts -- SomeCompetition2023 fto magic
```

Then add the appropriate CSV files and push to a branch using `git` to make a pull request.
