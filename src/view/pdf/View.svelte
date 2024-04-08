<script>
    import { Filesystem, Encoding, Directory } from "@capacitor/filesystem";
    import { Share } from "@capacitor/share";

    import { UI } from "ui";

    import * as jspdf from "jspdf";
    import html2canvas from "html2canvas";

    import { lang, utils } from "../../lib/js";
    import * as Store from "../../lib/stores";

    import PDF from "./PDF.svelte";

    const view = Store.View.create();

    /** @type {number} */
    export let year;

    let processing = false;

    $: processing ? view.lock() : view.unlock();

    /**
     * @param {jspdf.jsPDF} doc
     * @param {number} year
     */
    async function exportPDF(doc, year) {
        const fileName = `${year}.pdf`;

        if (utils.isAndroid()) {
            const result = await Filesystem.writeFile({
                path: fileName,
                // @ts-ignore
                data: doc.output("datauri"),
                //encoding: Encoding.UTF8,
                directory: Directory.Cache,
            });

            Share.share({
                title: `${year}`,
                url: result.uri,
                dialogTitle: `Share "${fileName}"`,
            });
        } else {
            doc.save(fileName);
        }
    }

    async function download() {
        processing = true;

        setTimeout(async () => {
            const el = await getPDFElement();

            const canvas = await html2canvas(el, {
                width: window.innerWidth,
                height: el.clientHeight,
            });

            const dURL = canvas.toDataURL("image/png");
            const pdf = new jspdf.jsPDF("portrait", "mm", "a4");

            const paddingLeft = 5;
            const w = 210;
            const h = w * 1.414 * 4;

            let position = 0;
            pdf.addImage(
                dURL,
                "PNG",
                paddingLeft,
                position,
                w,
                h,
                "someAlias",
                "MEDIUM",
            );

            position -= w * 1.414;
            pdf.addPage();
            pdf.addImage(
                dURL,
                "PNG",
                paddingLeft,
                position,
                w,
                h,
                "someAlias",
                "MEDIUM",
            );

            position -= w * 1.414;
            pdf.addPage();
            pdf.addImage(
                dURL,
                "PNG",
                paddingLeft,
                position,
                w,
                h,
                "someAlias",
                "MEDIUM",
            );

            position -= w * 1.414;
            pdf.addPage();
            pdf.addImage(
                dURL,
                "PNG",
                paddingLeft,
                position,
                w,
                h,
                "someAlias",
                "MEDIUM",
            );

            await exportPDF(pdf, year);
            processing = false;
        }, 0);
    }

    async function getPDFElement() {
        return document.getElementById("pdf");
    }
</script>

<div class="ui-container is-max flex column" style:padding-top="3em">
    <section class="flex row justify-between">
        <div>
            <UI.Input.Number
                title={lang.get()["pdf"]["year picker"]}
                min={0}
                bind:value={year}
            />
        </div>

        <UI.Button.Root on:click={() => download()}>Download</UI.Button.Root>
    </section>

    <div
        class="is-max-width no-scrollbar flex"
        style="height: 100%; overflow-y: auto; scroll-behavior: smooth;"
    >
        <PDF id="pdf" {year} />
    </div>

    <div
        class="ui-spinner is-max"
        style:display={processing ? "block" : "none"}
    ></div>
</div>

<style>
    .ui-spinner {
        position: absolute;
        top: 0;
        left: 0;
        padding-top: 3em;
        background-color: hsl(0, 0%, 0%, 0.4);
        backdrop-filter: blur(5px);
    }
</style>
