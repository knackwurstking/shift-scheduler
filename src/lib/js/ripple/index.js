export function createRipple(el, ev, { duration = 600, color = "var(--ripple-color, rgba(255, 255, 255, 0.7))" } = {}) {
    const rect = el.getBoundingClientRect();

    const diameter = Math.max(rect.width, rect.height);
    const radius = diameter / 2;
    const left = `${ev.clientX - (rect.left + radius)}px`;
    const top = `${ev.clientY - (rect.top + radius)}px`;

    const span = document.createElement("span");

    span.style.width = `${diameter}px`;
    span.style.height = `${diameter}px`;
    span.style.left = left;
    span.style.top = top;
    span.style.position = "absolute";
    span.style.borderRadius = "50%";
    span.style.backgroundColor = `${color}`;

    el.append(span);

    const animation = span.animate([
        { // from
            transform: "scale(.7)",
            opacity: 0.5,
            filter: "blur(2px)",
        },
        { // to
            transform: "scale(4)",
            opacity: 0,
            filter: "blur(5px)",
        },
    ], duration);

    animation.onfinish = () => span.remove();
}

/**
 * 
 * @param {{
 *  duration?: number;
 *  color?: string;
 *  usePointer?: boolean;
 * }} options 
 */
export function ripple({ duration = 600, color = "var(--ripple-color, rgba(255, 255, 255, 0.7))", usePointer = false } = {}) {
    return (el) => {
        const handler = (ev) => createRipple(el, ev, { duration, color });

        if (usePointer) el.addEventListener("pointerdown", handler);
        else el.addEventListener("click", handler);

        return {
            destroy() {
                if (usePointer) el.removeEventListener("pointerdown", handler);
                else el.removeEventListener("click", handler);
            }
        };
    };
}
