// src/vault/sensitive.ts
const MIN_TRACK_LENGTH = 4;
const sensitiveValues = new Set();
export function trackSensitiveValues(fields) {
    for (const val of Object.values(fields)) {
        if (val.length >= MIN_TRACK_LENGTH) {
            sensitiveValues.add(val);
        }
    }
}
export function containsSensitiveValue(text) {
    for (const val of sensitiveValues) {
        if (text.includes(val))
            return true;
    }
    return false;
}
export function redactSensitiveValues(text) {
    let result = text;
    for (const val of sensitiveValues) {
        while (result.includes(val)) {
            result = result.replace(val, "[REDACTED]");
        }
    }
    return result;
}
export function clearSensitiveValues() {
    sensitiveValues.clear();
}
