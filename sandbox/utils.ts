// Sandbox utilities for testing /simplify and /batch commands

/**
 * 日付をYYYY-MM-DD形式の文字列にフォーマットする
 * @param date - フォーマット対象のDateオブジェクト
 * @returns YYYY-MM-DD形式の日付文字列
 */
export function formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/**
 * 時刻をHH:MM:SS形式の文字列にフォーマットする
 * @param date - フォーマット対象のDateオブジェクト
 * @returns HH:MM:SS形式の時刻文字列
 */
export function formatTime(date: Date): string {
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");
  return `${hours}:${minutes}:${seconds}`;
}

/**
 * 日時をYYYY-MM-DD HH:MM:SS形式の文字列にフォーマットする
 * @param date - フォーマット対象のDateオブジェクト
 * @returns YYYY-MM-DD HH:MM:SS形式の日時文字列
 */
export function formatDateTime(date: Date): string {
  return `${formatDate(date)} ${formatTime(date)}`;
}
