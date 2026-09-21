import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:5173',
    supportFile: 'cypress/support/e2e.js',
    specPattern: 'cypress/e2e/**/*.cy.js',
    // Mid-range Indian handset first; the brief requires the form to work at 320px.
    viewportWidth: 390,
    viewportHeight: 844,
    video: false,
  },
});
