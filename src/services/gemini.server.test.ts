import { describe, it, expect } from "vitest";
import { textFromGeminiChunk, describeGeminiError } from "./gemini.server";

describe("gemini parsing", () => {
  it("extracts text and skips thought parts", () => {
    const j = JSON.stringify({ candidates: [{ content: { parts: [{ text: "hidden", thought: true }, { text: "Olá" }] } }] });
    expect(textFromGeminiChunk(j)).toBe("Olá");
  });
  it("surfaces the provider error message instead of hiding it", () => {
    const body = JSON.stringify({ error: { message: "high demand", status: "UNAVAILABLE" } });
    expect(describeGeminiError(503, body)).toBe("Gemini 503 UNAVAILABLE: high demand");
  });
});
