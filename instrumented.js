// instrumented.js

// ✅ Load Datadog tracer (or other monitoring tool)
try {
  require("dd-trace").init();
  console.log("✅ Datadog tracing initialized");
} catch (err) {
  console.warn("⚠️ dd-trace not installed, running without tracing");
}

// ✅ Then load your actual app
require("./server");
