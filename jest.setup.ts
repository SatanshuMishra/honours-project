import '@testing-library/jest-dom';

// Extend expect matchers
import { expect } from '@jest/globals';

// Optional: Setup for fetch mocking if needed
global.fetch = jest.fn();

// Optional: Setup for ResizeObserver if you're testing components that use it
global.ResizeObserver = jest.fn().mockImplementation(() => ({
    observe: jest.fn(),
    unobserve: jest.fn(),
    disconnect: jest.fn(),
}));
