import React from "react";
import {
  normalizeValue,
  convertValueToString,
  getComparisonDiffIndex,
  getDiffColor,
  getMutedDecimals,
} from "./utils";
import {
  DEFAULT_MUTED_COLOR,
  DEFAULT_NEGATIVE_COLOR,
  DEFAULT_POSITIVE_COLOR,
} from "./constants";

interface Props {
  value: number;
  precision: number;
  previousValue?: number;
  privacyMode?: boolean;
  maxNbDecimals: number;
  displayMutedDecimals?: boolean;
  smallDecimals?: boolean;
  highlightDiff?: boolean;
  positiveColor?: string;
  negativeColor?: string;
  mutedColor?: string;
}

export const AdvancedNumber: React.FunctionComponent<Props> = (props) => {
  const {
    value,
    precision,
    previousValue,
    privacyMode = false,
    maxNbDecimals,
    displayMutedDecimals = false,
    smallDecimals = false,
    highlightDiff = false,
    positiveColor = DEFAULT_POSITIVE_COLOR,
    negativeColor = DEFAULT_NEGATIVE_COLOR,
    mutedColor = DEFAULT_MUTED_COLOR,
  } = props;

  // Precision shall be an integer, so rounding in case it's not
  const roundedPrecision = Math.floor(precision);

  // To ease further manipulations, the value is normalized from a decimal
  // number to an integer: 123.456 with a precision of 4 becomes 1234560
  const normalizedValue = normalizeValue(value, roundedPrecision);

  const valueString = convertValueToString(normalizedValue, roundedPrecision);

  const nbIntegers = valueString.length - roundedPrecision;
  const nbDecimals =
    roundedPrecision <= maxNbDecimals
      ? roundedPrecision < 0
        ? 0
        : roundedPrecision
      : maxNbDecimals;

  const valueInteger = valueString.slice(0, nbIntegers);
  const valueDecimals = valueString.slice(
    nbIntegers,
    valueString.length - (roundedPrecision - maxNbDecimals)
  );

  let neutralValueInteger = valueInteger;
  let changedValueInteger = "";
  let neutralValueDecimals = valueDecimals;
  let changedValueDecimals = "";

  if (highlightDiff && previousValue) {
    // Similarly to value, previous value is normalized from a decimal
    // number to an integer
    const normalizedPreviousValue = normalizeValue(
      previousValue,
      roundedPrecision
    );

    const previousValueString = convertValueToString(
      normalizedPreviousValue,
      roundedPrecision
    );

    const diffIndex = getComparisonDiffIndex(valueString, previousValueString);

    neutralValueInteger = valueInteger.slice(0, diffIndex);
    changedValueInteger = valueInteger.slice(
      diffIndex,
      valueInteger.length + 1
    );

    if (diffIndex < nbIntegers) {
      neutralValueDecimals = "";
      changedValueDecimals = valueDecimals;
    } else {
      neutralValueDecimals = valueDecimals.slice(0, diffIndex - nbIntegers);
      changedValueDecimals = valueDecimals.slice(diffIndex - nbIntegers);
    }
  }

  const mutedDecimals = getMutedDecimals(nbDecimals, maxNbDecimals);

  const diffColor = getDiffColor(
    value,
    highlightDiff,
    positiveColor,
    negativeColor,
    previousValue
  );

  return (
    <span>
      <span
        style={
          privacyMode
            ? { color: "transparent", textShadow: "0 0 0.8rem rgba(0,0,0,0.5)" }
            : {}
        }
      >
        <span>
          <span>
            {neutralValueInteger}
            <span style={privacyMode ? {} : { color: diffColor }}>
              {changedValueInteger}
            </span>
          </span>
          {`.`}
          <span style={smallDecimals ? { fontSize: "0.8em" } : {}}>
            {neutralValueDecimals}
            <span style={privacyMode ? {} : { color: diffColor }}>
              {changedValueDecimals}
            </span>
            {displayMutedDecimals && (
              <span style={privacyMode ? {} : { color: mutedColor }}>
                {mutedDecimals}
              </span>
            )}
          </span>
        </span>
      </span>
    </span>
  );
};
