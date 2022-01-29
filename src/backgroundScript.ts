chrome.runtime.onMessage.addListener(async (message) => {
  // logging
  if (message?.text === "LOG_INFO") {
    console.log(message.payload);
  } else if (message?.text === "LOG_ERROR") {
    console.error(message.payload);
  }
});
