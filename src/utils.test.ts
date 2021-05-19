import { AdvancedNumberProps } from "./index";
import {
  getFraction,
  getInteger,
  getPrefix,
  getSeparator,
  getSuffix,
  getMutedDigits,
  getDiffColor,
  getComparisonDiffIndex,
  extractSpanProps,
} from "./utils";

describe("Utils", () => {
  const numberPartsFull: Intl.NumberFormatPart[] = [
    { type: "literal", value: " " },
    { type: "currency", value: "USD" },
    { type: "literal", value: " " },
    { type: "minusSign", value: "-" },
    { type: "integer", value: "3" },
    { type: "group", value: "." },
    { type: "integer", value: "500" },
    { type: "decimal", value: "," },
    { type: "fraction", value: "00" },
    { type: "literal", value: " " },
    { type: "currency", value: "€" },
    { type: "literal", value: " " },
  ];

  const numberPartsEmpty: Intl.NumberFormatPart[] = [];

  describe("getPrefix", () => {
    test("returns the prefix as a concatenated string", () => {
      expect(getPrefix(numberPartsFull)).toBe("USD -");
    });

    test("returns an empty string if no prefix part", () => {
      expect(getPrefix(numberPartsEmpty)).toBe("");
    });
  });

  describe("getInteger", () => {
    test("returns the integer parts as a concatenated string", () => {
      expect(getInteger(numberPartsFull)).toBe("3.500");
    });

    test("returns an empty string if no fraction part", () => {
      expect(getInteger(numberPartsEmpty)).toBe("");
    });
  });

  describe("getSeparator", () => {
    test("returns the separator", () => {
      expect(getSeparator(numberPartsFull)).toBe(",");
    });

    test("returns an empty string if no separator", () => {
      expect(getSeparator(numberPartsEmpty)).toBe("");
    });
  });

  describe("getFraction", () => {
    test("returns the fraction parts as a concatenated string", () => {
      expect(getFraction(numberPartsFull)).toBe("00");
    });

    test("returns an empty string if no fraction part", () => {
      expect(getFraction(numberPartsEmpty)).toBe("");
    });
  });

  describe("getSuffix", () => {
    test("returns the suffix as a concatenated string", () => {
      expect(getSuffix(numberPartsFull)).toBe(" €");
    });

    test("returns an empty string if no suffix part", () => {
      expect(getSuffix(numberPartsEmpty)).toBe("");
    });
  });

  describe("getComparisonDiffIndex", () => {
    test("returns the index of the difff", () => {
      expect(getComparisonDiffIndex("1234", "1234")).toEqual(4);
      expect(getComparisonDiffIndex("1234", "1233")).toEqual(3);
      expect(getComparisonDiffIndex("1233", "1234")).toEqual(3);
      expect(getComparisonDiffIndex("1234", "1224")).toEqual(2);
      expect(getComparisonDiffIndex("1224", "1234")).toEqual(2);
      expect(getComparisonDiffIndex("1134", "1234")).toEqual(1);
      expect(getComparisonDiffIndex("1234", "1134")).toEqual(1);
      expect(getComparisonDiffIndex("1224", "2345")).toEqual(0);
    });

    test("handles params of different length", () => {
      expect(getComparisonDiffIndex("123", "11234")).toEqual(0);
      expect(getComparisonDiffIndex("11234", "123")).toEqual(0);
    });

    test("handles empty string params", () => {
      expect(getComparisonDiffIndex("1234", "")).toEqual(0);
      expect(getComparisonDiffIndex("", "1234")).toEqual(0);
      expect(getComparisonDiffIndex("", "")).toEqual(0);
    });
  });

  describe("getMutedDigits", () => {
    test("returns n zeros when maxDigits > nbDigits", () => {
      expect(getMutedDigits(1, 2)).toBe("0");
      expect(getMutedDigits(1, 4)).toBe("000");
    });

    test("returns empty string maxDigits <= nbDigits", () => {
      expect(getMutedDigits(1, 1)).toBe("");
      expect(getMutedDigits(2, 1)).toBe("");
    });
  });

  describe("getDiffColor", () => {
    const positiveColor = "#111111";
    const negativeColor = "#222222";

    test("returns the positive color if value > previousValue", () => {
      expect(getDiffColor(positiveColor, negativeColor, 2, 1)).toBe(
        positiveColor
      );
    });

    test("returns the negative color if value < previousValue", () => {
      expect(getDiffColor(positiveColor, negativeColor, 1, 2)).toBe(
        negativeColor
      );
    });

    test("returns 'inherit' if value === previousValue", () => {
      expect(getDiffColor(positiveColor, negativeColor, 1, 1)).toBe("inherit");
    });

    test("returns 'inherit' if previousValue is undefined", () => {
      expect(getDiffColor(positiveColor, negativeColor, 1)).toBe("inherit");
    });
  });

  describe("extractSpanProps", () => {
    const spanProps: React.HTMLAttributes<HTMLSpanElement> = {
      style: {},
      className: "test",
    };

    const componentFullProps: AdvancedNumberProps = {
      value: 1234.5,
      locales: "",
      maxDecimalDigits: 1,
      negativeColor: "",
      options: {},
      positiveColor: "",
      previousValue: 0.1,
      privacyMode: false,
      privacyShadowColor: "",
      showMutedDecimals: true,
      significantDecimalDigits: 1,
      smallDecimals: true,
    };

    const componentMinimalProps: AdvancedNumberProps = {
      value: 1234.5,
    };

    const fullProps: AdvancedNumberProps &
      React.HTMLAttributes<HTMLSpanElement> = {
      ...componentFullProps,
      ...spanProps,
    };

    const partialProps: AdvancedNumberProps &
      React.HTMLAttributes<HTMLSpanElement> = {
      ...componentMinimalProps,
      ...spanProps,
    };

    const minimalProps: AdvancedNumberProps &
      React.HTMLAttributes<HTMLSpanElement> = {
      ...componentMinimalProps,
    };

    test("returns an object not containing the component properties", () => {
      expect(extractSpanProps(fullProps)).toEqual(
        expect.not.objectContaining(componentFullProps)
      );
      expect(extractSpanProps(partialProps)).toEqual(
        expect.not.objectContaining(componentMinimalProps)
      );
      expect(extractSpanProps(minimalProps)).toEqual(
        expect.not.objectContaining(componentMinimalProps)
      );
    });

    test("returns an object containing the span properties, if any", () => {
      expect(extractSpanProps(fullProps)).toEqual(
        expect.objectContaining(spanProps)
      );
      expect(extractSpanProps(partialProps)).toEqual(
        expect.objectContaining(spanProps)
      );
      expect(extractSpanProps(minimalProps)).toEqual(
        expect.not.objectContaining(spanProps)
      );
    });
  });
});
