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

    for competition_id in competition_ids {
        println!("{}", competition_id);
        let competition_results: Vec<(String, String)> =
            sqlx::query_as("SELECT personId, personName FROM Results WHERE competitionId = ?")
                .bind(competition_id)
                .fetch_all(&pool)
                .await?;
        for competition_result in competition_results {
            println!("{:?}", competition_result)
        }
    }

    Ok(())
}
