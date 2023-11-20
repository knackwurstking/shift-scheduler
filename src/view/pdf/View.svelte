<script>
    import { jsPDF } from "jspdf";

    import { Button } from "svelte-css";

    const pdf = new jsPDF("portrait", "mm", "a4");
</script>

<div
    class="ui-container is-max  no-scrollbar"
    style:padding-top="3em"
    style:overflow="auto"
>
    <!-- TODO: adding a print/share button on top? -->
    <!-- TODO: pick a year? -->
    <!-- TODO: display table for each month -->

    <div id="pdf-content" class="has-padding" data-theme="light">
        <table>
            <thead>
                <tr>
                    <th class="is-text-left">Left Header</th>
                    <th class="is-text-center">Center Header</th>
                    <th class="is-text-right">Right Header</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td class="is-text-left">left body</td>
                    <td class="is-text-center">center body</td>
                    <td class="is-text-right">right body</td>
                </tr>
            </tbody>
        </table>
    </div>

    <section>
        <Button.Root
            on:click={() => {
                const el = document.getElementById("pdf-content");
                pdf.html(el, {
                    callback: (doc) => {
                        doc.save();
                    },
                    margin: [10, 10, 10, 10],
                    width: 190,
                    windowWidth: el.clientWidth, //window width in CSS pixels
                });
            }}
        >
            Print
        </Button.Root>
    </section>
</div>
