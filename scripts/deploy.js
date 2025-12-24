/**
 * 部署腳本：將前端打包結果複製到後端 static 目錄
 */
import { existsSync, rmSync, cpSync } from "fs";
import { resolve } from "path";

// 來源：前端打包輸出目錄
const SOURCE_DIR = resolve("dist");

// 目標：後端 static 目錄
const TARGET_DIR = "C:/Intellij/cloud_admin/src/main/resources/static";

console.log("🚀 開始部署前端...");
console.log(`📁 來源: ${SOURCE_DIR}`);
console.log(`📁 目標: ${TARGET_DIR}`);

// 1. 檢查來源目錄是否存在
if (!existsSync(SOURCE_DIR)) {
  console.error("❌ 錯誤: dist 目錄不存在，請先執行 build");
  process.exit(1);
}

// 2. 刪除目標目錄（如果存在）
if (existsSync(TARGET_DIR)) {
  console.log("🗑️  刪除舊的 static 目錄...");
  rmSync(TARGET_DIR, { recursive: true, force: true });
}

// 3. 複製新的檔案
console.log("📋 複製新的檔案...");
cpSync(SOURCE_DIR, TARGET_DIR, { recursive: true });

console.log("✅ 部署完成！");
