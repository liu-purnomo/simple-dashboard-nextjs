/* eslint-disable @typescript-eslint/no-require-imports */
const path = require("path");
const supportedLngs = ["id", "en"];
import themeConfig from "theme.config";
export const ni18nConfig = {
    fallbackLng: [themeConfig.locale || "en"],
    supportedLngs,
    ns: ["translation"],
    react: { useSuspense: false },
    backend: {
        loadPath: path.resolve(`/locales/{{lng}}.json`),
    },
};
