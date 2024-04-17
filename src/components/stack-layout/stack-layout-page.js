const template = document.createElement("template");
template.innerHTML = `
    <style>
        :host {
            display: block;
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            opacity: 0;
            transition: opacity 0.5s ease;
        }

        :host {
            opacity: 1;
            animation: fade-in 0.5s;
        }

        @keyframes fade-in {
            0% {
                opacity: 0;
            }
            100% {
                opacity: 1;
            }
        }
    </style>

    <slot></slot>
`;

export class StackLayoutPage extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.attachShadow({ mode: "open" });
        this.shadowRoot.appendChild(template.content.cloneNode(true));
    }

    disconnectedCallback() {
        // ...
    }
}
