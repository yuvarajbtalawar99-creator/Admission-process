import redisClient from '../config/redis';

/**
 * Service to manage authentication sessions using Redis (or in-memory fallback)
 */
class RedisService {
  private readonly SESSION_PREFIX = 'session:';
  // 7 Days in seconds
  private readonly REFRESH_TOKEN_EXPIRY = 7 * 24 * 60 * 60; 

  /**
   * Stores a refresh token session for a user.
   * If a user logs in again, this overwrites their previous session,
   * enforcing a single active session (or you can append if you want multi-device).
   */
  async setSession(userId: string, refreshToken: string): Promise<void> {
    const key = `${this.SESSION_PREFIX}${userId}`;
    await redisClient.setex(key, this.REFRESH_TOKEN_EXPIRY, refreshToken);
  }

  /**
   * Retrieves the current active refresh token for a user.
   */
  async getSession(userId: string): Promise<string | null> {
    const key = `${this.SESSION_PREFIX}${userId}`;
    return await redisClient.get(key);
  }

  /**
   * Revokes (deletes) a user's session upon logout or security event.
   */
  async deleteSession(userId: string): Promise<void> {
    const key = `${this.SESSION_PREFIX}${userId}`;
    await redisClient.del(key);
  }
}

export default new RedisService();
