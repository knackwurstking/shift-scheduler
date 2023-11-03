<script>
    import { createEventDispatcher } from "svelte";

    import {
        Button,
        Dialog,
        Text,
    } from "svelte-css";

    import * as lang from "../../js/lang";
    import * as utils from "../../js/utils";

    /***********
     * Bindings
     ***********/

    /** @type {Dialog.Root} */
    let dialog;

    /***********************
     * Variable Definitions
     ***********************/

    const dispatch = createEventDispatcher();

    /** @type {number} */
    let year;

    /** @type {number} */
    let month;

    /** @type {string} */
    let dateString;
    $: dateString && parseDate();

    let invalidYear = false;
    let invalidMonth = false;

    /***********************
     * Function Definitions
     ***********************/

    /**
     * @param {number} _year
     * @param {number} _month
     */
    export async function open(_year, _month) {
        year = _year;
        month = _month + 1;
        dateString = `${year}-${month}`;
        dialog.showModal();
    }

    export async function close() {
        dialog.close();
    }

    async function parseDate() {
        const [y, m] = dateString.split("-", 2);
        year = parseInt(y, 10);
        month = parseInt(m, 10);
    }
</script>

<Dialog.Root
    bind:this={dialog}
    style={`
        width: 75%;
        max-width: 20em;
    `}
>
    <Dialog.Header
        title={lang.get("datePickerDialog", "title")}
        on:close={() => close()}
    />

    {#if utils.isAndroid()}
        <section>
            <Text.Label
                secondary={lang.get("datePickerDialog", "inputAndroidLabel")}
            >
                <input
                    style="width: 100%;"
                    type="month"
                    bind:value={dateString}
                />
            </Text.Label>
        </section>
    {:else}
        <section>
            <Text.Label secondary={lang.get("datePickerDialog", "input1Label")}>
                <input
                    style="width: 100%;"
                    type="number"
                    bind:value={year}
                    on:input={async () => {
                        if (year === null) {
                            invalidYear = true;
                        } else {
                            invalidYear = false;
                        }
                    }}
                />
            </Text.Label>
        </section>

        <section>
            <Text.Label secondary={lang.get("datePickerDialog", "input2Label")}>
                <input
                    style="width: 100%;"
                    type="number"
                    min={1}
                    max={12}
                    bind:value={month}
                    aria-invalid={invalidMonth}
                    on:input={async () => {
                        if (month < 1 || month > 12 || month === null) {
                            invalidMonth = true;
                        } else {
                            invalidMonth = false;
                        }
                    }}
                />
            </Text.Label>
        </section>
    {/if}

    <Dialog.Footer>
        <Button.Root
            color="primary"
            type="submit"
            on:click={async () => {
                if (invalidMonth || invalidYear) return;
                dispatch("submit", { year, month: month - 1 });
            }}
        >
            {lang.get("buttons", "submit")}
        </Button.Root>
    </Dialog.Footer>
</Dialog.Root>
