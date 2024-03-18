<script>
    import { UI } from "ui";

    import { Shift } from "../lib/components";
    import * as Store from "../lib/stores";
    import * as lang from "../lib/js/lang";
    import * as constants from "../lib/js/constants";

    const editMode = Store.editMode.create();
    const shiftSetup = Store.shiftSetup.create();
</script>

<footer class="ui-container is-max-width has-top-border" class:visible={$editMode.open} style:height={constants.footerHeight}>
    <span class="separator-title">{lang.get("footer", "edit mode")}</span>

    {#if $editMode.open}
        <figure class="flex no-scrollbar is-max" style:padding-top="calc(var(--spacing) / 2)">
            <UI.FlexGrid.Row gap=".1em">
                <UI.FlexGrid.Col
                    style="width: calc(7.5em + var(--spacing));"
                    flex="0"
                >
                    <Shift
                        class="is-max"
                        name="Reset"
                        visible={false}
                        active={$editMode.index === -2}
                        color="transparent"
                        id={-2}
                        on:click={() => {
                            if ($editMode.index === -2) {
                                editMode.indexUnselect();
                            } else {
                                editMode.indexReset();
                            }
                        }}
                    />
                </UI.FlexGrid.Col>

                {#each $shiftSetup.shifts as shift, index}
                    <UI.FlexGrid.Col
                        style="width: calc(7.5em + var(--spacing));"
                        flex="0"
                    >
                        <Shift
                            class="is-max"
                            {...shift}
                            active={$editMode.index === index}
                            on:click={() => {
                                if ($editMode.index === index) {
                                    editMode.indexUnselect();
                                } else {
                                    editMode.indexSelect(index);
                                }
                            }}
                        />
                    </UI.FlexGrid.Col>
                {/each}
            </UI.FlexGrid.Row>
        </figure>
    {/if}
</footer>

<style>
    footer {
        transform: none;
        position: absolute;
        right: 0;
        bottom: 0;
        left: 0;
        transition: transform .15s ease-out;
    }

    .separator-title {
        position: absolute;
        top: 0;
        left: 50%;
        transform: translateX(-50%) translateY(-50%);
        background-color: hsl(var(--bg));
        padding: 0 var(--spacing);
    }

    footer:not(.visible) {
        transform: translateY(150%);
    }
</style>
