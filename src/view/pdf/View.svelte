<script>
    import { jsPDF } from "jspdf";

    import { Button } from "svelte-css";

    import PDF from "./PDF.svelte";

    /** @type {number} */
    export let year;

    const pdf = new jsPDF("portrait", "mm", "a4");
</script>

<div
    class="ui-container is-max  no-scrollbar"
    style:padding-top="3em"
    style:overflow="auto"
>
    <PDF
        id="pdf"
        {year}
    />

    <section>
        <Button.Root
            on:click={() => {
                const el = document.getElementById("pdf-content");
                pdf.html(el, {
                    callback: (doc) => {
                        doc.save();
                    },
                    width: 190,
                    windowWidth: 440, //window width in CSS pixels
                });
            }}
        >
            Print
        </Button.Root>
    </section>
</div>

<style>
    table {
        width: 100%;
        table-layout: fixed;
    }

    tbody td {
        height: calc(3em);
    }

    td {
        width: calc(100% / 7);
    }

    td span {
        display: block;
    }

    td span:nth-child(1) {
        font-size: 0.85em;
        font-weight: lighter;
    }

    td span:nth-child(2) {
        width: 100%;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        font-size: 0.9em;
    }
</style>
