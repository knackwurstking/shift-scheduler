export function getTitle(): string {
    return queryAppBarTitle().innerText;
}

export function setTitle(title: string): void {
    queryAppBarTitle().innerText = title;
}

function queryAppBarTitle(): HTMLElement {
    return document.querySelector<HTMLElement>(`.ui-app-bar .center .title`)!;
}
