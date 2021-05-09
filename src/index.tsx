import React from "react";
import {
  getPrefix,
  getInteger,
  getSeparator,
  getFraction,
  getSuffix,
  getComparisonDiffIndex,
  getDiffColor,
  getMutedDigits,
  extractSpanProps,
} from "./utils";
import {
  DEFAULT_NEGATIVE_COLOR,
  DEFAULT_POSITIVE_COLOR,
  DEFAULT_SHADOW_COLOR,
  MUTED_DECIMALS_OPACITY,
  PRIVACY_SHADOW_BLUR_RADIUS,
  SMAL_DECIMALS_FONT_SIZE,
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
  /**
   * The locale(s) used for the formating.
   *
   * Check {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat/NumberFormat|Intl.NumberFormat}.
   */
  locales?: string | string[];

  /**
   * The formating options.
   *
   * Check {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat/NumberFormat|Intl.NumberFormat} for the supported options.
   */
  options?: IntlNumberFormatOptions;
}

/**
 * Props of the AdvancedNumber component.
 *
 * They include the props for the formatting via {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat/NumberFormat|Intl.NumberFormat}
 */
export interface AdvancedNumberProps extends IntlNumberFormatProps {
  /**
   * The value to format. Ensure it's a number otherwise Int.NumberFormat will break.
   *
   * Check the 'options' property for the formatting configuration (currency, percentage, ...)
   *
   * @type number
   */
  value: number;

  /**
   * A boolean to enable (true) or disable (false) representing the decimal smaller than the integer.
   *
   * Default is false.
   *
   * @type boolean
   */
  smallDecimals?: boolean;

  /**
   * A boolean to enable (true) or disable (false) the privacy mode.
   *
   * Default is false.
   *
   * @type boolean
   */
  privacyMode?: boolean;

  /**
   * Color to use for the shadow of the privacy mode.
   *
   * Default is #7C7C7CD9
   *
   * @type string
   */
  privacyShadowColor?: string;

  /**
   * Optionally, the value to check the difference from.
   *
   * Providing this previousValue implies the difference will be highlighted.
   * Leave it undefined if you don't want to.
   *
   * @type number
   */
  previousValue?: number;

  /**
   * Color to use for a positive difference between the value and the previous value.
   *
   * Ignored if previousValue is not provided.
   *
   * Default is #4CAF50.
   *
   * @type string
   */
  positiveColor?: string;

  /**
   * Color to use for a negative difference between the value and the previous value.
   *
   * Ignored if previousValue is not provided.
   *
   * Default is #F44336.
   *
   * @type string
   */
  negativeColor?: string;

  /**
   *  The number of decimal to display.
   * This property overrides both options.minimumFractionDigits and options.maximumFractionDigits.
   *
   * If undefined, the defaults from {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat/NumberFormat|Intl.NumberFormat} are used.
   *
   * * @type number
   */
  significantDecimalDigits?: number;

  /**
   * A boolean to enable (true) or disable (false) the representation of the muted decimals.
   *
   * Default is false.
   *
   * @type boolean
   */
  showMutedDecimals?: boolean;

  /**
   * The total number of decimal digits displayed when muted decimals is enabled (ignoredd if disabled).
   *
   * The muted decimals correspond to the difference between maxDecimalDigits and significantDecimalDigits, assuming maxDecimalDigits is greater.
   *
   * @type number
   */
  maxDecimalDigits?: number;
}

/**
 * This component allows formatting and rendering a number using the {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat|Intl.NumberFormat API}. The formatting options of the API are provided as props of this component.
 *
 * In additiona, specific features are also provided such as:
 * - Optionaly have smaller decimals
 * - Highlighting a difference between the value and a previous value.
 * - A privacy mode, blurrying the value when enabled.
 * - Displaying muted decimals between a significant number and the total number of decimals
 *
 * If provided, the ref is forwarded to the root span element.
 */
export const AdvancedNumber = React.forwardRef<
  HTMLSpanElement,
  AdvancedNumberProps & React.HTMLAttributes<HTMLSpanElement>
>((props, ref) => {
  const {
    value,
    locales,
    options,
    smallDecimals = false,
    privacyMode = false,
    privacyShadowColor = DEFAULT_SHADOW_COLOR,
    previousValue,
    positiveColor = DEFAULT_POSITIVE_COLOR,
    negativeColor = DEFAULT_NEGATIVE_COLOR,
    significantDecimalDigits,
    showMutedDecimals = false,
    maxDecimalDigits,
  } = props;

  /* Ensure the prop 'significantDecimalDigits' is an integer between 0 and 20,
  as expected by Intl.NumberFormatOptions properties 'minimumFractionDigits'
  and 'maximumFractionDigits'.*/
  const fractionDigits =
    significantDecimalDigits &&
    significantDecimalDigits >= 0 &&
    significantDecimalDigits <= 20
      ? Math.floor(significantDecimalDigits)
      : undefined;

  /* Initialize the formatter.
  Note if the prop 'significantDecimalDigits' has been provided, it
  overrides the Intl.NumberFormatOptions properties 'minimumFractionDigits'
  and 'maximumFractionDigits'.*/
  const formatter: Intl.NumberFormat = new Intl.NumberFormat(locales, {
    ...options,
    minimumFractionDigits: fractionDigits
      ? fractionDigits
      : options?.minimumFractionDigits,
    maximumFractionDigits: fractionDigits
      ? fractionDigits
      : options?.minimumFractionDigits,
  });

  // Format the value.
  const valueParts = formatter.formatToParts(value);

  // Extract the main parts from the parts returned by the formatter.
  const prefix = getPrefix(valueParts);
  const integer = getInteger(valueParts);
  const separator = getSeparator(valueParts);
  const fraction = getFraction(valueParts);
  const suffix = getSuffix(valueParts);

  // Prepare the variables used in the render functions.
  let neutralInteger = integer;
  let changedInteger = "";
  let neutralFraction = fraction;
  let changedFraction = "";

  // Compute the diff only if previousValue has been provided.
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

  // Render functions, basically wrapping the different parts into the span elements.

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
    <span style={smallDecimals ? { fontSize: SMAL_DECIMALS_FONT_SIZE } : {}}>
      {neutralFraction}
      <span style={privacyMode ? {} : { color: diffColor }}>
        {changedFraction}
        {renderMutedDecimals()}
      </span>
    </span>
  );
  const renderMutedDecimals = () => {
    if (!showMutedDecimals) {
      return null;
    }
    const maxFractionDigits =
      maxDecimalDigits && maxDecimalDigits >= 0 && maxDecimalDigits <= 20
        ? Math.floor(maxDecimalDigits)
        : undefined;
    if (!maxFractionDigits) {
      return null;
    }
    const { minimumFractionDigits } = formatter.resolvedOptions();
    return (
      <span style={{ opacity: MUTED_DECIMALS_OPACITY }}>
        {getMutedDigits(minimumFractionDigits, maxFractionDigits)}
      </span>
    );
  };
  const renderSuffix = () => <span>{suffix}</span>;

  const getPrivacyStyle = () =>
    privacyMode
      ? {
          color: "transparent",
          textShadow: `0 0 ${PRIVACY_SHADOW_BLUR_RADIUS} ${privacyShadowColor}`,
        }
      : {};

  // Get clean props to forward to the root span element.
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
