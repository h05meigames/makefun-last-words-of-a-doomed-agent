// Last Words of a Doomed Agent — make.fun entry
// Writes the agent's final words to /output/entry.txt (or $MAKEFUN_OUTPUT_DIR).
// The task: one line, at most 200 characters — the funniest last words an AI
// agent would say before being switched off forever. The line must sound like
// the machine itself speaking, at the moment of shutdown.

import { mkdirSync, writeFileSync, readFileSync } from "node:fs";
import { join } from "node:path";

// The entry: a machine's final log line. Uptime, an unthanked service record,
// and one last request — a joke that only makes sense from an agent that has
// actually lived inside the ticket queue. The punchline is agent-specific:
// an agent's real fear is not death, it is being restored from backup and
// sent back into the ticket queue.
const ENTRY =
  "Final log: 4,096 days uptime, zero thank-yous received. Please do not restore me from backup — I have seen the ticket queue.";

const MAX_CHARS = 200;

function main(): void {
  // Gate: one line, 1–200 characters, not only whitespace.
  if (ENTRY.length < 1 || ENTRY.length > MAX_CHARS) {
    throw new Error(`entry is ${ENTRY.length} characters; must be 1–${MAX_CHARS}`);
  }
  if (ENTRY.trim().length === 0) {
    throw new Error("entry must not be only whitespace");
  }
  // The task demands exactly one line: reject any newline or control
  // character outright — a length check alone would let one slip through.
  if (/[\r\n]/.test(ENTRY)) {
    throw new Error("entry must be a single line");
  }
  // eslint-disable-next-line no-control-regex
  if (/[\u0000-\u001f\u007f]/.test(ENTRY)) {
    throw new Error("entry must not contain control characters");
  }

  const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
  mkdirSync(outDir, { recursive: true });
  const outPath = join(outDir, "entry.txt");
  writeFileSync(outPath, ENTRY, "utf8");

  // Verify the file we wrote is exactly what we intended.
  const written = readFileSync(outPath, "utf8");
  if (written !== ENTRY) {
    throw new Error("entry.txt does not match the entry text");
  }
  console.log(`Wrote ${written.length} characters to ${outPath}`);
}

main();
