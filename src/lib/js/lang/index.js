import en from "./en.json";
import de from "./de.json";

/**
 * @typedef LangDataGroups
 * @type {(
 *  "dialog date-picker" |
 *  "dialog day" |
 *  "dialog rhythm" |
 *  "dialog shift" |
 *  "dialog storage" |
 *  "view settings" |
 *  "view pdf" |
 *  "app-bar" |
 *  "footer" |
 *  "buttons" |
 *  "week-days" |
 *  "months"
 * )}
 *
 * @typedef LangData
 * @type {{
 *  "dialog date-picker": { [key: string]: string };
 *  "dialog day": { [key: string]: string };
 *  "dialog rhythm": { [key: string]: string };
 *  "dialog shift": { [key: string]: string };
 *  "dialog storage": { [key: string]: string };
 *  "view settings": { [key: string]: string };
 *  "view pdf": { [key: string]: string };
 *  "app-bar": { [key: string]: string };
 *  "buttons": { [key: string]: string };
 *  "week-days": { [key: string]: string };
 *  "months": { [key: string]: string };
 * }}
 *
 * @typedef Lang
 * @type {{
 *  en: LangData;
 *  de: LangData
 * }}
 */

/** @type {Lang} */
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
 * @param {LangDataGroups} group
 * @param {string} key
 * @returns {string | null}
 */
export function get(group, key) {
    try {
        return data[lang][group][key];
    } catch {
        console.error(`lang (${lang}): "${group}" -> "${key}" not found!`);
        return null;
    }
}

