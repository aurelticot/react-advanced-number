# react-advanced-number

React component formatting and displaying a number with advanced features such as highlighting the differences with the previous value, a privacy mode, etc.

The component has no dependency (except the obvious peer dep of react itself). The formatting relies on the [Intl.NumberFormat API](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat). All the options of the API are provided as props of this component.

## Installation

react-advanced-number is available as an npm package (** ADD LINK TO NPM **)

```
npm install react-advanced-number
```

## Usage

In it's simplest form:

```jsx
import React from "react";
import { AdvancedNumber } from "react-advanced-number";

function App() {
  return <AdvancedNumber value={1234.56} />;
}
```

![Usage](/doc/basic-usage.png)

## Formatting

The component uses the native API [Intl.NumberFormat](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat). All the options are available as props.

```jsx
function App() {
  return (
    <AdvancedNumber
      value={1234.56}
      options={{
        style: "currency",
        currency: "USD",
        currencyDisplay: "narrowSymbol",
      }}
    />
  );
}
```

![Usage](/doc/currency-formatting.png)

_Note_: the prop `significantDecimalDigits`, when provided, is a shorthand to overwrite both the props `options.minimumFractionDigits` and `options.maximumFractionDigits`.

_Note_: Check the browser support for the [Intl.NumberFormat API](https://caniuse.com/?search=NumberFormat).

## Features

### Privacy Mode

Blur the number when enabled. Perfect for sensitive information to be visually hidden/revealled when relevant.

```jsx
function App() {
  return (
    <>
      <AdvancedNumber value={1234.56} privacyMode={false} />
      <AdvancedNumber value={1234.56} privacyMode={true} />
    </>
  );
}
```

![Usage](/doc/privacy-mode.png)

The default shadow color is `#7C7C7CD9`, you can change it with the optional prop `privacyShadowColor`

```jsx
function App() {
  return (
    <AdvancedNumber
      value={1234.56}
      privacyMode={true}
      privacyShadowColor="#03A9F4CC"
    />
  );
}
```

![Usage](/doc/privacy-mode-custom.png)

_Note_: currently, it only changes the CSS properties, the number is still in the markup.

### Diff Highlighting

Highlighting a difference between the value and a previous value. Interesting when displaying changing prices.

```jsx
function App() {
  return <AdvancedNumber value={1234.56} previousValue={1235.89} />;
}
```

![Usage](/doc/diff-highlighting.png)

The default color for a positive difference is `#4CAF50` and for a negative difference is `#F44336`. You can change them with the optional props `positiveColor` and `negativeColor`.

```jsx
function App() {
  const positive = "#03A9F4";
  const negative = "#C238DA";

  return (
    <>
      <AdvancedNumber
        value={1234.56}
        previousValue={1233.89}
        positiveColor={positive}
        negativeColor={negative}
      />
      <AdvancedNumber
        value={1234.56}
        previousValue={1234.59}
        positiveColor={positive}
        negativeColor={negative}
      />
    </>
  );
}
```

![Usage](/doc/diff-highlighting-custom.png)

### Muted Decimals

Displaying muted decimals between a significant number and the total number of decimals. They are slightly lighter to distinguish them from the significant digits.

```jsx
function App() {
  return (
    <AdvancedNumber
      value={1234.56}
      showMutedDecimals
      significantDecimalDigits={2}
      maxDecimalDigits={6}
    />
  );
}
```

![Usage](/doc/muted-decimals.png)

If you wonder why, I think it's a nice way to homogenize the display of values with different significant number of decimals, as it happens often in price values.

```jsx
function App() {
  return (
    <>
      <AdvancedNumber value={1234.567} />
      <AdvancedNumber
        value={1234.567}
        showMutedDecimals
        significantDecimalDigits={2}
        maxDecimalDigits={6}
      />
      <AdvancedNumber
        value={0.1234}
        showMutedDecimals
        significantDecimalDigits={4}
        maxDecimalDigits={6}
      />
    </>
  );
}
```

![Usage](/doc/muted-decimals-comparison.png)

_Note_: The feature requires the following to be enabled: `showMutedDecimals === true`, `maxDecimalDigits > significantDecimalDigits` and `options.notation === 'standard`.

_Note_: `significantDecimalDigits` is actually optional, a default value is defined by the [Intl.NumberFormat API](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat/NumberFormat).

### Small Decimals

Represent the decimals smaller than the interger part for the number.

```jsx
function App() {
  return <AdvancedNumber value={1234.56} smallDecimals />;
}
```

![Usage](/doc/small-decimals.png)

## Styling

The root element is a `span` receiving the props you will pass it to. Therefore `className` and `style` can be use to style the component.

```jsx
function App() {
  return <AdvancedNumber value={1234.56} style={{ fontFamily: "monospace" }} />;
}
```

![Usage](/doc/styling.png)

## All Together

```jsx
function App() {
  return (
    <AdvancedNumber
      value={1234.56}
      previousValue={1233.89}
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
}
```

![Usage](/doc/complete-usage.png)

## License

This project is licensed under the terms of the
[MIT license](/LICENSE).
