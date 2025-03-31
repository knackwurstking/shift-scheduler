export type AppBarItems =
    | "date-picker"
    | "today"
    | "edit"
    | "printer"
    | "settings";

export function enable(item: AppBarItems): HTMLElement {
    const el = document.querySelector<HTMLElement>(`.ui-app-bar .${item}`)!;

    el.style.display = "inline-flex";

    return el;
}

export function disable(item: AppBarItems) {
    const el = document.querySelector<HTMLElement>(`.ui-app-bar .${item}`)!;

    el.style.display = "none";

    return el;
}

export function getTitle(): string {
    return queryAppBarTitle().innerText;
}

export function setTitle(title: string): void {
    queryAppBarTitle().innerText = title;
}

function queryAppBarTitle(): HTMLElement {
    return document.querySelector<HTMLElement>(`.ui-app-bar .center .title`)!;
}
