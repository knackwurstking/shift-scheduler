<script>
    import { createEventDispatcher } from "svelte";
    const dispatch = createEventDispatcher();

    // TODO: notes and custom shift for the current grid item (date: "YYYY:MM:DD")
    export let open = false;

    /** @type {Date} */
    export let date;
</script>