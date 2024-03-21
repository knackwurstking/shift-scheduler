<script>
  import { Filesystem, Encoding, Directory } from "@capacitor/filesystem";
  import { Share } from "@capacitor/share";
  import { jsPDF } from "jspdf";
  import { UI } from "ui";

  import * as lang from "../../lib/js/lang";
  import * as utils from "../../lib/js/utils";

  import * as Store from "../../lib/stores";

  import PDF from "./PDF.svelte";

  const pdf = new jsPDF("portrait", "mm", "a4");
  const view = Store.View.create();

  /** @type {number} */
  export let year;

  let processing = false;

  $: processing ? view.lock() : view.unlock();

  /**
   * @param {any} doc
   * @param {number} year
   */
  async function exportPDF(doc, year) {
    const fileName = `${year}.pdf`;

    if (utils.isAndroid()) {
      const result = await Filesystem.writeFile({
        path: fileName,
        data: doc.output(),
        encoding: Encoding.UTF8,
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

    processing = false;
  }

  async function download() {
    processing = true;

    setTimeout(() => {
      /** @type {HTMLElement} */
      // @ts-ignore
      const el = document.getElementById("pdf").cloneNode(true);

      el.setAttribute("data-theme", "light");
      [...el.querySelectorAll(".page")].forEach((el) => {
        // @ts-ignore
        el.style.aspectRatio = "1 / 1.414";
      });

      pdf.html(el, {
        callback: (doc) => exportPDF(doc, year),
        width: 210,
        windowWidth: 500, //window width in CSS pixels
      });
    }, 0);
  }
</script>

<div
  class="ui-container is-max no-scrollbar flex column"
  style:padding-top="3em"
  style:overflow="auto"
>
  <section class="flex row justify-between">
    <div>
      <UI.Input.Number
        title={lang.get("view pdf", "yearPicker")}
        min={0}
        bind:value={year}
      />
    </div>

    <UI.Button.Root on:click={() => download()}>Download</UI.Button.Root>
  </section>

  <div
    class="is-max-width no-scrollbar flex"
    style={"height: 100%;" + "overflow-y: auto;"}
  >
    <PDF id="pdf" {year} />
  </div>

  <div class="ui-spinner" style:display={processing ? "block" : "none"}></div>
</div>

<style>
  .ui-spinner {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    padding-top: 3em;
    background-color: hsl(0, 0%, 0%, 0.4);
    backdrop-filter: blur(5px);
  }
</style>
