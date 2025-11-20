// FIX: Removed `/// <reference types="vite/client" />`.
// This project uses `process.env` (polyfilled for the client) instead of `import.meta.env`.
// The original line was causing a type resolution error and was not needed.
