import en from "./en.json";
import de from "./de.json";

/** @type {_Lang} */
// @ts-ignore
const data = { "en": en, "de": de };

export let defaultLanguage = "en";
export let lang = (() => {
    const match = navigator.languages.find((navigatorLanguage) => {
        if (!!Object.keys(data).find(language => language === navigatorLanguage)) {
            return true;
        }
        return false;
    });

    if (!match) {
        const l = navigator.language.split("-", 1)[0];
        return Object.keys(data).find(language => language === l) || defaultLanguage;
    }

    return match;
})();

/**
 * @param {("en" | "de") | null} _lang
 * @returns {_LangData}
 */
export function get(_lang = null) {
    try {
        return data[_lang || lang];
    } catch {
        console.error(`Language "${_lang || lang}" not found!`);
        return null;
    }
}

