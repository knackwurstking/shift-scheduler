import { html } from "@lib";
import { Create } from "@types";

const innerHTML = html`
    <div class="name" style="text-wrap: nowrap"></div>
    <div class="short-name"></div>
`;

export function create(): Create<
    HTMLElement,
    {
        queryName: () => HTMLDivElement;
        queryShortName: () => HTMLDivElement;
        isActive(): boolean;
        active: (state: boolean) => void;
    }
> {
    const el = document.createElement("div");

    el.className =
        "shift-card ui-flex-grid-item ui-none-select ui-border ui-padding";

    el.style.setProperty("--flex", "0");
    el.style.width = "fit-content";
    el.style.minHeight = "calc(1.6rem * 2 + var(--ui-spacing) * 2)";
    el.style.cursor = "pointer";

    el.innerHTML = innerHTML;

    return {
        element: el,
        methods: {
            queryName() {
                return el.querySelector<HTMLDivElement>(`.name`)!;
            },

            queryShortName() {
                return el.querySelector<HTMLDivElement>(`.short-name`)!;
            },

            isActive() {
                return el.hasAttribute("active");
            },

            active(state: boolean) {
                if (state) {
                    el.setAttribute("active", "");
                    el.scrollIntoView();
                } else {
                    el.removeAttribute("active");
                }
            },
        },
    };
}
