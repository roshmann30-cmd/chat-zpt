export class MemoryStore {
  constructor() {
    this.memories = new Map();
  }

  ensureUser(userId) {
    if (!this.memories.has(userId)) {
      this.memories.set(userId, []);
    }

    return this.memories.get(userId);
  }

  add(userId, memory) {
    const userMemories = this.ensureUser(userId);

    userMemories.push({
      id: crypto.randomUUID(),
      ...memory,
      createdAt:
        memory.createdAt ||
        new Date().toISOString()
    });

    return userMemories.at(-1);
  }

  getRecent(userId, limit = 20) {
    const userMemories = this.ensureUser(userId);

    return userMemories.slice(-limit);
  }

  search(userId, query, limit = 10) {
    const userMemories = this.ensureUser(userId);

    const words = query
      .toLowerCase()
      .split(/\s+/)
      .filter(Boolean);

    return userMemories
      .map(memory => {
        const text = JSON.stringify(memory).toLowerCase();

        const score = words.reduce(
          (total, word) =>
            total + (text.includes(word) ? 1 : 0),
          0
        );

        return { memory, score };
      })
      .filter(item => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map(item => item.memory);
  }

  count(userId) {
    return this.ensureUser(userId).length;
  }
}
