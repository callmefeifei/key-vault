// src/vault/sensitive.ts

const MIN_TRACK_LENGTH = 4;

const sensitiveValues = new Set<string>();

export function trackSensitiveValues(fields: Record<string, string>): void {
  for (const val of Object.values(fields)) {
    if (val.length >= MIN_TRACK_LENGTH) {
      sensitiveValues.add(val);
    }
  }
}

export function containsSensitiveValue(text: string): boolean {
  for (const val of sensitiveValues) {
    if (text.includes(val)) return true;
  }
  return false;
}

export function redactSensitiveValues(text: string): string {
  let result = text;
  for (const val of sensitiveValues) {
    while (result.includes(val)) {
      result = result.replace(val, "[REDACTED]");
    }
  }
  return result;
}

export function clearSensitiveValues(): void {
  sensitiveValues.clear();
}
