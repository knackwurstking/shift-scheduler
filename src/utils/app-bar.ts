import * as constants from "../constants";

export function get(): string {
    return document.querySelector<HTMLElement>(constants.query.appBarCenter.title)!.innerText;
}

export function set(title: string): void {
    const el = document.querySelector<HTMLElement>(constants.query.appBarCenter.title)!;
    el.innerText = title;
}
