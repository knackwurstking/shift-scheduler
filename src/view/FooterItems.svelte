<script>
    import { UI } from "ui";

    import * as Store from "../lib/stores";
    import { Shift } from "../lib/components";

    const editMode = Store.EditMode.create();
    const shiftSetup = Store.ShiftSetup.create();

    function resetHandler() {
        if ($editMode.index === -2) {
            editMode.indexUnselect();
        } else {
            editMode.indexReset();
        }
    }

    /**
     * @param {number} index
     */
    function shiftHandler(index) {
        if ($editMode.index === index) {
            editMode.indexUnselect();
        } else {
            editMode.indexSelect(index);
        }
    }
</script>

<UI.FlexGrid.Col style="width: calc(7.5em + var(--spacing));" flex="0">
    <Shift
        class="is-max"
        name="Reset"
        visible={false}
        active={$editMode.index === -2}
        color="transparent"
        id={-2}
        on:click={() => resetHandler()}
    />
</UI.FlexGrid.Col>

{#each $shiftSetup.shifts as shift, index}
    <UI.FlexGrid.Col style="width: calc(7.5em + var(--spacing));" flex="0">
        <Shift
            class="is-max"
            {...shift}
            active={$editMode.index === index}
            on:click={() => shiftHandler(index)}
        />
    </UI.FlexGrid.Col>
{/each}
