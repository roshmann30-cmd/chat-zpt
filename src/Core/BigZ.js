import { LittleZ } from "./LittleZ.js";

export class BigZ {
  constructor() {
    this.name = "Big Z";
    this.version = "0.1.0";

    this.littleZs = new Map();

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
      this.littleZs.set(
        userId,
        new LittleZ(userId)
      );
    }

    return this.littleZs.get(userId).snapshot();
  }

  getInstance(userId) {
    if (!this.littleZs.has(userId)) {
      this.littleZs.set(
        userId,
        new LittleZ(userId)
      );
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

    littleZ.remember({
      type: "conversation",
      input: message,
      response,
      timestamp: new Date().toISOString()
    });

    return {
      response,
      state: littleZ.snapshot(),
      processes: processes.map(p => p.type)
    };
  }

  async conversation(message, littleZ) {
    return {
      type: "conversation",
      result: `I received: ${message}`,
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

  async critic(message) {
    return {
      type: "critic",
      concerns: [],
      approved: true
    };
  }

  async synthesize(message, processes, littleZ) {
    const curiosity = processes.find(
      p => p.type === "curiosity"
    );

    let response =
      `I'm here. You said: "${message}"`;

    if (curiosity?.question) {
      response += `\n\nThat made me curious about something: ${curiosity.question}`;
    }

    return response;
  }

  generateQuestion(message, littleZ) {
    if (message.endsWith("?")) {
      return null;
    }

    if (message.length > 20) {
      return `What else should I understand about what you just told me?`;
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
