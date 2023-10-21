<script>
    import { createEventDispatcher } from "svelte";

    import {
        Button,
        Dialog,
        DialogHeader,
        DialogFooter,
        Label,
    } from "svelte-css";

    import * as lang from "../../js/lang";

    /***********
     * Bindings
     ***********/

    /** @type {Dialog} */
    let dialog;

    /***********************
     * Variable Definitions
     ***********************/

    const dispatch = createEventDispatcher();

    let id;
    let name = "";
    let shortName = "";
    let hidden = false;
    let color;

    let disableColor = false;

    /******************************
     * Function Export Definitions
     ******************************/

    /**
     * @param {import("../../stores/shift-setup-store").Shift | null | undefined} shift
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
    }

    export async function close() {
        dialog.close();
    }
</script>

<Dialog
    bind:this={dialog}
    style={`
        width: 75%;
        max-width: 20em;
    `}
>
    <DialogHeader
        title={`${
            id
                ? lang.get("shiftDialog", "titleEdit")
                : lang.get("shiftDialog", "titleNew")
        }`}
        on:close={() => dispatch("close")}
    />

    <section>
        <Label>
            <span slot="secondaryText">
                {lang.get("shiftDialog", "longNameInputLabel")}
                <small>
                    {lang.get("shiftDialog", "longNameInputLabelExample")}
                </small>
            </span>
            <input style="width: 100%;" type="text" bind:value={name} />
        </Label>
    </section>

    <section>
        <Label>
            <span slot="secondaryText">
                {lang.get("shiftDialog", "shortNameInputLabel")}
                <small>
                    {lang.get("shiftDialog", "shortNameInputLabelExample")}
                </small>
            </span>
            <input style="width: 100%;" type="text" bind:value={shortName} />
        </Label>
    </section>

    <section><hr /></section>

    <section>
        <Label
            secondaryText={lang.get("shiftDialog", "hideShiftInputLabel")}
            useLabel
            row
        >
            <input type="checkbox" bind:checked={hidden} />
        </Label>
    </section>

    <section><hr /></section>

    <section>
        <Label
            secondaryText={lang.get("shiftDialog", "pickBackgroundColorLabel")}
        >
            <input
                style="width: 100%;"
                type="color"
                bind:value={color}
                disabled={disableColor}
            />
        </Label>

        <div class="spacer" />

        <Label
            secondaryText={lang.get(
                "shiftDialog",
                "disableBackgroundColorLabel"
            )}
            useLabel
            row
        >
            <input type="checkbox" bind:checked={disableColor} />
        </Label>
    </section>

    <DialogFooter>
        <Button
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
            {lang.get("buttons", "submit")}
        </Button>
    </DialogFooter>
</Dialog>
