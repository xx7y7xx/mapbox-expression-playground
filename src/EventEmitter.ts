type Listener = (...args: any[]) => void;

export default class EventEmitter {
  listeners: Record<string, Listener[]> = {};

  on(eventName: string, callback: Listener): () => void {
    if (!this.listeners[eventName]) {
      this.listeners[eventName] = [];
    }
    this.listeners[eventName].push(callback);
    return () => {
      this.listeners[eventName] = this.listeners[eventName].filter((listener) => listener !== callback);
    };
  }

  emit(eventName: string, ...args: any[]): void {
    if (!this.listeners[eventName]) {
      return;
    }
    this.listeners[eventName].forEach((listener) => listener(...args));
  }
}
