/**
 * Convert PascalCase keys to Python style snake_case.
 *
 * @param str key string
 * @returns Formatted
 */
export function formatKey(str: string): string {
  return str
    .replace(/[" "]/g, "") // remove whitespace
    .replace(/([a-z0-9])([A-Z])/g, "$1_$2") // insert an underscore between lowercase/digit and uppercase
    .replace(/([A-Z])([A-Z][a-z])/g, "$1_$2") // insert underscore between consecutive uppercase letters and a following lowercase
    .toLowerCase();
}

/**
 * Format bytes as human-readable text.
 *
 * Based on: https://stackoverflow.com/a/14919494
 *
 * @param bytes Number of bytes
 * @param dp Number of decimal places to display
 *
 * @return Formatted string
 */
export function formatFileSize(bytes: number, dp = 1): string {
  const thresh = 1000;

  if (Math.abs(bytes) < thresh) {
    return bytes + " B";
  }

  const units = ["kB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
  let u = -1;
  const r = 10 ** dp;

  do {
    bytes /= thresh;
    ++u;
  } while (
    Math.round(Math.abs(bytes) * r) / r >= thresh &&
    u < units.length - 1
  );

  return bytes.toFixed(dp) + " " + units[u];
}

/**
 * Format numbers as human-readable text.
 *
 * Based on: https://stackoverflow.com/a/9462382
 *
 * @param n number
 * @param digits number of digits
 * @returns formatted string
 */
export function formatNumber(n: number, digits: number = 1): string {
  const lookup = [
    { value: 1, symbol: "" },
    { value: 1e3, symbol: "k" },
    { value: 1e6, symbol: "M" },
    { value: 1e9, symbol: "G" },
    { value: 1e12, symbol: "T" },
    { value: 1e15, symbol: "P" },
    { value: 1e18, symbol: "E" },
  ];
  const regexp = /\.0+$|(?<=\.[0-9]*[1-9])0+$/;
  const item = lookup
    .slice()
    .reverse()
    .find((item) => n >= item.value);
  return item
    ? (n / item.value).toFixed(digits).replace(regexp, "").concat(item.symbol)
    : "0";
}

/**
 * Shorten file name.
 *
 * @param str file name
 * @param length max length
 * @returns
 */
export function formatFileName(str: string, length: number): string {
  if (str.length <= length) {
    return str;
  }
  return str.substring(0, length - 3) + "...";
}
