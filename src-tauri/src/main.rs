#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]
use polars::prelude::*;

#[tauri::command]
fn get_columns(file_name: String) -> Vec<String> {
    let df = LazyCsvReader::new(file_name)
        .has_header(true)
        .finish()
        .unwrap();

    return df.first().collect().unwrap().get_column_names_owned();
}

#[tauri::command]
fn get_data_for_chart(
    file_name: String,
    y_axis: String,
    x_axis: String,
    group_by: Option<String>,
) -> String {
    let lazy_df = LazyCsvReader::new(file_name)
        .has_header(true)
        .finish()
        .unwrap()
        .drop_nulls(None)
        .unique(Some(vec![x_axis.clone()]), UniqueKeepStrategy::First);

    let mut df: DataFrame;

    if let Some(group_by) = group_by {
        let unique_rows_df = lazy_df
            .clone()
            .select([col(&group_by)])
            .unique(None, UniqueKeepStrategy::First)
            .collect()
            .unwrap();

        let groups = &unique_rows_df[group_by.as_str()]
            .utf8()
            .unwrap()
            .into_iter()
            .map(|x| x.unwrap().to_string())
            .collect::<Vec<String>>();

        df = lazy_df
            .clone()
            .select([col(&x_axis).alias("x_axis")])
            .collect()
            .unwrap();

        for group in groups {
            let group_df = lazy_df
                .clone()
                .filter(col(&group_by).eq(lit(group.as_str())))
                .select([col(&x_axis).alias("x_axis"), col(&y_axis).alias(group)])
                .collect()
                .unwrap();
            df = df.left_join(&group_df, ["x_axis"], ["x_axis"]).unwrap();
        }
    } else {
        df = lazy_df
            .select([col(&x_axis).alias("x_axis"), col(&y_axis).alias("y_axis")])
            .collect()
            .unwrap();
    }

    return serde_json::to_string(&df).unwrap();
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![get_data_for_chart, get_columns])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
