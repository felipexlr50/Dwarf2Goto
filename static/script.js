const CAM_ID = 0;
const INTERFACE = 11203;

let geoPosition = null;

getGeoPosition();

async function fetchStellariumData() {
  let stellariumIp = document.getElementById("stellarium_ip").value;
  let stellariumPort = document.getElementById("stellarium_port").value;
  let endpoint = `http://${stellariumIp}:${stellariumPort}/api/main/status`;

  let response = await fetch(endpoint);
  let data = await response.text();

  let targetData = extractTargetData(data);

  document.getElementById("ra").value = targetData.RA;
  document.getElementById("dec").value = targetData.Dec;
  document.getElementById("target_name").value = targetData.name;
}

function extractTargetData(data) {
  let targetData = data.match(
    /RA\/Dec \(on date\):\s*([0-9hms.+°'"-]+)\/([0-9.+°'"-]+)/
  );
  targetData[2] = targetData[2] + '"';
  let targetName = data.match(/<h2>(.*?)<\/h2>/);

  if (targetData && targetName) {
    return { RA: targetData[1], Dec: targetData[2], name: targetName };
  } else return null;
}

async function sendGotoRequest() {
  let raValue = document.getElementById("ra").value;
  let decValue = document.getElementById("dec").value;
  let raFloatValue = convertHMSToDecimalDegrees(raValue, 5);
  let decFloatValue = convertDMSToDecimalDegrees(decValue, 5);

  try {
    let latitude = geoPosition.coords.latitude;
    let longitude = geoPosition.coords.longitude;

    let payload = {
      ra: raFloatValue,
      dec: decFloatValue,
      lat: latitude,
      lon: longitude,
      camId: CAM_ID,
      interface: INTERFACE,
      date: getCurrentDateTime(),
      path: `DWARF_GOTO_${getCurrentTimestampInSeconds()}`,
      // Other required parameters from the documentation
    };

    let dwarfAddress = document.getElementById("dwarf2_ip").value;

    sendJsonMessage(payload, dwarfAddress);
  } catch (error) {
    // Handle any errors that occurred during the request
    console.error(error);
  }
}

function fetchCurrentPosition() {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(
      (position) => resolve(position),
      (error) => reject(error)
    );
  });
}

function getCurrentDateTime() {
  let currentDate = new Date();
  let year = currentDate.getFullYear();
  let month = String(currentDate.getMonth() + 1).padStart(2, "0");
  let day = String(currentDate.getDate()).padStart(2, "0");
  let hours = String(currentDate.getHours()).padStart(2, "0");
  let minutes = String(currentDate.getMinutes()).padStart(2, "0");
  let seconds = String(currentDate.getSeconds()).padStart(2, "0");

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

function getCurrentTimestampInSeconds() {
  return Math.floor(Date.now() / 1000);
}

async function getGeoPosition() {
  geoPosition = await fetchCurrentPosition();
}
