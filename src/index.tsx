import React from "react";
import {
  getPrefix,
  getInteger,
  getSeparator,
  getFraction,
  getSuffix,
  getComparisonDiffIndex,
  getDiffColor,
  getMutedDecimals,
  extractSpanProps,
} from "./utils";
import {
  DEFAULT_NEGATIVE_COLOR,
  DEFAULT_POSITIVE_COLOR,
  DEFAULT_SHADOW_COLOR,
} from "./constants";
import {
  CompactDisplay,
  CurrencyDisplay,
  CurrencySign,
  LocaleMatcher,
  Notation,
  NumberingSystem,
  SignDisplay,
  Style,
  UnitDisplay,
} from "./types";

export interface IntlNumberFormatOptions {
  compactDisplay?: CompactDisplay;
  currency?: string;
  currencyDisplay?: CurrencyDisplay;
  currencySign?: CurrencySign;
  localeMatcher?: LocaleMatcher;
  notation?: Notation;
  numberingSystem?: NumberingSystem;
  signDisplay?: SignDisplay;
  style?: Style;
  unit?: string;
  unitDisplay?: UnitDisplay;
  useGrouping?: boolean;
  minimumIntegerDigits?: number;
  minimumFractionDigits?: number;
  maximumFractionDigits?: number;
  minimumSignificantDigits?: number;
  maximumSignificantDigits?: number;
}

interface IntlNumberFormatProps {
  locales?: string | string[];
  options?: IntlNumberFormatOptions;
}

export interface AdvancedNumberProps extends IntlNumberFormatProps {
  value: number;
  smallDecimals?: boolean;
  privacyMode?: boolean;
  privacyShadowColor?: string;
  previousValue?: number;
  positiveColor?: string;
  negativeColor?: string;
  significantDecimalDigits?: number;
  showMutedDecimals?: boolean;
  maxDecimalDigits?: number;
}

export const AdvancedNumber = React.forwardRef<
  HTMLSpanElement,
  AdvancedNumberProps & React.HTMLAttributes<HTMLSpanElement>
>((props, ref) => {
  const {
    value,
    locales,
    options,
    smallDecimals = true,
    privacyMode = false,
    privacyShadowColor = DEFAULT_SHADOW_COLOR,
    previousValue,
    positiveColor = DEFAULT_POSITIVE_COLOR,
    negativeColor = DEFAULT_NEGATIVE_COLOR,
    significantDecimalDigits,
    showMutedDecimals = false,
    maxDecimalDigits,
  } = props;

  const fractionDigits =
    significantDecimalDigits &&
    significantDecimalDigits >= 0 &&
    significantDecimalDigits <= 20
      ? Math.floor(significantDecimalDigits)
      : undefined;

  const formatter: Intl.NumberFormat = new Intl.NumberFormat(locales, {
    ...options,
    minimumFractionDigits: fractionDigits
      ? fractionDigits
      : options?.minimumFractionDigits,
    maximumFractionDigits: fractionDigits
      ? fractionDigits
      : options?.minimumFractionDigits,
  });
  const valueParts = formatter.formatToParts(value);

  const prefix = getPrefix(valueParts);
  const integer = getInteger(valueParts);
  const separator = getSeparator(valueParts);
  const fraction = getFraction(valueParts);
  const suffix = getSuffix(valueParts);

  let neutralInteger = integer;
  let changedInteger = "";
  let neutralFraction = fraction;
  let changedFraction = "";

  if (previousValue) {
    const previousValueParts = formatter.formatToParts(previousValue);

    const previousInteger = getInteger(previousValueParts);
    const integerDiffIndex = getComparisonDiffIndex(integer, previousInteger);

    neutralInteger = integer.slice(0, integerDiffIndex);
    changedInteger = integer.slice(integerDiffIndex, integer.length + 1);

    if (integerDiffIndex < integer.length + 1) {
      neutralFraction = "";
      changedFraction = fraction;
    } else {
      const previousFraction = getFraction(previousValueParts);
      const fractionDiffIndex = getComparisonDiffIndex(
        fraction,
        previousFraction
      );

      neutralFraction = fraction.slice(0, fractionDiffIndex);
      changedFraction = fraction.slice(fractionDiffIndex, fraction.length + 1);
    }
  }

  const diffColor = getDiffColor(
    positiveColor,
    negativeColor,
    value,
    previousValue
  );

  const renderPrefix = () => <span>{prefix}</span>;
  const renderInteger = () => (
    <span>
      {neutralInteger}
      <span style={privacyMode ? {} : { color: diffColor }}>
        {changedInteger}
      </span>
    </span>
  );
  const renderSeparator = () => <span>{separator}</span>;
  const renderFractions = () => (
    <span style={smallDecimals ? { fontSize: "0.8em" } : {}}>
      {neutralFraction}
      <span style={privacyMode ? {} : { color: diffColor }}>
        {changedFraction}
        {renderMutedDecimals()}
      </span>
    </span>
  );
  const renderMutedDecimals = () => {
    const maxFractionDigits =
      maxDecimalDigits && maxDecimalDigits >= 0 && maxDecimalDigits <= 20
        ? Math.floor(maxDecimalDigits)
        : undefined;
    if (!showMutedDecimals || !maxFractionDigits) {
      return null;
    }
    const { minimumFractionDigits } = formatter.resolvedOptions();
    return (
      <span style={{ opacity: 0.7 }}>
        {getMutedDecimals(minimumFractionDigits, maxFractionDigits)}
      </span>
    );
  };
  const renderSuffix = () => <span>{suffix}</span>;

  const getPrivacyStyle = () =>
    privacyMode
      ? {
          color: "transparent",
          textShadow: `0 0 0.5rem ${privacyShadowColor}`,
        }
      : {};

  const spanElementProps: React.HTMLAttributes<HTMLSpanElement> = extractSpanProps(
    props
  );

  return (
    <span ref={ref} {...spanElementProps}>
      <span style={getPrivacyStyle()}>
        {renderPrefix()}
        {renderInteger()}
        {renderSeparator()}
        {renderFractions()}
        {renderSuffix()}
      </span>
    </span>
  );
});
