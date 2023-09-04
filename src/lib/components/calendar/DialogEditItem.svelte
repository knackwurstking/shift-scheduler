<script>
    import { createEventDispatcher } from "svelte";
    const dispatch = createEventDispatcher();

    export let open = false;

    /** @type {Date} */
    export let date;
    /** @type {GridItem} */
    export let item;
    /** @type {Settings} */
    export let settings;

    let current = settings.shifts.findIndex((v) => (v.name === (item.data.shift?.name || item.data.default?.name))).toString();
</script>

<dialog {open}>
    <article>
        <h2 class="title">
            {date.getFullYear()} / {date.getMonth().toString().padStart(2, "0")} / {date
                .getDate()
                .toString()
                .padStart(2, "0")}
        </h2>

        <select bind:value={current}>
            <option value="-1" selected={current === "-1"}></option>

            {#each settings.shifts as shift, index}
                <option value={index.toString()} selected={current === index.toString()}>{shift.name}</option>
            {/each}
        </select>

        <label for="note">
            Note
            <textarea name="note" cols="30" rows="10"></textarea>
        </label>

        <button
            on:click={() =>
                dispatch("submit", {
                    default: item.data.default || null,
                    shift: item.data.shift || null,
                    note: item.data.note || null,
                })}
        >
            OK
        </button>
    </article>
</dialog>

<style>
    label textarea[name=note] {
        resize: none;
    }
</style>
