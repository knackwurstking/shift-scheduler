<script>
    import { Grid } from "svelte-css";

    import { Shift } from "./lib/components";

    import {
        createEditModeStore,
        createEditModeIndexStore,
    } from "./lib/stores/edit-mode-store";

    import { createShiftSetupStore } from "./lib/stores/shift-setup-store";

    /**************************************
     * Store: edit-mode && edit-mode-index
     **************************************/

    const editMode = createEditModeStore();
    const editModeIndex = createEditModeIndexStore();

    /*********************
     * Store: shift-setup
     *********************/

    const shiftSetup = createShiftSetupStore();
</script>

<footer class="ui-container is-max-width" class:visible={$editMode}>
    {#if $editMode}
        <figure class="flex no-scrollbar is-max">
            <Grid.Row flexFlow="row nowrap">
                <Grid.Col width="calc(7.5em + var(--spacing))" flex="0">
                    <Shift
                        class="is-max"
                        name="Reset"
                        visible={false}
                        active={$editModeIndex === -2}
                        color="transparent"
                        id={-2}
                        on:click={() => {
                            if ($editModeIndex === -2) {
                                editModeIndex.unselect();
                            } else {
                                editModeIndex.reset();
                            }
                        }}
                    />
                </Grid.Col>

                {#each $shiftSetup.shifts as shift, index}
                    <Grid.Col width="calc(7.5em + var(--spacing))" flex="0">
                        <Shift
                            class="is-max"
                            {...shift}
                            active={$editModeIndex === index}
                            on:click={() => {
                                if ($editModeIndex === index) {
                                    editModeIndex.unselect();
                                } else {
                                    editModeIndex.select(index);
                                }
                            }}
                        />
                    </Grid.Col>
                {/each}
            </Grid.Row>
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
        height: 4.5em;
        padding: 0;
    }

    footer:not(.visible) {
        transform: translateY(100%);
    }
</style>
