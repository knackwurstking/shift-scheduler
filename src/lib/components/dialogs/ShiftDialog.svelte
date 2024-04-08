<script>
    import { createEventDispatcher } from "svelte";
    import { UI } from "ui";

    import { lang } from "../../js";
    import * as Store from "../../stores";

    const dispatch = createEventDispatcher();
    const view = Store.View.create();

    /** @type {UI.Dialog.Root} */
    let dialog;

    let id;
    let name = "";
    let shortName = "";
    let hidden = false;
    let color;

    let disableColor = false;

    /**
     * @param {_Shift | null | undefined} shift
     */
    export async function open(shift = null) {
        if (shift) {
            id = shift.id;
            name = shift.name;
            shortName = shift.shortName;
            hidden = !shift.visible;
            color = shift.color;
            disableColor = shift.color === "transparent";
        } else {
            id = undefined;
            name = "";
            shortName = "";
            hidden = false;
            color = undefined;
            disableColor = false;
        }

        dialog.showModal();
        view.lock();
    }

    export async function close() {
        dialog.close();
        view.unlock();
    }
</script>

<UI.Dialog.Root
    bind:this={dialog}
    style={`
        width: 75%;
        max-width: 20em;
    `}
>
    <UI.Dialog.Header
        title={`${
            id
                ? lang.get()["dialog shift"]["edit shift title"]
                : lang.get()["dialog shift"]["new shift title"]
        }`}
        on:close={() => close()}
    />

    <section>
        <UI.Input.Text
            title={lang.get()["dialog shift"]["long name"]}
            bind:value={name}
        />
    </section>

    <section>
        <UI.Input.Text
            title={lang.get()["dialog shift"]["short name"]}
            bind:value={shortName}
        />
    </section>

    <br />

    <section>
        <UI.Text.Label
            style="cursor: pointer;"
            secondary={lang.get()["dialog shift"]["hide shift"]}
            useLabel
            row
        >
            <input type="checkbox" bind:checked={hidden} />
        </UI.Text.Label>
    </section>

    <br />

    <section>
        <UI.Text.Label secondary={lang.get()["dialog shift"]["color picker"]}>
            <input style="width: 100%;" type="color" bind:value={color} />
        </UI.Text.Label>

        <br />
    </section>

    <UI.Dialog.Footer>
        <UI.Button.Root
            color="primary"
            on:click={async () => {
                dispatch("submit", {
                    id,
                    name,
                    shortName: shortName || name[0] || "",
                    color: disableColor ? "transparent" : color,
                    visible: !hidden,
                });
            }}
        >
            {lang.get()["buttons"]["submit"]}
        </UI.Button.Root>
    </UI.Dialog.Footer>
</UI.Dialog.Root>
