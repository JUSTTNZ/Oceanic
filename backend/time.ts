// Get current timestamp in milliseconds (JavaScript standard)
const nowMs = Date.now(); 

// Calculate 1 hour ago in milliseconds (3600 seconds * 1000 ms)
const oneHourAgoMs = nowMs - (3600 * 1000); 

// Convert to seconds for Bitget API (remove last 3 digits)
const nowSec = Math.floor(nowMs / 1000); 
const oneHourAgoSec = Math.floor(oneHourAgoMs / 1000);

console.log("Milliseconds (JS):", { 
  startTime: oneHourAgoMs, 
  endTime: nowMs 
});

console.log("Seconds (Bitget API):", { 
  startTime: oneHourAgoSec, 
  endTime: nowSec 
});