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

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![get_columns])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
