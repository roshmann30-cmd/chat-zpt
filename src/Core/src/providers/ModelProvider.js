export class ModelProvider {
  constructor() {
    this.apiKey = process.env.MODEL_API_KEY;
    this.baseUrl =
      process.env.MODEL_BASE_URL ||
      "https://api.openai.com/v1";

    this.model =
      process.env.MODEL_NAME ||
      "gpt-5.6";
  }

  get configured() {
    return Boolean(this.apiKey);
  }

  async generate(messages, options = {}) {
    if (!this.apiKey) {
      return {
        text: "Z's model provider isn't connected yet.",
        provider: "fallback",
        model: null
      };
    }

    const response = await fetch(
      `${this.baseUrl}/chat/completions`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          model: options.model || this.model,
          messages,
          temperature:
            options.temperature ?? 0.7
        })
      }
    );

    if (!response.ok) {
      const errorText = await response.text();

      throw new Error(
        `Model provider error ${response.status}: ${errorText}`
      );
    }

    const data = await response.json();

    return {
      text:
        data.choices?.[0]?.message?.content ||
        "",
      provider: "model",
      model:
        data.model || options.model || this.model
    };
  }
}
