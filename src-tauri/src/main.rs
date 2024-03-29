#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]
use std::path::PathBuf;
use std::process::Command;
use tauri::{
    CustomMenuItem, Manager, SystemTray, SystemTrayEvent, SystemTrayMenu, SystemTrayMenuItem,
};
use tokio::{sync::mpsc, time::Instant};

#[tauri::command]
async fn execute_game(app: tauri::AppHandle, path: String) -> String {
    let path_buf = PathBuf::from(path);
    let (tx, mut rx) = mpsc::channel(1);

    let child = Command::new(&path_buf)
        .current_dir(path_buf.parent().unwrap())
        .spawn()
        .expect("Failed to execute");
    let start = Instant::now();

    let _ = tokio::spawn(async move {
        match child.wait_with_output() {
            Ok(_) => tx.send(start.elapsed().as_secs()).await.expect("Error"),
            Err(e) => eprintln!("Error executing the task"),
        }
    });

    format!("{:.0?}", rx.recv().await.unwrap()).to_string()
}

fn main() {
    let quit = CustomMenuItem::new("quit".to_string(), "Quit");
    let hide = CustomMenuItem::new("hide".to_string(), "Hide");

    let tray_menu = SystemTrayMenu::new()
        .add_item(hide)
        .add_native_item(SystemTrayMenuItem::Separator)
        .add_item(quit);
    let system_tray = SystemTray::new().with_menu(tray_menu);

    tauri::Builder::default()
        .system_tray(system_tray)
        .on_system_tray_event(|app, event| match event {
            SystemTrayEvent::LeftClick {
                position: _,
                size: _,
                ..
            } => {
                let window = app.get_window("main").unwrap();
                window.show().unwrap();
            }
            SystemTrayEvent::MenuItemClick { id, .. } => match id.as_str() {
                "quit" => {
                    std::process::exit(0);
                }
                "hide" => {
                    let window = app.get_window("main").unwrap();
                    window.hide().unwrap();
                }
                _ => {}
            },
            _ => {}
        })
        .invoke_handler(tauri::generate_handler![execute_game])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
