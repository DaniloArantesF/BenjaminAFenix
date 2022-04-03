export interface Registry {
  unregister: (args?:any) => void;
}

export interface Callable {
  [key: string]: (args?:any) => void;
}

export interface Subscriber {
  [key: string]: Callable;
}

export interface IEventBus {
  dispatch<T>(event: string, arg?: T): void;
  register(event: string, callback: (args?:any) => void): Registry;
}

// TODO: add namespace
export class EventBus implements IEventBus {
  // Singleton
  private static instance?: EventBus = undefined;
  private static nextId = 0;
  private subscribers: Subscriber;


  private constructor() {
    this.subscribers = {};
  }

  public dispatch<T>(event: string, arg?: T) {
    const subscriber = this.subscribers[event];

    if (subscriber === undefined) return;

    // Fire up callback from subscribers
    Object.keys(subscriber).forEach((key) => subscriber[key](arg));
  }

  public register(event: string, callback: (args?:any) => void) {
    const id = this.getNextId();

    if (!this.subscribers[event]) {
      this.subscribers[event] = {};
    }

    this.subscribers[event][id] = callback;

    return {
      // Remove subscriber and delete event if no others
      unregister: () => {
        delete this.subscribers[event][id];

        if (Object.keys(this.subscribers[event]).length === 0) {
          delete this.subscribers[event];
        }
      },
    };
  }

  private getNextId(): number {
    return EventBus.nextId++;
  }

  public static getInstance(): EventBus {
    if (this.instance === undefined) {
      this.instance = new EventBus();
    }
    return this.instance;
  }
}
