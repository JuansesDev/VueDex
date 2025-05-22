# Testing Guide for VueDex

This document explains how to run and write tests for the VueDex application.

## Running Tests

VueDex uses Vitest for unit testing. You can run the tests using the following commands:

### Run all tests

```bash
# Using npm
npm test
# or
npm run test

# Using yarn
yarn test
```

### Run tests in watch mode

This will re-run tests when files change:

```bash
# Using npm
npm run test:watch
# or
npm test -- --watch

# Using yarn
yarn test --watch
```

### Run tests with coverage report

To generate test coverage reports:

```bash
# Using npm
npm run test:coverage
# or
npm test -- --coverage

# Using yarn
yarn test --coverage
```

### Run a specific test file

To run tests in a specific file:

```bash
# Using npm
npm test -- src/components/__tests__/PokemonCard.spec.js

# Using yarn
yarn test src/components/__tests__/PokemonCard.spec.js
```

## Test Output

When running tests, you'll see output in your terminal indicating:

- Number of test suites and tests run
- Passing and failing tests
- Time taken to run the tests
- Code coverage (if you used the --coverage flag)

## Writing Tests

Tests are located in `__tests__` folders adjacent to the code they're testing. For example:

- Component tests: `src/components/__tests__/`
- View tests: `src/views/__tests__/`
- Store tests: `src/stores/__tests__/`
- Service tests: `src/services/__tests__/`

Each test file follows the naming convention of `[name].spec.js`.

### Example Test Structure

```javascript
import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import YourComponent from '../YourComponent.vue';

describe('YourComponent', () => {
  it('renders correctly', () => {
    const wrapper = mount(YourComponent);
    // Test assertions here
    expect(wrapper.exists()).toBe(true);
  });
  
  // More test cases...
});
```

## Test Configuration

Test configuration is defined in the `vite.config.js` file in the project root. Any adjustments to test setup should be made there.
