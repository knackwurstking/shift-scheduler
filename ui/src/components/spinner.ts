export function create(): Create<
    HTMLElement,
    {
        start: (target?: HTMLElement) => void;
        stop: (target?: HTMLElement) => void;
    }
> {
    const el = document.createElement("div");

    el.className = "ui-spinner";

    return {
        element: el,
        methods: {
            start(target?: HTMLElement) {
                (target || document.body).appendChild(el);
            },
            stop(target?: HTMLElement) {
                (target || document.body).removeChild(el);
            },
        },
    };
}
