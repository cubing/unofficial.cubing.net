// use sqlx::postgres::PgPoolOptions;
use sqlx::mysql::{MySqlConnectOptions, MySqlPoolOptions};
// etc.

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

    let competition_ids: Vec<String> = sqlx::query_as("SELECT DISTINCT id FROM Competitions")
        .fetch_all(&pool)
        .await?
        .into_iter()
        .map(|tuple: (String,)| tuple.0)
        .collect();

    let mut wtr = csv::Writer::from_writer(io::stdout());

    wtr.write_record(&["rank", "wcaID", "name", "population"])?;

    for competition_id in competition_ids {
        let events: Vec<(String, String)> =
            sqlx::query_as("SELECT DISTINCT eventId FROM Results WHERE competitionId = ?")
                .bind(competition_id)
                .fetch_all(&pool)
                .await?;

        for event in events {
            println!("{}", competition_id);
            let competition_results: Vec<(i64, String, String, String, String, i64, i64, i64, i64, i64, i64, i64)> =
            sqlx::query_as("SELECT pos, personId, personName, roundId, formatId, value1, value2, value3, value4, value5, best, average FROM Results WHERE competitionId = ? AND eventId = ?")
                .bind(competition_id)
                .bind(event)
                .fetch_all(&pool)
                .await?;
            for competition_result in competition_results {
                println!("{:?}", competition_result.0)
            }
        }
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
