import { EventEmitter } from 'events';

class AppEventEmitter extends EventEmitter {
  private static instance: AppEventEmitter;

  private constructor() {
    super();
    // Increase listener limits if needed
    this.setMaxListeners(50);
  }

  public static getInstance(): AppEventEmitter {
    if (!AppEventEmitter.instance) {
      AppEventEmitter.instance = new AppEventEmitter();
    }
    return AppEventEmitter.instance;
  }
}

export const appEmitter = AppEventEmitter.getInstance();

export const emitEvent = (eventName: string, payload: any) => {
  console.log(`[Event Emitted] ${eventName}:`, JSON.stringify(payload, null, 2));
  appEmitter.emit(eventName, payload);
};

export const subscribeEvent = (eventName: string, callback: (payload: any) => void) => {
  appEmitter.on(eventName, callback);
};
