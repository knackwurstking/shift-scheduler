<script>
    import { createEventDispatcher } from "svelte";
    import { UI } from "ui";

    import * as lang from "../../js/lang";
    import * as utils from "../../js/utils";

    import * as Store from "../../stores";

    const dispatch = createEventDispatcher();
    const view = Store.view.create();

    /** @type {UI.Dialog.Root} */
    let dialog;

    /** @type {number} */
    let year;
    /** @type {number} */
    let month;

    /** @type {string} */
    let dateString;

    let invalidYear = false;
    let invalidMonth = false;

    $: dateString && parseDate();

    /**
     * @param {number} _year
     * @param {number} _month
     */
    export async function open(_year, _month) {
        year = _year;
        month = _month + 1;
        dateString = `${year}-${month.toString().padStart(2, "0")}`;
        dialog.showModal();
        view.lock();
    }

    export async function close() {
        dialog.close();
        view.unlock();
    }

    async function parseDate() {
        const [y, m] = dateString.split("-", 2);
        year = parseInt(y, 10);
        month = parseInt(m, 10);
    }
</script>

<UI.Dialog.Root
    bind:this={dialog}
    style="min-width: 15em;"
>
    <UI.Dialog.Header
        title={lang.get("dialog date-picker", "title")}
        on:close={() => close()}
    />

    {#if utils.isAndroid()}
        <section>
            <UI.Input.Month
                title={lang.get("dialog date-picker", "inputAndroidLabel")}
                bind:value={dateString}
            />
        </section>
    {:else}
        <section>
            <UI.Input.Number
                title={lang.get("dialog date-picker", "input1Label")}
                bind:value={year}
                invalid={year === null}
            />
        </section>

        <section>
            <UI.Input.Number
                title={lang.get("dialog date-picker", "input2Label")}
                min={1}
                max={12}
                bind:value={month}
                invalid={month < 1 || month > 12 || month === null}
            />
        </section>
    {/if}

    <UI.Dialog.Footer>
        <UI.Button.Root
            type="submit"
            on:click={async () => {
                if (invalidMonth || invalidYear) return;
                dispatch("submit", { year, month: month - 1 });
            }}
        >
            {lang.get("buttons", "submit")}
        </UI.Button.Root>
    </UI.Dialog.Footer>
</UI.Dialog.Root>
