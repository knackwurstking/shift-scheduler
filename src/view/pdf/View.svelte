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
        data-theme="light"
    />

    <section>
        <Button.Root
            on:click={() => {
                const el = document.getElementById("pdf");
                pdf.html(el, {
                    callback: (doc) => {
                        doc.save();
                    },
                    width: 210,
                    windowWidth: 650, //window width in CSS pixels
                });
            }}
        >
            Print
        </Button.Root>
    </section>
</div>
