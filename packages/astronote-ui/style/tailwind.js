const colors = require("tailwindcss/colors");

const gray = {
  50: "#F9FAFA",
  100: "#F1F1F2",
  200: "#E7E7E8",
  300: "#D3D4D5",
  400: "#ABADAF",
  500: "#7D7F83",
  600: "#52555A",
  700: "#33373D",
  800: "#1D2025",
  900: "#171A1D",
};

module.exports = function (app, options) {
  let config = {
    content: [
      !options?.ignorePackages &&
        "../../packages/*/src/**/*.{js,ts,jsx,tsx,html}",
      app && `../../apps/${app}/src/**/*.{js,jsx,ts,tsx,html}`,
    ],
    darkMode: options?.darkMode || "class",
    theme: {
      extend: {
        colors: {
          gray: colors.zinc,
          primary: colors.purple,
        },
      },
    },
  };

  config.plugins = [
    require("@tailwindcss/line-clamp"),
    require("@tailwindcss/typography"),
  ];

  return config;
};
