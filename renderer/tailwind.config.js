const colors = require("tailwindcss/colors");

module.exports = {
    content: [
        "./renderer/pages/**/*.{js,ts,jsx,tsx}",
        "./renderer/components/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        colors: {
            white: colors.white,
            gray: colors.gray,
            blue: colors.blue,
        },
        extend: {
            colors: {
                neutral: {
                    100: "#F5F7FA",
                    200: "#ABBED1",
                    300: "#89939E",
                    400: "#717171",
                    500: "#4D4D4D",
                    600: "#212121",
                },
                primary: {
                    100: "#EEF5FC",
                    200: "#DBEDFF",
                    300: "#28AAE1",
                    400: "#2893E1",
                    500: "#0671E0",
                    600: "#2A3B8E",
                },
                success: {
                    100: "#F1FBF8",
                    200: "#84DFC1",
                    300: "#32C997",
                    400: "#009262",
                    500: "#1B6E53",
                    600: "#115B43",
                },
                warning: {
                    100: "#FFF8EC",
                    200: "#FFD596",
                    300: "#FFC670",
                    400: "#FFB240",
                    500: "#FFA826",
                    600: "#E48900",
                    700: "#FF6500",
                },
                danger: {
                    100: "#FFF1F0",
                    200: "#F0857D",
                    300: "#FF5A4F",
                    400: "#E02B1D",
                    500: "#E01507",
                    600: "#C33025",
                },

                transparent: "transparent",
                current: "currentColor",
                black: colors.black,
                white: colors.white,
                gray: colors.gray,
                green: colors.emerald,
                purple: colors.violet,
                yellow: colors.amber,
                pink: colors.fuchsia,
                red: colors.red,
            },
        },
    },
    plugins: [
        "prettier-plugin-tailwindcss",
        function ({ addUtilities }) {
            addUtilities(
                {
                    // flat
                    ".neumorphism-gray-ss": {
                        boxShadow:
                            "2px 2px 5px #aeafb0, inset 0 0 0 #aeafb0,\
                            -2px -2px 3px #ffffff, inset 0 0 0 #ffffff",
                    },
                    ".neumorphism-gray-xs": {
                        boxShadow:
                            "3px 3px 7px #aeafb0, inset 0 0 0 #aeafb0,\
                            -3px -3px 7px #ffffff, inset 0 0 0 #ffffff",
                    },
                    ".neumorphism-gray-sm": {
                        boxShadow:
                            "7px 7px 14px #aeafb0, inset 0 0 0 #aeafb0,\
                            -7px -7px 14px #ffffff, inset 0 0 0 #ffffff",
                    },
                    ".neumorphism-gray-xs-pressed": {
                        boxShadow:
                            "0 0 0 #aeafb0,inset 2px 2px 7px #aeafb0,\
                            0 0 0 #ffffff,inset -1px -1px 3px #ffffff",
                    },
                    ".neumorphism-gray-xs-concave": {
                        boxShadow:
                            "3px 3px 7px #aeafb0, inset 3px 3px 7px #aeafb0,\
                            -3px -3px 7px #ffffff, inset -3px -3px 7px #ffffff",
                    },
                    // flat
                    ".neumorphism-primary-sm": {
                        boxShadow:
                            "7px 7px 14px #aeafb0, inset 0 0 0 #aeafb0,\
                            -7px -7px 14px #a8e5ff, inset 0 0 0 #a8e5ff",
                    },
                    // concave
                    ".neumorphism-primary-concave": {
                        boxShadow:
                            "3px 3px 7px #aeafb0, inset 3px 3px 7px #1f71d9,\
                            -3px -3px 7px #ffffff, inset -3px -3px 7px #2999ff",
                    },
                    ".neumorphism-primary-pressed": {
                        boxShadow:
                            "0 0 0 #0671E0,inset 2px 2px 7px #0671E0,\
                            0 0 0 #50CAFF,inset -1px -1px 3px #50CAFF",
                    },
                    ".neumorphism-yellow-sm": {
                        boxShadow:
                            "6px 6px 10px #ffc875 , inset 0 0 0 #ffc875 ,\
                                -3px -3px 10px #FFD596, inset 0 0 0 #FFD596",
                    },
                },
                ["responsive", "hover", "focus", "active"]
            );
        },
    ],
};
