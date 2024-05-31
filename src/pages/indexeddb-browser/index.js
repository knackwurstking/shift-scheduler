import ui from "ui";

const t = document.createElement("template");
t.innerHTML = `
`;

export class IndexedDBBrowserPage extends ui.wc.StackLayoutPage {
    static register = () =>
        customElements.define("indexeddb-browser-page", IndexedDBBrowserPage);

    constructor() {
        super();
        this.shadowRoot.appendChild(t.content.cloneNode(true));
    }

    connectedCallback() {
        super.connectedCallback();

        // TODO: Just testing here
        this.cleanup.add(() => console.warn("cleanup indexeddb-browser page..."))
    }
}
