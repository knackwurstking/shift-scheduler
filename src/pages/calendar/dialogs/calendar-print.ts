import { DialogCreate } from "@types";
import { html } from "@utils";

export function create(): DialogCreate {
    const dialog = document.createElement("dialog");

    dialog.innerHTML = html``; // TODO: ...

    return {
        dialog,
        destroy() {
            document.body.removeChild(this.dialog);
        },
    };
}

export function open(): Promise<void> {
    return new Promise((resolve) => {
        //const { dialog, destroy } = create();
        // TODO: Continue here
    });
}
