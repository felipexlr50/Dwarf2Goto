function roundExposure(value) {
  let newValue = 100000;
  if (value > 0.8) {
    newValue = Math.round(value);
  } else if (value > 0.08) {
    newValue = Math.round(value * 10) / 10;
  } else if (value > 0.008) {
    newValue = Math.round(value * 100) / 100;
  } else if (value > 0.0008) {
    newValue = Math.round(value * 1000) / 1000;
  } else {
    newValue = Math.round(value * 10000) / 10000;
  }

  return newValue;
}

function olderThanHours(prevTime, hours) {
  const oneDay = hours * 60 * 60 * 1000;
  return Date.now() - prevTime > oneDay;
}

function range(start, stop, step) {
  return Array.from(
    { length: (stop - start) / step + 1 },
    (_, i) => start + i * step
  );
}

function convertHMSToDecimalDegrees(text, decimalPlaces = 5) {
  let hmsMatches = text.match(/(\d{1,2})[hH](\d{1,2})[mM]([0-9.]+)[sS]/);
  if (hmsMatches) {
    let [_, hour, minute, second] = hmsMatches;
    let decimal =
      (Number(hour) + Number(minute) / 60 + Number(second) / 3600) * 15;
    return formatFloatToDecimalPlaces(decimal, decimalPlaces);
  }

  let decimalMatches = text.match(/([0-9.]+)/);
  if (decimalMatches) {
    return formatFloatToDecimalPlaces(Number(decimalMatches[1]), decimalPlaces);
  }
}

function convertDMSToDecimalDegrees(text, decimalPlaces = 5) {
  let dmsMatches = text.match(/(\d{1,3})°(\d{1,2})'([0-9.]+)"/);
  if (dmsMatches) {
    let [_, degree, minute, second] = dmsMatches;
    let decimal = Number(degree) + Number(minute) / 60 + Number(second) / 3600;
    return formatFloatToDecimalPlaces(decimal, decimalPlaces);
  }

  let decimalMatches = text.match(/([0-9.]+)/);
  if (decimalMatches) {
    return formatFloatToDecimalPlaces(Number(decimalMatches[1]), decimalPlaces);
  }
}

function formatFloatToDecimalPlaces(value, decimalPlaces) {
  return Number(
    Math.round(parseFloat(value + "e" + decimalPlaces)) + "e-" + decimalPlaces
  );
}
