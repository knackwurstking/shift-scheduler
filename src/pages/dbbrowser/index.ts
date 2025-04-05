import { html } from "@lib";

// TODO: Continue here
export async function onMount() {
    document.querySelector("#routerTarget")!.innerHTML = getHTML();
}

export async function onDestroy() {
    // TODO: ...
}

function getHTML(): string {
    return html``;
}
