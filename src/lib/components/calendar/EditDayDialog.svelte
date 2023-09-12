<script>
    import { createEventDispatcher } from "svelte";
    const dispatch = createEventDispatcher();

    /** @type {Day} */
    export let day;
    export let open = false;

    /** @type {string} */
    let current;
    /** @type {Settings} */
    let settings = JSON.parse(
        localStorage.getItem("settings") || '{ "shifts": [], "startDate": "", "shiftRhythm": []}'
    );
    $: !!settings && (current = settings.shifts.findIndex((v) => v.name === day.data.shift?.name).toString());
</script>

<dialog {open}>
    <article>
        <h2 class="title">
            {day.date.getFullYear()} / {(day.date.getMonth() + 1).toString().padStart(2, "0")} / {day.date
                .getDate()
                .toString()
                .padStart(2, "0")}
        </h2>

        <select bind:value={current}>
            <option value="-1" selected={current === "-1"}>(Default) {day.defaultShift?.name || ""}</option>

            {#each settings.shifts as shift, index}
                <option value={index.toString()} selected={current === index.toString()}>{shift.name}</option>
            {/each}
        </select>

        <label for="note">
            Note
            <textarea name="note" cols="30" rows="10" bind:value={day.data.note} />
        </label>

        <button
            on:click={() =>
                dispatch("submit", {
                    shift: settings.shifts.find((_s, i) => i.toString() === current) || null,
                    note: day.data.note,
                })}
        >
            OK
        </button>
    </article>
</dialog>

<style>
    article {
        padding: var(--spacing);
    }

    label textarea[name="note"] {
        resize: none;
    }
</style>
