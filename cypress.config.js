const { defineConfig } = require("cypress");


module.exports = defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3000', // Make sure your app is running on this URL
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});
