// Create a new WebSocket connection
const DWARF_GOTO_IP = "192.168.88.1";
const TEST_WS = "127.0.0.1";

async function sendJsonMessage(obj, ip) {
  let socket = new WebSocket(`ws://${DWARF_GOTO_IP}:9900`);
  if (ip && ip != DWARF_GOTO_IP) {
    socket = new WebSocket(`ws://${ip}:9900`);
  }
  // Convert the object to JSON
  const jsonMessage = JSON.stringify(obj);

  // Wait for the WebSocket connection to be ready
  await new Promise((resolve) => {
    if (socket.readyState === WebSocket.OPEN) {
      resolve();
    } else {
      socket.onopen = resolve;
    }
  });

  // Send the JSON message via WebSocket
  socket.send(jsonMessage);

  // Connection opened event
  socket.addEventListener("open", () => {
    // Send a message to the server
    console.log("Connection opened");
  });

  // Message received event
  socket.addEventListener("message", (event) => {
    // Receive a message from the server
    const response = event.data;
    console.log(`Received response from server: ${response}`);
  });

  // Connection closed event
  socket.addEventListener("close", (event) => {
    console.log("Connection closed");
  });

  // Error event
  socket.addEventListener("error", (error) => {
    console.error("WebSocket error:", error);
  });
}
