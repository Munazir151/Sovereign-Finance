import { useState, useEffect } from 'react';

/**
 * Custom hook for persisting state to localStorage.
 */
export function useLocalStorage<T>(key: string, initialValue: T) {
  // State to store our value
  // Pass initial state function to useAction so logic is only executed once
  const [storedValue, setStoredValue] = useState<T>(initialValue);

  // Once mounted, we read from localStorage
  // This avoids hydration mismatch errors in Next.js
  useEffect(() => {
    try {
      const item = window.localStorage.getItem(key);
      if (item) {
        setStoredValue(JSON.parse(item));
      }
    } catch (error) {
      console.warn('Error reading localStorage', error);
    }
  }, [key]);

  // Return a wrapped version of useState's setter function that
  // persists the new value to localStorage.
  const setValue = (value: T | ((val: T) => T)) => {
    try {
      // Allow value to be a function so we have same API as useState
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.warn('Error setting localStorage', error);
    }
  };

  return [storedValue, setValue] as const;
}

/**
 * Custom hook to detect when a specific key (or key combination) is pressed.
 */
export function useKeyPress(targetKey: string, ctrlOrCmdKey: boolean = false) {
  const [keyPressed, setKeyPressed] = useState(false);

  useEffect(() => {
    const downHandler = (e: KeyboardEvent) => {
      // Check for modifier keys
      if (ctrlOrCmdKey && !(e.ctrlKey || e.metaKey)) return;
      if (e.key.toLowerCase() === targetKey.toLowerCase()) {
        e.preventDefault();
        setKeyPressed(true);
      }
    };

    const upHandler = (e: KeyboardEvent) => {
      if (ctrlOrCmdKey && !(e.ctrlKey || e.metaKey)) return;
      if (e.key.toLowerCase() === targetKey.toLowerCase()) {
        setKeyPressed(false);
      }
    };

    window.addEventListener('keydown', downHandler);
    window.addEventListener('keyup', upHandler);

    return () => {
      window.removeEventListener('keydown', downHandler);
      window.removeEventListener('keyup', upHandler);
    };
  }, [targetKey, ctrlOrCmdKey]);

  return keyPressed;
}
