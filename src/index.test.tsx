import { render, cleanup } from "@testing-library/react";
import { AdvancedNumber } from "./index";

describe("AdvancedNumber", () => {
  afterEach(cleanup);

  describe("Base component", () => {
    test("Component structure with no decimal", () => {
      const { asFragment } = render(<AdvancedNumber value={1234} />);
      expect(asFragment()).toMatchInlineSnapshot(`
        <DocumentFragment>
          <span>
            <span>
              1,234
            </span>
          </span>
        </DocumentFragment>
      `);
    });

    test("Component structure with decimals", () => {
      const { asFragment } = render(<AdvancedNumber value={1234.56} />);
      expect(asFragment()).toMatchInlineSnapshot(`
        <DocumentFragment>
          <span>
            <span>
              1,234
            </span>
            <span>
              .
            </span>
            <span>
              56
            </span>
          </span>
        </DocumentFragment>
      `);
    });
  });

  describe("Formatting", () => {
    test("Currency formatting", () => {
      const { asFragment } = render(
        <AdvancedNumber
          value={1234.56789}
          options={{
            style: "currency",
            currency: "USD",
            currencyDisplay: "narrowSymbol",
          }}
        />
      );
      expect(asFragment()).toMatchInlineSnapshot(`
        <DocumentFragment>
          <span>
            <span>
              $
            </span>
            <span>
              1,234
            </span>
            <span>
              .
            </span>
            <span>
              57
            </span>
          </span>
        </DocumentFragment>
      `);
    });

    test("Percent formatting", () => {
      const { asFragment } = render(
        <AdvancedNumber
          value={0.654321}
          options={{
            style: "percent",
            minimumFractionDigits: 2,
          }}
        />
      );
      expect(asFragment()).toMatchInlineSnapshot(`
        <DocumentFragment>
          <span>
            <span>
              65
            </span>
            <span>
              .
            </span>
            <span>
              43
            </span>
            <span>
              %
            </span>
          </span>
        </DocumentFragment>
      `);
    });

    test("Localized formatting", () => {
      const { asFragment } = render(
        <AdvancedNumber
          value={1234.56789}
          locales="fr"
          options={{
            useGrouping: false,
          }}
        />
      );
      expect(asFragment()).toMatchInlineSnapshot(`
        <DocumentFragment>
          <span>
            <span>
              1234
            </span>
            <span>
              ,
            </span>
            <span>
              568
            </span>
          </span>
        </DocumentFragment>
      `);
    });
  });

  describe("Diff Highlighting", () => {
    test("Positive difference on integer", () => {
      const { asFragment } = render(
        <AdvancedNumber value={1234} previousValue={1222} />
      );
      expect(asFragment()).toMatchInlineSnapshot(`
        <DocumentFragment>
          <span>
            <span>
              1,2
              <span
                style="color: rgb(76, 175, 80);"
              >
                34
              </span>
            </span>
          </span>
        </DocumentFragment>
      `);
    });

    test("Positive difference on integer and decimals", () => {
      const { asFragment } = render(
        <AdvancedNumber value={1234.56} previousValue={1222.22} />
      );
      expect(asFragment()).toMatchInlineSnapshot(`
        <DocumentFragment>
          <span>
            <span>
              1,2
              <span
                style="color: rgb(76, 175, 80);"
              >
                34
              </span>
            </span>
            <span>
              .
            </span>
            <span>
              <span
                style="color: rgb(76, 175, 80);"
              >
                56
              </span>
            </span>
          </span>
        </DocumentFragment>
      `);
    });

    test("Positive difference on decimals", () => {
      const { asFragment } = render(
        <AdvancedNumber value={1234.56} previousValue={1234.52} />
      );
      expect(asFragment()).toMatchInlineSnapshot(`
        <DocumentFragment>
          <span>
            <span>
              1,234
            </span>
            <span>
              .
            </span>
            <span>
              5
              <span
                style="color: rgb(76, 175, 80);"
              >
                6
              </span>
            </span>
          </span>
        </DocumentFragment>
      `);
    });

    test("Negative difference on integer", () => {
      const { asFragment } = render(
        <AdvancedNumber value={1234} previousValue={1245} />
      );
      expect(asFragment()).toMatchInlineSnapshot(`
        <DocumentFragment>
          <span>
            <span>
              1,2
              <span
                style="color: rgb(244, 67, 54);"
              >
                34
              </span>
            </span>
          </span>
        </DocumentFragment>
      `);
    });

    test("Negative difference on integer and decimals", () => {
      const { asFragment } = render(
        <AdvancedNumber value={1234.56} previousValue={1244.56} />
      );
      expect(asFragment()).toMatchInlineSnapshot(`
        <DocumentFragment>
          <span>
            <span>
              1,2
              <span
                style="color: rgb(244, 67, 54);"
              >
                34
              </span>
            </span>
            <span>
              .
            </span>
            <span>
              <span
                style="color: rgb(244, 67, 54);"
              >
                56
              </span>
            </span>
          </span>
        </DocumentFragment>
      `);
    });

    test("Positive difference on different length", () => {
      const component = render(
        <AdvancedNumber value={1234.56} previousValue={989.22} />
      );
      expect(component.asFragment()).toMatchInlineSnapshot(`
        <DocumentFragment>
          <span>
            <span>
              <span
                style="color: rgb(76, 175, 80);"
              >
                1,234
              </span>
            </span>
            <span>
              .
            </span>
            <span>
              <span
                style="color: rgb(76, 175, 80);"
              >
                56
              </span>
            </span>
          </span>
        </DocumentFragment>
      `);

      const component2 = render(
        <AdvancedNumber value={1089.22} previousValue={989.22} />
      );
      expect(component2.asFragment()).toMatchInlineSnapshot(`
        <DocumentFragment>
          <span>
            <span>
              <span
                style="color: rgb(76, 175, 80);"
              >
                1,089
              </span>
            </span>
            <span>
              .
            </span>
            <span>
              <span
                style="color: rgb(76, 175, 80);"
              >
                22
              </span>
            </span>
          </span>
        </DocumentFragment>
      `);
    });

    test("Negative difference on different length", () => {
      const component = render(
        <AdvancedNumber value={989.22} previousValue={1234.56} />
      );
      expect(component.asFragment()).toMatchInlineSnapshot(`
        <DocumentFragment>
          <span>
            <span>
              <span
                style="color: rgb(244, 67, 54);"
              >
                989
              </span>
            </span>
            <span>
              .
            </span>
            <span>
              <span
                style="color: rgb(244, 67, 54);"
              >
                22
              </span>
            </span>
          </span>
        </DocumentFragment>
      `);

      const component2 = render(
        <AdvancedNumber value={989.22} previousValue={1089.22} />
      );
      expect(component2.asFragment()).toMatchInlineSnapshot(`
        <DocumentFragment>
          <span>
            <span>
              <span
                style="color: rgb(244, 67, 54);"
              >
                989
              </span>
            </span>
            <span>
              .
            </span>
            <span>
              <span
                style="color: rgb(244, 67, 54);"
              >
                22
              </span>
            </span>
          </span>
        </DocumentFragment>
      `);
    });

    test("Negative difference on decimals", () => {
      const { asFragment } = render(
        <AdvancedNumber value={1234.56} previousValue={1234.58} />
      );
      expect(asFragment()).toMatchInlineSnapshot(`
        <DocumentFragment>
          <span>
            <span>
              1,234
            </span>
            <span>
              .
            </span>
            <span>
              5
              <span
                style="color: rgb(244, 67, 54);"
              >
                6
              </span>
            </span>
          </span>
        </DocumentFragment>
      `);
    });

    test("Custom positive color on integer", () => {
      const { asFragment } = render(
        <AdvancedNumber
          value={1234}
          previousValue={1222}
          positiveColor="#03A9F4"
        />
      );
      expect(asFragment()).toMatchInlineSnapshot(`
        <DocumentFragment>
          <span>
            <span>
              1,2
              <span
                style="color: rgb(3, 169, 244);"
              >
                34
              </span>
            </span>
          </span>
        </DocumentFragment>
      `);
    });

    test("Custom positive color on integer and decimals", () => {
      const { asFragment } = render(
        <AdvancedNumber
          value={1234.56}
          previousValue={1222.22}
          positiveColor="#03A9F4"
        />
      );
      expect(asFragment()).toMatchInlineSnapshot(`
        <DocumentFragment>
          <span>
            <span>
              1,2
              <span
                style="color: rgb(3, 169, 244);"
              >
                34
              </span>
            </span>
            <span>
              .
            </span>
            <span>
              <span
                style="color: rgb(3, 169, 244);"
              >
                56
              </span>
            </span>
          </span>
        </DocumentFragment>
      `);
    });

    test("Custom positive color on decimals", () => {
      const { asFragment } = render(
        <AdvancedNumber
          value={1234.56}
          previousValue={1234.52}
          positiveColor="#03A9F4"
        />
      );
      expect(asFragment()).toMatchInlineSnapshot(`
        <DocumentFragment>
          <span>
            <span>
              1,234
            </span>
            <span>
              .
            </span>
            <span>
              5
              <span
                style="color: rgb(3, 169, 244);"
              >
                6
              </span>
            </span>
          </span>
        </DocumentFragment>
      `);
    });

    test("Custom negative color on integer", () => {
      const { asFragment } = render(
        <AdvancedNumber
          value={1234}
          previousValue={1245}
          negativeColor="#C238DA"
        />
      );
      expect(asFragment()).toMatchInlineSnapshot(`
        <DocumentFragment>
          <span>
            <span>
              1,2
              <span
                style="color: rgb(194, 56, 218);"
              >
                34
              </span>
            </span>
          </span>
        </DocumentFragment>
      `);
    });

    test("Custom negative color on integer and decimals", () => {
      const { asFragment } = render(
        <AdvancedNumber
          value={1234.56}
          previousValue={1244.56}
          negativeColor="#C238DA"
        />
      );
      expect(asFragment()).toMatchInlineSnapshot(`
        <DocumentFragment>
          <span>
            <span>
              1,2
              <span
                style="color: rgb(194, 56, 218);"
              >
                34
              </span>
            </span>
            <span>
              .
            </span>
            <span>
              <span
                style="color: rgb(194, 56, 218);"
              >
                56
              </span>
            </span>
          </span>
        </DocumentFragment>
      `);
    });

    test("Custom negative color on decimals", () => {
      const { asFragment } = render(
        <AdvancedNumber
          value={1234.56}
          previousValue={1234.58}
          negativeColor="#C238DA"
        />
      );
      expect(asFragment()).toMatchInlineSnapshot(`
        <DocumentFragment>
          <span>
            <span>
              1,234
            </span>
            <span>
              .
            </span>
            <span>
              5
              <span
                style="color: rgb(194, 56, 218);"
              >
                6
              </span>
            </span>
          </span>
        </DocumentFragment>
      `);
    });

    test.todo("Check when options.notation !== 'standard'");
  });

  describe("Muted Decimals", () => {
    test("Feature enabled without required props", () => {
      const { asFragment } = render(
        <AdvancedNumber value={1234.56} showMutedDecimals />
      );
      expect(asFragment()).toMatchInlineSnapshot(`
        <DocumentFragment>
          <span>
            <span>
              1,234
            </span>
            <span>
              .
            </span>
            <span>
              56
            </span>
          </span>
        </DocumentFragment>
      `);
    });

    test("Feature enabled with maxDecimalDigits > significantDecimalDigits", () => {
      const { asFragment } = render(
        <AdvancedNumber
          value={1234.56}
          showMutedDecimals
          significantDecimalDigits={2}
          maxDecimalDigits={6}
        />
      );
      expect(asFragment()).toMatchInlineSnapshot(`
        <DocumentFragment>
          <span>
            <span>
              1,234
            </span>
            <span>
              .
            </span>
            <span>
              56
              <span
                style="opacity: 0.7;"
              >
                0000
              </span>
            </span>
          </span>
        </DocumentFragment>
      `);
    });

    test("Feature enabled with maxDecimalDigits === significantDecimalDigits", () => {
      const { asFragment } = render(
        <AdvancedNumber
          value={1234.56}
          showMutedDecimals
          significantDecimalDigits={4}
          maxDecimalDigits={4}
        />
      );
      expect(asFragment()).toMatchInlineSnapshot(`
        <DocumentFragment>
          <span>
            <span>
              1,234
            </span>
            <span>
              .
            </span>
            <span>
              5600
            </span>
          </span>
        </DocumentFragment>
      `);
    });

    test("Feature enabled with maxDecimalDigits <= significantDecimalDigits", () => {
      const { asFragment } = render(
        <AdvancedNumber
          value={1234.56}
          showMutedDecimals
          significantDecimalDigits={4}
          maxDecimalDigits={2}
        />
      );
      expect(asFragment()).toMatchInlineSnapshot(`
        <DocumentFragment>
          <span>
            <span>
              1,234
            </span>
            <span>
              .
            </span>
            <span>
              5600
            </span>
          </span>
        </DocumentFragment>
      `);
    });

    test.todo(
      "significantDecimalDigits overrides both options.minimumFractionDigits and options.maximumFractionDigits"
    );

    test("Feature is disabled if options.notation !== 'standard'", () => {
      const { asFragment } = render(
        <AdvancedNumber
          value={1234.56}
          options={{ notation: "compact" }}
          showMutedDecimals
          significantDecimalDigits={6}
          maxDecimalDigits={6}
        />
      );
      expect(asFragment()).toMatchInlineSnapshot(`
        <DocumentFragment>
          <span>
            <span>
              1
            </span>
            <span>
              .
            </span>
            <span>
              234560
            </span>
            <span>
              K
            </span>
          </span>
        </DocumentFragment>
      `);
    });

    test.todo(
      "Check impact of minimumSignificantDigits and maximumSignificantDigits"
    );
  });

  describe("Privacy mode", () => {
    test("The root span has style when feature is enabled", () => {
      const { asFragment } = render(
        <AdvancedNumber value={1234.56} privacyMode />
      );
      expect(asFragment()).toMatchInlineSnapshot(`
        <DocumentFragment>
          <span
            style="color: transparent; text-shadow: 0 0 0.5em #7C7C7CD9;"
          >
            <span>
              1,234
            </span>
            <span>
              .
            </span>
            <span>
              56
            </span>
          </span>
        </DocumentFragment>
      `);
    });

    test("The root span doesn't have style when feature is disabled", () => {
      const { asFragment } = render(<AdvancedNumber value={1234.56} />);
      expect(asFragment()).toMatchInlineSnapshot(`
        <DocumentFragment>
          <span>
            <span>
              1,234
            </span>
            <span>
              .
            </span>
            <span>
              56
            </span>
          </span>
        </DocumentFragment>
      `);
    });

    test("Overrides difference style", () => {
      const { asFragment } = render(
        <AdvancedNumber value={1234.56} previousValue={1222.22} privacyMode />
      );
      expect(asFragment()).toMatchInlineSnapshot(`
        <DocumentFragment>
          <span
            style="color: transparent; text-shadow: 0 0 0.5em #7C7C7CD9;"
          >
            <span>
              1,2
              <span>
                34
              </span>
            </span>
            <span>
              .
            </span>
            <span>
              <span>
                56
              </span>
            </span>
          </span>
        </DocumentFragment>
      `);
    });

    test("The privacy style has suctomm color", () => {
      const { asFragment } = render(
        <AdvancedNumber
          value={1234.56}
          privacyMode
          privacyShadowColor="#03A9F4CC"
        />
      );
      expect(asFragment()).toMatchInlineSnapshot(`
        <DocumentFragment>
          <span
            style="color: transparent; text-shadow: 0 0 0.5em #03A9F4CC;"
          >
            <span>
              1,234
            </span>
            <span>
              .
            </span>
            <span>
              56
            </span>
          </span>
        </DocumentFragment>
      `);
    });
  });

  describe("Small decimals", () => {
    test("The decimals span has style when feature is enabled", () => {
      const { asFragment } = render(
        <AdvancedNumber value={1234.56} smallDecimals />
      );
      expect(asFragment()).toMatchInlineSnapshot(`
        <DocumentFragment>
          <span>
            <span>
              1,234
            </span>
            <span>
              .
            </span>
            <span
              style="font-size: 0.8em;"
            >
              56
            </span>
          </span>
        </DocumentFragment>
      `);
    });

    test("The decimals span dones't have style when feature is disabled", () => {
      const { asFragment } = render(<AdvancedNumber value={1234.56} />);
      expect(asFragment()).toMatchInlineSnapshot(`
        <DocumentFragment>
          <span>
            <span>
              1,234
            </span>
            <span>
              .
            </span>
            <span>
              56
            </span>
          </span>
        </DocumentFragment>
      `);
    });
  });

  describe("Styling", () => {
    test("Style props is forwarded to root span", () => {
      const { asFragment } = render(
        <AdvancedNumber value={1234} style={{ fontFamily: "monospace" }} />
      );
      expect(asFragment()).toMatchInlineSnapshot(`
        <DocumentFragment>
          <span
            style="font-family: monospace;"
          >
            <span>
              1,234
            </span>
          </span>
        </DocumentFragment>
      `);
    });

    test("ClassName props is forwarded to root span", () => {
      const { asFragment } = render(
        <AdvancedNumber value={1234} className="advanced-number" />
      );
      expect(asFragment()).toMatchInlineSnapshot(`
        <DocumentFragment>
          <span
            class="advanced-number"
          >
            <span>
              1,234
            </span>
          </span>
        </DocumentFragment>
      `);
    });
  });

  describe("All together", () => {
    test("All feature combined", () => {
      const { asFragment } = render(
        <AdvancedNumber
          value={1234.56789}
          previousValue={1099.01}
          options={{
            style: "currency",
            currency: "USD",
            currencyDisplay: "narrowSymbol",
          }}
          style={{ fontFamily: "monospace" }}
          smallDecimals
          showMutedDecimals
          significantDecimalDigits={2}
          maxDecimalDigits={6}
        />
      );
      expect(asFragment()).toMatchInlineSnapshot(`
        <DocumentFragment>
          <span
            style="font-family: monospace;"
          >
            <span>
              $
            </span>
            <span>
              1,
              <span
                style="color: rgb(76, 175, 80);"
              >
                234
              </span>
            </span>
            <span>
              .
            </span>
            <span
              style="font-size: 0.8em;"
            >
              <span
                style="color: rgb(76, 175, 80);"
              >
                57
                <span
                  style="opacity: 0.7;"
                >
                  0000
                </span>
              </span>
            </span>
          </span>
        </DocumentFragment>
      `);
    });
  });
});
