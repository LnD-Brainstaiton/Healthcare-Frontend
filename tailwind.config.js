module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // Ensure this includes your components folder
  ],
  theme: {
    extend: {
      colors: {
        tealBlue: "#00796B", // Header/Navbar and active menu item
        primaryButton: "#4CAF50", // Primary buttons
        secondaryButton: "#FF7043", // Secondary buttons
        background: "#FFFFFF", // Page background
        cardBackground: "#81D4FA", // Cards/Forms background
        borderGray: "#BDBDBD", // Borders
        primaryText: "#303F9F", // Primary text
        secondaryText: "#BDBDBD", // Secondary text
        successMessage: "#4CAF50", // Success messages
        errorMessage: "#FF7043", // Error messages
      },
    },
  },
  plugins: [],
};
