export function get(): string {
    return queryAppBarTitle().innerText;
}

export function set(title: string): void {
    queryAppBarTitle().innerText = title;
}

function queryAppBarTitle(): HTMLElement {
    return document.querySelector<HTMLElement>(`.ui-app-bar .center .title`)!;
}
