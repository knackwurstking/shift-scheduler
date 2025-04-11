export type AppBarItems =
    | "back"
    | "date-picker"
    | "uncheck"
    | "check"
    | "delete"
    | "today"
    | "edit"
    | "printer"
    | "settings";

export function get(item: AppBarItems): HTMLElement {
    return document.querySelector<HTMLElement>(`.ui-app-bar .${item}`)!;
}

export function enable(item: AppBarItems | HTMLElement): HTMLElement {
    let el: HTMLElement;

    if (item instanceof Element) {
        el = item;
    } else {
        el = document.querySelector<HTMLElement>(`.ui-app-bar .${item}`)!;
    }

    el.style.display = "inline-flex";

    return el;
}

export function disable(item: AppBarItems | HTMLElement): HTMLElement {
    let el: HTMLElement;

    if (item instanceof Element) {
        el = item;
    } else {
        el = document.querySelector<HTMLElement>(`.ui-app-bar .${item}`)!;
    }

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
