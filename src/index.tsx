import React from "react";
import {
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
  previousValue?: number;
  decimals: number;
  maxNbDecimals: number;
  privacyMode?: boolean;
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
    previousValue,
    decimals,
    maxNbDecimals,
    privacyMode = false,
    displayMutedDecimals = false,
    smallDecimals = false,
    highlightDiff = false,
    positiveColor = DEFAULT_POSITIVE_COLOR,
    negativeColor = DEFAULT_NEGATIVE_COLOR,
    mutedColor = DEFAULT_MUTED_COLOR,
  } = props;

  const valueString = convertValueToString(value, decimals);

  const nbIntegers = valueString.length - decimals;
  const nbDecimals =
    decimals <= maxNbDecimals ? (decimals < 0 ? 0 : decimals) : maxNbDecimals;

  const valueInteger = valueString.slice(0, nbIntegers);
  const valueDecimals = valueString.slice(
    nbIntegers,
    valueString.length - (decimals - maxNbDecimals)
  );

  let neutralValueInteger = valueInteger;
  let changedValueInteger = "";
  let neutralValueDecimals = valueDecimals;
  let changedValueDecimals = "";

  if (highlightDiff && previousValue) {
    const previousAmountString = convertValueToString(previousValue, decimals);
    const diffIndex = getComparisonDiffIndex(valueString, previousAmountString);

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
