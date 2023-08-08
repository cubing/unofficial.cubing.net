use async_std::fs::create_dir_all;
use serde::{Deserialize, Serialize};
use std::{
    collections::HashMap,
    fmt::Display,
    io::{BufWriter, Write},
};

use sqlx::mysql::{MySqlConnectOptions, MySqlPoolOptions};

#[async_std::main]
// or #[tokio::main]
// or #[actix_web::main]
async fn main() -> Result<(), sqlx::Error> {
    let opts = MySqlConnectOptions::new()
        .host("127.0.0.1")
        .username("unofficial")
        .password("unofficial")
        .database("xb2535_db1");
    // Create a connection pool
    //  for MySQL, use MySqlPoolOptions::new()
    //  for SQLite, use SqlitePoolOptions::new()
    //  etc.
    let pool = MySqlPoolOptions::new()
        .max_connections(5)
        .connect_with(opts)
        .await?;

    let event_id_map_file = std::fs::File::open("src/rust/from_ron/event_ids.json").unwrap();
    let event_id_map: HashMap<String, EventIDInfo> =
        serde_json::from_reader(event_id_map_file).unwrap();

    let competition_info_sources_file =
        std::fs::File::open("src/rust/from_ron/comps.json").unwrap();
    let competition_info_sources: HashMap<String, CompetitionInfoSource> =
        serde_json::from_reader(competition_info_sources_file).unwrap();

    // println!("{:?}", event_id_map);

    let competition_ids: Vec<String> = sqlx::query_as("SELECT DISTINCT id FROM Competitions")
        .fetch_all(&pool)
        .await?
        .into_iter()
        .map(|tuple: (String,)| tuple.0)
        .collect();

    for competition_id in &competition_ids {
        let old_event_ids: Vec<String> =
            sqlx::query_as("SELECT DISTINCT eventId FROM Results WHERE competitionId = ?")
                .bind(competition_id)
                .fetch_all(&pool)
                .await?
                .into_iter()
                .map(|tuple: (String,)| tuple.0)
                .collect();

        // print!("{:?}", competition_info_sources);
        println!("{:?}", competition_id);

        let mut competition_info = CompetitionInfo {
            id: competition_id.to_owned(),
            full_name: competition_info_sources
                .get(competition_id)
                .unwrap()
                .name
                .to_owned(), // TODO,
            rounds_by_event: HashMap::new(),
        };

        let competition_folder = format!("data/competitions/{}", competition_id);

        for old_event_id in &old_event_ids {
            let event_id_info = match event_id_map.get(old_event_id) {
                Some(event_id_info) => event_id_info,
                None => continue,
            };
            let event_id = &event_id_info.id;

            let mut competition_event_info: Vec<CompetitionRoundInfo> = vec![];

            let round_datas: Vec<(String, String)> = sqlx::query_as(
                "SELECT DISTINCT roundId, formatId FROM Results WHERE competitionId = ? AND eventId = ?",
            )
            .bind(competition_id)
            .bind(old_event_id)
            .fetch_all(&pool)
            .await?;

            let mut round_index = 0;
            for round_data in &round_datas {
                let round_format_id: RoundFormat = match round_data.1.as_str() {
                    "a" => RoundFormat::AverageOf5,
                    "m" => RoundFormat::MeanOf3,
                    "1" => RoundFormat::BestOf1,
                    "2" => RoundFormat::BestOf2,
                    "3" => RoundFormat::BestOf3,
                    _ => panic!("Unknown round format"),
                };

                round_index += 1;
                create_dir_all(format!("{}/round-results", competition_folder)).await?;
                let file = std::fs::File::create(format!(
                    "{}/round-results/{}-round{}.csv",
                    competition_folder, event_id, round_index
                ))?;
                let mut wtr = csv::Writer::from_writer(file);
                wtr.write_record([
                    "rank", "wcaID", "name", "attempt1", "attempt2", "attempt3", "attempt4",
                    "attempt5", "best", "average",
                ])
                .unwrap(); // TODO

                let round_results: Vec<(i64, String, String, i64, i64, i64, i64, i64, i64, i64)> =
                sqlx::query_as("SELECT pos, personId, personName, value1, value2, value3, value4, value5, best, average FROM Results WHERE competitionId = ? AND eventId = ? AND roundId = ?")
                    .bind(competition_id)
                    .bind(old_event_id)
                    .bind(&round_data.0)
                    .fetch_all(&pool)
                    .await?;
                for round_result in round_results {
                    wtr.write_record([
                        round_result.0.to_string(),
                        round_result.1,
                        round_result.2,
                        round_result.3.to_string(),
                        round_result.4.to_string(),
                        round_result.5.to_string(),
                        round_result.6.to_string(),
                        round_result.7.to_string(),
                        round_result.8.to_string(),
                        round_result.9.to_string(),
                    ])
                    .unwrap(); // TODO
                }

                wtr.flush()?;
                let competition_round_info = CompetitionRoundInfo {
                    round_format_i_d: round_format_id.to_string(),
                    round_end_date: "2001-01-01".to_owned(), // TODO
                };
                competition_event_info.push(competition_round_info);
            }
            competition_info
                .rounds_by_event
                .insert(event_id.to_owned(), competition_event_info);
        }
        if competition_info.rounds_by_event.is_empty() {
            println!("Empty: {}", competition_id);
            continue;
        }
        let mut writer = BufWriter::new(std::fs::File::create(format!(
            "{}/competition-info.json",
            competition_folder
        ))?);
        serde_json::to_writer(&mut writer, &competition_info).unwrap();
        writer.flush().unwrap();
    }

    Ok(())
}

// #[derive(Debug, ormx::Table)]
// #[ormx(table = "users", id = user_id, insertable)]
// struct Result {
//     // map this field to the column "id"
//     #[ormx(column = "id")]
//     // generate `User::get_by_user_id(u32) -> Result<Self>`
//     #[ormx(get_one = get_by_user_id(u32))]
//     // this column is database-generated.
//     #[ormx(default)]
//     user_id: u32,
//     first_name: String,
//     last_name: String,
//     // generate `User::by_email(&str) -> Result<Option<Self>>`
//     #[ormx(get_optional(&str))]
//     email: String,
//     disabled: Option<String>,
//     // don't include this field into `InsertUser` since it has a default value
//     // generate `User::set_last_login(Option<NaiveDateTime>) -> Result<()>`
//     #[ormx(default, set)]
//     last_login: Option<NaiveDateTime>,
// }

#[derive(Serialize, Deserialize, Debug)]
#[serde(rename_all = "camelCase")]
struct EventIDInfo {
    id: String,
    long_name: String,
}

#[derive(Serialize, Deserialize, Debug)]
#[serde(rename_all = "camelCase")]
struct CompetitionRoundInfo {
    round_format_i_d: String,
    round_end_date: String,
}

#[derive(Serialize, Deserialize, Debug)]
#[serde(rename_all = "camelCase")]
struct CompetitionInfo {
    id: String,
    full_name: String,
    rounds_by_event: HashMap<String, Vec<CompetitionRoundInfo>>,
}

#[derive(Serialize, Deserialize, Debug)]
#[serde(rename_all = "camelCase")]
struct CompetitionInfoSource {
    name: String,
    date: String,
}

#[derive(Serialize, Deserialize, Debug)]
#[serde(rename_all = "camelCase")]
enum RoundFormat {
    AverageOf5,
    MeanOf3,
    BestOf1,
    BestOf2,
    BestOf3,
}

impl Display for RoundFormat {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        write!(
            f,
            "{}",
            match self {
                RoundFormat::AverageOf5 => "avg5",
                RoundFormat::MeanOf3 => "mo3",
                RoundFormat::BestOf1 => "bo1",
                RoundFormat::BestOf2 => "bo2",
                RoundFormat::BestOf3 => "bo3",
            }
        )
    }
}

#[derive(Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
struct RoundInfo {
    round_format_id: RoundFormat,
    round_end_date: String,
}

// {
//     "id": "CubingUSANationals2023",
//     "fullName": "CubingUSA Nationals 2023",
//     "roundsByEvent": {
//       "fto": [
//         {
//           "roundFormatID": "avg5",
//           "roundEndDate": "2023-08-12"
//         }
//       ],
//       "333_team_bld": [
//         {
//           "roundFormatID": "bo3",
//           "roundEndDate": "2023-08-12"
//         }
//       ],
//       "magic": [
//         {
//           "roundFormatID": "avg5",
//           "roundEndDate": "2023-08-14"
//         }
//       ]
//     }
//   }
