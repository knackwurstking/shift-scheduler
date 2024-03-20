import en from "./en.json";
import de from "./de.json";

/** @type {_Lang} */
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
 * @param {_LangDataGroups} group
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

