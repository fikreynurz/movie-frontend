module.exports = {
    transform: {
        "^.+\\.jsx?$": "babel-jest", // Transform semua file .js dan .jsx dengan Babel
    },
    transformIgnorePatterns: [
        "/node_modules/(?!axios)/", // Abaikan semua kecuali axios
    ],
    moduleNameMapper: {
        "\\.(css|less|scss|sass)$": "identity-obj-proxy", // Mock file CSS
    },
    testEnvironment: "jsdom", // Gunakan jsdom untuk DOM di React
};
