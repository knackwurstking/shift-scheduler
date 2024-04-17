const template = document.createElement("template");
template.innerHTML = `
    <style>
        :host {
            display: block;
            position: relative;
            width: 100%;
            height: 100%;
        }
    </style>

    <slot></slot>
`;

export class StackLayout extends HTMLElement {
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
