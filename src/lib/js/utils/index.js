/**
 * 
 * @returns {boolean}
 */
export function isAndroid() {
    return (/Android/i).test(navigator.userAgent);
}