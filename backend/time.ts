// 1. Get current time in milliseconds (Bitget uses ms)
const nowMs = Date.now();

// 2. Calculate 90 days ago
const ninetyDaysInMs = 90 * 24 * 60 * 60 * 1000;
const ninetyDaysAgoMs = nowMs - ninetyDaysInMs;

// 3. Use these DIRECTLY in the API call (no conversion to seconds)
console.log("Timestamps (Milliseconds):", {
  startTime: ninetyDaysAgoMs, // 90 days ago
  endTime: nowMs              // current time
});
