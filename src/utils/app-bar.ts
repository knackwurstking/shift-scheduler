import * as constants from "../constants";

export function get(): string {
    return document.querySelector<HTMLElement>(constants.query.appBar.center.title)!.innerText;
}

export function set(title: string): void {
    const el = document.querySelector<HTMLElement>(constants.query.appBar.center.title)!;
    el.innerText = title;
}
