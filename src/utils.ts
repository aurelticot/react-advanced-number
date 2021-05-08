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

export const getInteger = (valueParts: Intl.NumberFormatPart[]): string => {
  return valueParts
    .filter((part) => part.type === "integer" || part.type === "group")
    .map((part) => part.value)
    .reduce((previousValue, value) => previousValue + value, "");
};

export const getSeparator = (valueParts: Intl.NumberFormatPart[]): string => {
  return valueParts
    .filter((part) => part.type === "decimal")
    .map((part) => part.value)
    .reduce((previousValue, value) => previousValue + value, "");
};

export const getFraction = (valueParts: Intl.NumberFormatPart[]): string => {
  return valueParts
    .filter((part) => part.type === "fraction")
    .map((part) => part.value)
    .reduce((previousValue, value) => previousValue + value, "");
};

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

export const getComparisonDiffIndex = (
  value1: string,
  value2: string
): number => {
  // TODO handle when values are not same length
  let index = value2.length + 1;
  value2.split("").forEach((val, i) => {
    if (val !== value1.charAt(i)) {
      index = Math.min(index, i);
    }
  });
  return index;
};

export const getMutedDecimals = (
  nbDigits: number,
  maxDigits: number
): string => {
  return maxDigits > nbDigits
    ? String(10 ** (maxDigits - nbDigits)).slice(1)
    : "";
};

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

// Dissociate the span props to forward from the component props
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
