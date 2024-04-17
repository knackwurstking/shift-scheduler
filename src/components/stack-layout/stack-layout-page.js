const template = document.createElement("template");
template.innerHTML = `
    <style>
        div {
            position: relative;
            width: 100%;
            height: 100%;
        }

        div > page {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            opacity: 0;
            transition: opacity 0.5s ease;
        }

        div > page:last-child {
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

    <div>
        <slot></slot>
    </div>
`;

export class StackLayoutPage extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        // ...
    }

    disconnectedCallback() {
        // ...
    }
}
