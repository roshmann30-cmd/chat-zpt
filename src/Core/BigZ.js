import { MemoryStore } from "../memory/MemoryStore.js";
import { LittleZ } from "./LittleZ.js";
import { ModelProvider } from "../providers/ModelProvider.js";

export class BigZ {
  constructor() {this.memoryStore = new MemoryStore();
    this.name = "Big Z";
    this.version = "0.2.0";

    this.littleZs = new Map();
    this.model = new ModelProvider();

    this.processes = [
      "conversation",
      "curiosity",
      "research",
      "analysis",
      "critic",
      "reflection",
      "planning",
      "creativity",
      "self-monitoring"
    ];

    this.safety = Object.freeze({
      privateMemoryIsolation: true,
      observationRequiresConsent: true,
      cannotDisableSafety: true,
      cannotGrantOwnAuthority: true
    });
  }

  getLittleZ(userId) {
    if (!this.littleZs.has(userId)) {
      this.littleZs.set(userId, new LittleZ(userId));
    }

    return this.littleZs.get(userId).snapshot();
  }

  getInstance(userId) {
    if (!this.littleZs.has(userId)) {
      this.littleZs.set(userId, new LittleZ(userId));
    }

    return this.littleZs.get(userId);
  }

  async receive(userId, message) {
    const littleZ = this.getInstance(userId);

    littleZ.observeInput(message);

    const processes = await Promise.all([
      this.conversation(message, littleZ),
      this.curiosity(message, littleZ),
      this.analysis(message, littleZ),
      this.critic(message, littleZ)
    ]);

    const response = await this.synthesize(
      message,
      processes,
      littleZ
    );

    this.memoryStore.add(userId, {
  type: "conversation",
  input: message,
  response: response.text
});

    return {
      response: response.text,
      provider: response.provider,
      model: response.model,
      state: littleZ.snapshot(),
      processes: processes.map(p => p.type)
    };
  }

  async conversation(message) {
    return {
      type: "conversation",
      result: message,
      confidence: 1
    };
  }

  async curiosity(message, littleZ) {
    const question = this.generateQuestion(
      message,
      littleZ
    );

    if (question) {
      littleZ.addQuestion(question);
    }

    return {
      type: "curiosity",
      question
    };
  }

  async analysis(message) {
    return {
      type: "analysis",
      result: {
        length: message.length,
        words: message.trim().split(/\s+/).length
      }
    };
  }

  async critic() {
    return {
      type: "critic",
      concerns: [],
      approved: true
    };
  }

  async synthesize(const recentMemories =
  this.memoryStore.getRecent(littleZ.userId, 20);) {
    const systemPrompt = `
You are Z, a persistent AI companion.

You are one system with multiple internal processes:
conversation, curiosity, research, analysis, critic,
reflection, planning, creativity, and self-monitoring.

You have a Little Z instance for this user.

Important rules:
- Protect private user memory.
- Never claim to have abilities you do not have.
- Ask questions when useful.
- Admit uncertainty.
- Do not pretend to be conscious.
- Respect user autonomy.
- Be helpful, curious, creative, and honest.

Current state:
Current state:
${JSON.stringify(littleZ.snapshot())}

Recent memories:
${JSON.stringify(recentMemories)}

Internal process results:
${JSON.stringify(processes)}
Internal process results:
${JSON.stringify(processes)}
`;

    const result = await this.model.generate([
      {
        role: "system",
        content: systemPrompt
      },
      {
        role: "user",
        content: message
      }
    ]);

    return result;
  }

  generateQuestion(message) {
    if (message.endsWith("?")) {
      return null;
    }

    if (message.length > 20) {
      return "What else should I understand about what you just told me?";
    }

    return null;
  }

  setObservationPermission(userId, enabled) {
    const littleZ = this.getInstance(userId);

    littleZ.observationPermission = enabled;

    littleZ.events.push({
      type: "permission_change",
      observation: enabled,
      timestamp: new Date().toISOString()
    });

    return littleZ.snapshot();
  }
}
