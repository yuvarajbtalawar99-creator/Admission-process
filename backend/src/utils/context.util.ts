import { AsyncLocalStorage } from 'async_hooks';

export interface UserContext {
  userId: string;
  role: string;
}

export const contextStorage = new AsyncLocalStorage<UserContext>();
