import '@testing-library/jest-dom/vitest';
import { afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';
import { useLoanStore } from '../store/useLoanStore';

afterEach(() => {
  cleanup();
  localStorage.clear();
  useLoanStore.getState().reset();
});
