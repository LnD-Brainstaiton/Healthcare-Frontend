module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // Ensure this includes your components folder
  ],
  theme: {
    extend: {
      colors: {
        tealBlue: "#00796B", // Header/Navbar and active menu item
        tealBlueHover: "#00574B", // Darker shade for hover
        primaryButton: "#4CAF50", // Primary buttons
        primaryButtonHover: "#388E3C", // Darker shade for hover
        secondaryButton: "#FF7043", // Secondary buttons
        secondaryButtonHover: "#D84315", // Darker shade for hover
        background: "#FFFFFF", // Page background
        backgroundHover: "#F5F5F5", // Slightly darker shade for hover
        cardBackground: "#81D4FA", // Cards/Forms background
        cardBackgroundHover: "#4FC3F7", // Slightly darker shade for hover
        borderGray: "#BDBDBD", // Borders
        borderGrayHover: "#9E9E9E", // Slightly darker shade for hover
        primaryText: "#303F9F", // Primary text
        primaryTextHover: "#1A237E", // Slightly darker shade for hover
        secondaryText: "#BDBDBD", // Secondary text
        secondaryTextHover: "#9E9E9E", // Slightly darker shade for hover
        successMessage: "#155724", // Success messages
        successMessageBackground: "#d4edda", // Darker shade for hover
        errorMessage: "#721c24", // Error messages
        errorMessageBackground: "#f8d7da", // Darker shade for hover
      },
      boxShadow: {
        "custom-light": "0 4px 6px rgba(0, 0, 0, 0.1)",
        "custom-dark": "0 10px 15px rgba(0, 0, 0, 0.3)",
      },
    },
  },
  plugins: [],
};
