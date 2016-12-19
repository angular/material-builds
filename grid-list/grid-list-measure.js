/**
 * Converts values into strings. Falsy values become empty strings.
 * @docs-private
 */
export function coerceToString(value) {
    return "" + (value || '');
}
/**
 * Converts a value that might be a string into a number.
 * @docs-private
 */
export function coerceToNumber(value) {
    return typeof value === 'string' ? parseInt(value, 10) : value;
}

//# sourceMappingURL=grid-list-measure.js.map
