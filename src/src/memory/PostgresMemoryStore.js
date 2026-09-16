import pg from "pg";

const { Pool } = pg;

export class PostgresMemoryStore {
  constructor() {
    this.pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: process.env.NODE_ENV === "production"
        ? { rejectUnauthorized: false }
        : false
    });
  }

  async initialize() {
    await this.pool.query(`
      CREATE TABLE IF NOT EXISTS z_memories (
        id UUID PRIMARY KEY,
        user_id TEXT NOT NULL,
        type TEXT NOT NULL,
        input TEXT,
        response TEXT,
        metadata JSONB DEFAULT '{}',
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );

      CREATE INDEX IF NOT EXISTS idx_z_memories_user
      ON z_memories(user_id, created_at DESC);
    `);
  }

  async add(userId, memory) {
    const id = crypto.randomUUID();

    await this.pool.query(
      `
      INSERT INTO z_memories
      (id, user_id, type, input, response, metadata)
      VALUES ($1, $2, $3, $4, $5, $6)
      `,
      [
        id,
        userId,
        memory.type || "memory",
        memory.input || null,
        memory.response || null,
        memory.metadata || {}
      ]
    );

    return {
      id,
      userId,
      ...memory
    };
  }

  async getRecent(userId, limit = 20) {
    const result = await this.pool.query(
      `
      SELECT *
      FROM z_memories
      WHERE user_id = $1
      ORDER BY created_at DESC
      LIMIT $2
      `,
      [userId, limit]
    );

    return result.rows.reverse();
  }

  async count(userId) {
    const result = await this.pool.query(
      `
      SELECT COUNT(*)::int AS count
      FROM z_memories
      WHERE user_id = $1
      `,
      [userId]
    );

    return result.rows[0].count;
  }
}
