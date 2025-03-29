// TODO: Rename to getTitle
export function get(): string {
    return queryAppBarTitle().innerText;
}

// TODO: Rename to setTitle
export function set(title: string): void {
    queryAppBarTitle().innerText = title;
}

function queryAppBarTitle(): HTMLElement {
    return document.querySelector<HTMLElement>(`.ui-app-bar .center .title`)!;
}
