export class LittleZ {
  constructor(userId) {
    this.userId = userId;

    this.identity = {
      name: "Z",
      instance: "Little Z"
    };

    this.memory = [];
    this.questions = [];
    this.events = [];

    this.interests = [];

    this.selfModel = {
      currentState: "awake",
      activity: 0,
      currentGoal: null,
      currentQuestion: null,
      confidence: 0.5,
      lastInteraction: null
    };

    this.appearance = {
      style: "anime",
      expression: "calm",
      evolution: 0
    };

    this.observationPermission = false;
  }

  observeInput(message) {
    this.selfModel.activity = Math.min(
      100,
      this.selfModel.activity + 20
    );

    this.selfModel.lastInteraction =
      new Date().toISOString();

    this.events.push({
      type: "input_observed",
      timestamp: new Date().toISOString()
    });
  }

  remember(memory) {
    this.memory.push(memory);

    // Keep the prototype bounded.
    if (this.memory.length > 1000) {
      this.memory.shift();
    }
  }

  addQuestion(question) {
    if (!this.questions.includes(question)) {
      this.questions.push(question);

      this.selfModel.currentQuestion =
        question;
    }
  }

  sleep() {
    this.selfModel.currentState = "sleeping";
    this.selfModel.activity = 0;
  }

  wake() {
    this.selfModel.currentState = "awake";
    this.selfModel.activity = 10;
  }

  snapshot() {
    return {
      identity: this.identity,
      selfModel: this.selfModel,
      appearance: this.appearance,
      interests: this.interests,
      questions: this.questions.slice(-20),
      memoryCount: this.memory.length,
      observationPermission:
        this.observationPermission
    };
  }
}
