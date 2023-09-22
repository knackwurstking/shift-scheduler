import "./ripple.css";

/**
 * @typedef RippleAddOptions
 * @type {{
 *  reverse?: boolean,
 *  startFromCenter?: boolean,
 * }}
 */

/**
 *
 * @param {MouseEvent} ev
 * @param {HTMLElement} el
 * @param {RippleAddOptions | null} options
 */
export function add(ev, el, options = null) {
    const rect = el.getBoundingClientRect();

    let cX = ev.clientX - rect.x;
    let cY = ev.clientY - rect.y;

    if (options?.startFromCenter) {
        cX = rect.width / 2;
        cY = rect.height / 2;
    }

    const circle = document.createElement("span");
    const diameter = Math.max(rect.width, rect.height);
    const radius = diameter / 2;

    circle.style.width = circle.style.height = `${diameter}px`;
    circle.style.left = `${cX - radius}px`;
    circle.style.top = `${cY - radius}px`;

    if (el.classList.contains("primary")) {
        circle.classList.add("primary");
    } else if (el.classList.contains("secondary")) {
        circle.classList.add("secondary");
    } else if (el.classList.contains("contrast")) {
        circle.classList.add("contrast");
    }

    if (options?.reverse) circle.classList.add("ripple__reverse");
    circle.classList.add("ripple");

    remove(el);
    el.append(circle);
}

/**
 * 
 * @param {HTMLElement} el 
 */
export function remove(el) {
    for (const r of el.getElementsByClassName("ripple")) {
        r.remove();
    }
}
