let engine = null;

const loadEngine = async () => {
  try {
    const Module = await import('./engine.js');
    engine = await Module.default({
      locateFile: (path) => {
        if (path.endsWith('.wasm')) return `${self.origin}/wasm/${path}`;
        return path;
      },
    });

    engine.ccall("wasm_init_bitboards", "null", [], []);
    engine.ccall("wasm_init_magic", "null", [], []);
  } catch (err) {
    self.postMessage({ type: 'error', error: err.message });
  }
};

/// Engine Send Command
self.onmessage = (e) => {
  if (!engine) return;

  const result = engine.UTF8ToString(
    engine.ccall("wasm_process_uci_command", "number", ["string"], [e.data])
  );

  self.postMessage({ type: 'result', data: result })
}

loadEngine();
