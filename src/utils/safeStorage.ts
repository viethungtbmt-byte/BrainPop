/**
 * Bulletproof storage adapter with automatic in-memory fallback.
 * Prevents DOMException SecurityError in sandboxed iframes, private browsing,
 * and restricted environments, while maintaining session state across components.
 */

class MemoryStorageBackend implements Storage {
  private store: Map<string, string> = new Map();

  get length(): number {
    return this.store.size;
  }

  clear(): void {
    this.store.clear();
  }

  getItem(key: string): string | null {
    return this.store.has(key) ? (this.store.get(key) ?? null) : null;
  }

  key(index: number): string | null {
    const keys = Array.from(this.store.keys());
    return keys[index] ?? null;
  }

  removeItem(key: string): void {
    this.store.delete(key);
  }

  setItem(key: string, value: string): void {
    this.store.set(key, String(value));
  }
}

function createSafeStorage(type: "localStorage" | "sessionStorage"): Storage {
  const fallback = new MemoryStorageBackend();

  // Test if native storage is accessible and functional
  const getNativeStorage = (): Storage | null => {
    if (typeof window === "undefined") return null;
    try {
      const storage = window[type];
      if (!storage) return null;
      const testKey = "__storage_test__" + Math.random().toString(36);
      storage.setItem(testKey, "1");
      storage.removeItem(testKey);
      return storage;
    } catch {
      return null;
    }
  };

  let nativeAvailable = getNativeStorage() !== null;

  return {
    get length(): number {
      try {
        if (nativeAvailable) {
          const storage = window[type];
          if (storage) return storage.length;
        }
      } catch {
        nativeAvailable = false;
      }
      return fallback.length;
    },

    clear(): void {
      try {
        if (nativeAvailable) {
          const storage = window[type];
          if (storage) storage.clear();
        }
      } catch {
        nativeAvailable = false;
      }
      fallback.clear();
    },

    getItem(key: string): string | null {
      try {
        if (nativeAvailable) {
          const storage = window[type];
          if (storage) {
            const val = storage.getItem(key);
            if (val !== null) return val;
          }
        }
      } catch {
        nativeAvailable = false;
      }
      return fallback.getItem(key);
    },

    key(index: number): string | null {
      try {
        if (nativeAvailable) {
          const storage = window[type];
          if (storage) return storage.key(index);
        }
      } catch {
        nativeAvailable = false;
      }
      return fallback.key(index);
    },

    removeItem(key: string): void {
      try {
        if (nativeAvailable) {
          const storage = window[type];
          if (storage) storage.removeItem(key);
        }
      } catch {
        nativeAvailable = false;
      }
      fallback.removeItem(key);
    },

    setItem(key: string, value: string): void {
      try {
        if (nativeAvailable) {
          const storage = window[type];
          if (storage) {
            storage.setItem(key, String(value));
          }
        }
      } catch {
        nativeAvailable = false;
      }
      fallback.setItem(key, String(value));
    },
  };
}

export const safeLocalStorage: Storage = createSafeStorage("localStorage");
export const safeSessionStorage: Storage = createSafeStorage("sessionStorage");
