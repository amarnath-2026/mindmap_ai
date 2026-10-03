import { AIProviderConfig } from "@/types";

export function getStoredAIConfig(): AIProviderConfig {
  if (typeof window === "undefined") {
    return { provider: "demo", groundedMode: true };
  }
  try {
    const stored = localStorage.getItem("mindmap_ai_config");
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (e) {
    console.error("Failed to read AI config from localStorage", e);
  }
  return { provider: "demo", groundedMode: true };
}

export function saveAIConfig(config: AIProviderConfig): void {
  if (typeof window !== "undefined") {
    localStorage.setItem("mindmap_ai_config", JSON.stringify(config));
  }
}

/**
 * Universal call to LLM API (Gemini, OpenAI, Anthropic, or local structured synthesis)
 */
export async function callLLM(
  prompt: string,
  systemPrompt: string,
  config: AIProviderConfig = getStoredAIConfig()
): Promise<string> {
  const { provider, apiKey, customUrl, model } = config;

  if (provider === "demo" || !apiKey) {
    // If no key or demo mode, return null to signal fallback to intelligent local structuring agent
    return "";
  }

  try {
    if (provider === "openai" || provider === "custom") {
      const endpoint = customUrl || "https://api.openai.com/v1/chat/completions";
      const modelName = model || "gpt-4o-mini";
      const res = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: modelName,
          response_format: { type: "json_object" },
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: prompt }
          ],
          temperature: 0.2
        })
      });
      const data = await res.json();
      return data.choices?.[0]?.message?.content || "";
    } else if (provider === "gemini") {
      const modelName = model || "gemini-1.5-flash";
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`;
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [{ text: `${systemPrompt}\n\nTask:\n${prompt}` }]
            }
          ],
          generationConfig: {
            responseMimeType: "application/json",
            temperature: 0.2
          }
        })
      });
      const data = await res.json();
      return data.candidates?.[0]?.content?.parts?.[0]?.text || "";
    } else if (provider === "anthropic") {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": apiKey,
          "anthropic-version": "2023-06-01"
        },
        body: JSON.stringify({
          model: model || "claude-3-5-sonnet-20240620",
          max_tokens: 4000,
          system: systemPrompt,
          messages: [{ role: "user", content: prompt }]
        })
      });
      const data = await res.json();
      return data.content?.[0]?.text || "";
    }
  } catch (err) {
    console.error(`LLM Call Error (${provider}):`, err);
  }

  return "";
}
