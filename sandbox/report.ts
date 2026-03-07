// Sandbox report generator for testing /simplify and /batch commands

import { formatDate, formatDateTime, formatTime } from "./utils";

type ReportFormat = "csv" | "tsv" | "text";

interface ReportConfig {
  title: string;
  includeDate: boolean;
  includeTime: boolean;
  format: ReportFormat;
}

const FORMAT_DELIMITERS: Record<ReportFormat, string> = {
  csv: ",",
  tsv: "\t",
  text: " | ",
};

function formatItem(item: Record<string, unknown>, format: ReportFormat): string {
  const keys = Object.keys(item);
  if (format === "text") {
    return keys.map((k) => `${k}: ${item[k]}`).join(FORMAT_DELIMITERS.text);
  }
  return keys.map((k) => String(item[k])).join(FORMAT_DELIMITERS[format]);
}

/**
 * 設定に基づいてレポートを生成する
 * @param data - レポートに含めるデータの配列
 * @param config - レポートのタイトル、日時表示、フォーマットを指定する設定
 * @returns フォーマットされたレポート文字列
 */
export function generateReport(
  data: Record<string, unknown>[],
  config: ReportConfig,
): string {
  const { title, includeDate, includeTime, format } = config;
  const lines: string[] = [];
  const now = new Date();

  lines.push(`=== ${title} ===`);

  if (includeDate && includeTime) {
    lines.push(`Generated: ${formatDateTime(now)}`);
  } else if (includeDate) {
    lines.push(`Generated: ${formatDate(now)}`);
  } else if (includeTime) {
    lines.push(`Generated: ${formatTime(now)}`);
  }

  lines.push("");

  for (const item of data) {
    lines.push(formatItem(item, format));
  }

  return lines.join("\n");
}

/**
 * CSV形式のレポートを生成する
 * @param data - レポートに含めるデータの配列
 * @param title - レポートのタイトル
 * @param includeDate - 生成日付を含めるかどうか
 * @param includeTime - 生成時刻を含めるかどうか
 * @returns CSV形式のレポート文字列
 */
export function generateCsvReport(
  data: Record<string, unknown>[],
  title: string,
  includeDate: boolean,
  includeTime: boolean,
): string {
  return generateReport(data, { title, includeDate, includeTime, format: "csv" });
}

/**
 * TSV形式のレポートを生成する
 * @param data - レポートに含めるデータの配列
 * @param title - レポートのタイトル
 * @param includeDate - 生成日付を含めるかどうか
 * @param includeTime - 生成時刻を含めるかどうか
 * @returns TSV形式のレポート文字列
 */
export function generateTsvReport(
  data: Record<string, unknown>[],
  title: string,
  includeDate: boolean,
  includeTime: boolean,
): string {
  return generateReport(data, { title, includeDate, includeTime, format: "tsv" });
}

/**
 * レポート文字列の行数をカウントする
 * @param report - 行数をカウントするレポート文字列
 * @returns レポートの行数
 */
export function countReportLines(report: string): number {
  return report.split("\n").length;
}

/**
 * 指定されたキーと値でレポートデータをフィルタリングする
 * @param data - フィルタリング対象のデータ配列
 * @param key - フィルタリングに使用するキー名
 * @param value - フィルタリングに使用する値
 * @returns フィルタ条件に一致するデータの配列
 */
export function filterReportData(
  data: Record<string, unknown>[],
  key: string,
  value: unknown,
): Record<string, unknown>[] {
  return data.filter((item) => item[key] === value);
}
