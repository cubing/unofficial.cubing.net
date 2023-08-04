import { DNF_VALUE, DNS_VALUE } from "../data/attempts";

export function formatTime(
  resultTotalMs: number,
  decimalDigits: 0 | 1 | 2 | 3 = 2,
): string {
  switch (resultTotalMs) {
    case DNF_VALUE:
      return "DNF";
    case DNS_VALUE:
      return "DNS";
  }

  const hours = Math.floor(resultTotalMs / (60 * 60 * 1000));
  const minutes = Math.floor(resultTotalMs / (60 * 1000)) % 60;
  const seconds = Math.floor(resultTotalMs / 1000) % 60;
  const ms = Math.floor(resultTotalMs % 1000);

  let preDecimal: string;
  if (hours > 0) {
    preDecimal = [
      hours.toString(),
      minutes.toString().padStart(2, "0"),
      seconds.toString().padStart(2, "0"),
    ].join(":");
  } else if (minutes > 0) {
    preDecimal = [minutes.toString(), seconds.toString().padStart(2, "0")].join(
      ":",
    );
  } else {
    preDecimal = seconds.toString();
  }

  if (decimalDigits === 0) {
    return preDecimal;
  }

  return [
    preDecimal,
    ms.toString().padStart(3, "0").slice(0, decimalDigits),
  ].join(".");
}
