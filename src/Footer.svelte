<script>
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

<footer class="container" class:visible={$editMode}>
    {#if $editMode}
        <figure class="container">
            <div class="row" style="flex-wrap: nowrap;">
                <div
                    class="col"
                    style="max-width: calc(7em + var(--spacing) * 2);"
                >
                    <Shift
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
                </div>

                {#each $shiftSetup.shifts as shift, index}
                    <div
                        class="col"
                        style="max-width: calc(7em + var(--spacing) * 2);"
                    >
                        <Shift
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
                    </div>
                {/each}
            </div>
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
        display: flex;
    }

    footer figure {
        -ms-overflow-style: none;
        scrollbar-width: none;
        height: 100%;
    }

    footer figure::-webkit-scrollbar {
        display: none;
    }

    footer:not(.visible) {
        transform: translateY(100%);
    }
</style>
