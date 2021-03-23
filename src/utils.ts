export const normalizeValue = (value: number, precision: number): number => {
  // Transform an decimal number to an integer
  return Math.floor(value * 10 ** (precision < 0 ? 0 : precision));
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

export const convertValueToString = (
  value: number,
  decimals: number
): string => {
  let valueString = String(value).split(".")[0];
  if (valueString.length < decimals + 1) {
    const nbMissingLeadingZeros = decimals + 1 - valueString.length;
    const leadingZeros = String(10 ** nbMissingLeadingZeros).slice(1);
    valueString = `${leadingZeros}${valueString}`;
  }
  return valueString;
};

export const getMutedDecimals = (
  nbDecimals: number,
  maxNbDecimals: number
): string => {
  return String(10 ** (maxNbDecimals - nbDecimals)).slice(1);
};

export const getDiffColor = (
  value: number,
  highlightDiff: boolean,
  positiveColor: string,
  negativeColor: string,
  previousValue?: number
): string => {
  if (highlightDiff && previousValue) {
    return value > previousValue
      ? positiveColor
      : value < previousValue
      ? negativeColor
      : "inherit";
  }
  return "inherit";
};
