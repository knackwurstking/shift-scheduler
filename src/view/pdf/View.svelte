<script>
    import { jsPDF } from "jspdf";

    import { Button, Input } from "svelte-css";

    import PDF from "./PDF.svelte";

    import * as lang from "../../lib/js/lang";

    /** @type {number} */
    export let year;

    const pdf = new jsPDF("portrait", "mm", "a4");
</script>

<div
    class="ui-container is-max no-scrollbar flex column"
    style:padding-top="3em"
    style:overflow="auto"
>
    <section class="flex row justify-between">
        <div>
            <Input.Number
                title={lang.get("pdfView", "yearPicker")}
                min={0}
                bind:value={year}
            />
        </div>

        <Button.Root
            on:click={() => {
                const el = document.getElementById("pdf");
                pdf.html(el, {
                    callback: (doc) => {
                        doc.save();
                    },
                    width: 210,
                    windowWidth: 950, //window width in CSS pixels
                });
            }}
        >
            Print
        </Button.Root>
    </section>

    <div
        class="is-max-width no-scrollbar flex"
        style={
            "height: 100%;" +
            "overflow-y: auto;"
        }
        data-theme="light"
    >
        <PDF
            id="pdf"
            {year}
            data-theme="light"
        />
    </div>
</div>
