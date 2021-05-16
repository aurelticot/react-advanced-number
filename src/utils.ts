/**
 * Extract the prefix as a whole string from the number parts.
 *
 * @param valueParts the parts of the formatted number returmed from Intl.NumberFormat#formatToParts
 * @returns the prefix as a single string or an empty string.
 */
export const getPrefix = (valueParts: Intl.NumberFormatPart[]): string => {
  const prefixIndex = valueParts.findIndex(
    (part) =>
      part.type === "integer" ||
      part.type === "group" ||
      part.type === "decimal" ||
      part.type === "fraction"
  );
  const prefixArray = prefixIndex > 0 ? valueParts.slice(0, prefixIndex) : [];
  return prefixArray
    .map((part) => part.value)
    .reduce((previousValue, value) => previousValue + value, "")
    .trimStart();
};

/**
 * Extract the integer as a whole string from the number parts.
 *
 * @param valueParts the parts of the formatted number returmed from Intl.NumberFormat#formatToParts
 * @returns the integer as a single string or an empty string.
 */
export const getInteger = (valueParts: Intl.NumberFormatPart[]): string => {
  return valueParts
    .filter((part) => part.type === "integer" || part.type === "group")
    .map((part) => part.value)
    .reduce((previousValue, value) => previousValue + value, "");
};

/**
 * Get the decimal separator from the number parts.
 *
 * @param valueParts the parts of the formatted number returmed from Intl.NumberFormat#formatToParts
 * @returns the separator as a string or an empty string.
 */
export const getSeparator = (valueParts: Intl.NumberFormatPart[]): string => {
  return valueParts
    .filter((part) => part.type === "decimal")
    .map((part) => part.value)
    .reduce((previousValue, value) => previousValue + value, "");
};

/**
 * Extract the fraction as a whole string from the number parts.
 *
 * @param valueParts the parts of the formatted number returmed from Intl.NumberFormat#formatToParts
 * @returns the fraction as a single string or an empty string.
 */
export const getFraction = (valueParts: Intl.NumberFormatPart[]): string => {
  return valueParts
    .filter((part) => part.type === "fraction")
    .map((part) => part.value)
    .reduce((previousValue, value) => previousValue + value, "");
};

/**
 * Extract the suffix as a whole string from the number parts.
 *
 * @param valueParts the parts of the formatted number returmed from Intl.NumberFormat#formatToParts
 * @returns the suffix as a single string or an empty string.
 */
export const getSuffix = (valueParts: Intl.NumberFormatPart[]): string => {
  const suffixReverseIndex = [...valueParts]
    .reverse()
    .findIndex(
      (part) =>
        part.type === "integer" ||
        part.type === "group" ||
        part.type === "decimal" ||
        part.type === "fraction"
    );
  const suffixIndex =
    suffixReverseIndex > 0
      ? valueParts.length - suffixReverseIndex
      : valueParts.length;
  const suffixArray =
    suffixIndex < valueParts.length ? valueParts.slice(suffixIndex) : [];
  return suffixArray
    .map((part) => part.value)
    .reduce((previousValue, value) => previousValue + value, "")
    .trimEnd();
};

const getNZeros = (nbZeros: number): string => {
  return nbZeros > 0 ? String(10 ** nbZeros).slice(1) : "";
};

/**
 * Compare the two string values and return the index from where there's a difference.
 *
 * @param value1 the numeric value to check, formatted as a string.
 * @param value2 the numeric value to check against, formatted as a string.
 * @returns the index of the difference. value1 is used as a reference.
 */
export const getComparisonDiffIndex = (
  value1: string,
  value2: string
): number => {
  if (value1.length !== value2.length) {
    return value2.length > value1.length ? value1.length : 0;
  }
  const index = value1
    .split("")
    .findIndex((val, i) => val !== value2.charAt(i));
  return index < 0 ? value1.length : index;
};

/**
 * Get the sequence of '0' representing the muted digits. The number of muted digits is the difference between the two parameters nbDigits and maxDigits.
 *
 * @param nbDigits the number of digits of the number.
 * @param maxDigits the maximum of digits to display.
 * @returns a sequence of '0' or an empty string if maxDigits is less or equal to nbDigits.
 */
export const getMutedDigits = (nbDigits: number, maxDigits: number): string => {
  return getNZeros(maxDigits - nbDigits);
};

/**
 * Get the font color based on the diff between the value and the previous value.
 *
 * @param positiveColor the color applied for a positive difference
 * @param negativeColor the color applied for a negative difference
 * @param value the value to check.
 * @param previousValue the previous value to check against.
 * @returns the CSS color, either the positive, the negative colors or 'inherit' if there is no difference or previous value is not provided.
 */
export const getDiffColor = (
  positiveColor: string,
  negativeColor: string,
  value: number,
  previousValue?: number
): string => {
  if (!previousValue) {
    return "inherit";
  }
  return value > previousValue
    ? positiveColor
    : value < previousValue
    ? negativeColor
    : "inherit";
};

/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any */

/**
 * Extract the span props to forward from the whole component props.
 *
 * @param props the whole component props.
 * @returns the HTML span element props.
 */
export const extractSpanProps = (
  props: any
): React.HTMLAttributes<HTMLSpanElement> => {
  const cleanedProps = { ...props };
  delete cleanedProps.value;
  delete cleanedProps.locales;
  delete cleanedProps.options;
  delete cleanedProps.smallDecimals;
  delete cleanedProps.privacyMode;
  delete cleanedProps.privacyShadowColor;
  delete cleanedProps.previousValue;
  delete cleanedProps.positiveColor;
  delete cleanedProps.negativeColor;
  delete cleanedProps.significantDecimalDigits;
  delete cleanedProps.showMutedDecimals;
  delete cleanedProps.maxDecimalDigits;
  return cleanedProps as React.HTMLAttributes<HTMLSpanElement>;
};
/* eslint-enable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any */
