#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]
use polars::prelude::*;

#[tauri::command]
fn get_columns(file_name: String) -> Vec<String> {
    let df = get_frame_for_file(&file_name);
    return df.first().collect().unwrap().get_column_names_owned();
}

#[tauri::command]
fn get_groups(file_name: String, column: String) -> Vec<String> {
    let lazy_df = get_frame_for_file(&file_name);
    return get_unique_rows_of_column(&lazy_df, &column);
}

#[tauri::command]
fn get_data_for_chart(
    file_name: String,
    y_axis: String,
    x_axis: String,
    group_by: Option<String>,
) -> String {
    let lazy_df = get_frame_for_file(&file_name);

    let mut df: DataFrame;

    if let Some(group_by) = group_by {
        let groups = get_unique_rows_of_column(&lazy_df, &group_by)[0..10].to_vec();

        df = lazy_df
            .clone()
            .select([col(&x_axis).alias("x_axis")])
            .unique(Some(vec!["x_axis".to_string()]), UniqueKeepStrategy::First)
            .sort(
                "x_axis",
                SortOptions {
                    descending: false,
                    nulls_last: true,
                    multithreaded: true,
                },
            )
            .collect()
            .unwrap()
            .drop_nulls(Some(&["x_axis".to_string()]))
            .unwrap();

        for group in groups {
            let group_df = lazy_df
                .clone()
                .filter(col(&group_by).eq(lit(group.as_str())))
                .select([col(&x_axis).alias("x_axis"), col(&y_axis).alias(&group)])
                .unique(Some(vec!["x_axis".to_string()]), UniqueKeepStrategy::First)
                .collect()
                .unwrap();
            df = df.left_join(&group_df, ["x_axis"], ["x_axis"]).unwrap();
        }
    } else {
        df = lazy_df
            .select([col(&x_axis).alias("x_axis"), col(&y_axis)])
            .unique(Some(vec!["x_axis".into()]), UniqueKeepStrategy::First)
            .collect()
            .unwrap()
            .drop_nulls(Some(&["x_axis".into()]))
            .unwrap();
    }

    return serde_json::to_string_pretty(&df).unwrap();
}

fn get_unique_rows_of_column(lazy_df: &LazyFrame, column: &String) -> Vec<String> {
    let unique_rows_df = lazy_df
        .clone()
        .select([col(column)])
        .unique(None, UniqueKeepStrategy::First)
        .collect()
        .unwrap();

    return unique_rows_df[column.as_str()]
        .utf8()
        .unwrap()
        .into_iter()
        .map(|x| x.unwrap().to_string())
        .collect::<Vec<String>>();
}

fn get_frame_for_file(file_name: &String) -> LazyFrame {
    return LazyCsvReader::new(file_name)
        .has_header(true)
        .finish()
        .unwrap();
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            get_data_for_chart,
            get_columns,
            get_groups
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
