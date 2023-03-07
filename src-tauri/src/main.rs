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
fn get_rows(file_name: String, column: String) -> Vec<String> {
    let lazy_df = get_frame_for_file(&file_name);
    return get_unique_rows_of_column(&lazy_df, &column);
}

#[tauri::command]
fn get_data_for_chart(
    file_name: String,
    y_axis: String,
    x_axis: String,
    group_by: Option<String>,
    offset: Option<i64>,
    range: Option<u32>,
) -> String {
    let lazy_df = get_frame_for_file(&file_name);
    let mut df: DataFrame = get_x_axis_frame(&lazy_df, &x_axis, offset, range);

    if let Some(group_by) = group_by {
        let groups = get_unique_rows_of_column(&lazy_df, &group_by);

        for group in groups.iter().take(10) {
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
        let col_df = lazy_df
            .clone()
            .select([col(&x_axis).alias("x_axis"), col(&y_axis).alias("y_axis")])
            .unique(Some(vec!["x_axis".to_string()]), UniqueKeepStrategy::First)
            .collect()
            .unwrap();
        df = df.left_join(&col_df, ["x_axis"], ["x_axis"]).unwrap();
    }

    return serde_json::to_string_pretty(&df).unwrap();
}

#[tauri::command]
fn get_data_for_table(
    file_name: String,
    x_axis: String,
    y_axis: Option<String>,
    group_by: Option<String>,
    offset: Option<i64>,
    range: Option<u32>,
) -> String {
    let lazy_df = get_frame_for_file(&file_name);
    let mut df: DataFrame = get_x_axis_frame(&lazy_df, &x_axis, offset, range);

    if let (Some(group_by), Some(y_axis)) = (group_by, y_axis) {
        let groups = get_unique_rows_of_column(&lazy_df, &group_by);

        for group in groups.iter().take(10) {
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
        for column in get_columns(file_name) {
            if column == x_axis {
                continue;
            }
            let col_df = lazy_df
                .clone()
                .select([col(&x_axis).alias("x_axis"), col(&column)])
                .unique(Some(vec!["x_axis".to_string()]), UniqueKeepStrategy::First)
                .collect()
                .unwrap();
            df = df.left_join(&col_df, ["x_axis"], ["x_axis"]).unwrap();
        }
    }

    df.rename("x_axis", &x_axis).unwrap();

    return serde_json::to_string_pretty(&df).unwrap();
}

fn get_unique_rows_of_column(lazy_df: &LazyFrame, column: &String) -> Vec<String> {
    let unique_rows_df = lazy_df
        .clone()
        .select([col(column)])
        .sort(
            column,
            SortOptions {
                descending: false,
                nulls_last: true,
                multithreaded: true,
            },
        )
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

fn get_x_axis_frame(
    lazy_df: &LazyFrame,
    x_axis: &String,
    offset: Option<i64>,
    len: Option<u32>,
) -> DataFrame {
    let mut df = lazy_df
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
        .drop_nulls(Some(vec![col("x_axis")]));
    if let (Some(offset), Some(len)) = (offset, len) {
        df = df.slice(offset, len);
    }
    return df.collect().unwrap();
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            get_data_for_chart,
            get_columns,
            get_rows,
            get_data_for_table
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
