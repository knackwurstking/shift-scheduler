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
        <h3>Januar</h3>

        <table>
            <thead>
                <tr>
                    <th class="is-text-left">Mo</th>
                    <th class="is-text-left">Di</th>
                    <th class="is-text-left">Mi</th>
                    <th class="is-text-left">Do</th>
                    <th class="is-text-left">Fr</th>
                    <th class="is-text-left">Sa</th>
                    <th class="is-text-left">So</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td class="is-text-center"></td>
                    <td class="is-text-center"></td>
                    <td class="is-text-center"></td>
                    <td class="is-text-center"></td>
                    <td class="is-text-center"></td>
                    <td class="is-text-center"></td>
                    <td class="is-text-left"><div class="is-max-width flex column"><span>1</span> <span style:color="blue">N</span></div></td>
                </tr>
                <tr>
                    <td class="is-text-left"><div class="is-max-width flex column"><span>2</span> <span style:color="transparent"></span></div></td>
                    <td class="is-text-left"><div class="is-max-width flex column"><span>3</span> <span style:color="transparent"></span></div></td>
                    <td class="is-text-left"><div class="is-max-width flex column"><span>4</span> <span style:color="transparent"></span></div></td>
                    <td class="is-text-left"><div class="is-max-width flex column"><span>5</span> <span style:color="green">F</span></div></td>
                    <td class="is-text-left"><div class="is-max-width flex column"><span>6</span> <span style:color="green">F</span></div></td>
                    <td class="is-text-left"><div class="is-max-width flex column"><span>7</span> <span style:color="orange">S</span></div></td>
                    <td class="is-text-left"><div class="is-max-width flex column"><span>8</span> <span style:color="orange">S</span></div></td>
                </tr>
                <tr>
                    <td class="is-text-left"><div class="is-max-width flex column"><span>9</span> <span style:color="blue">Nacht</span></div></td>
                    <td class="is-text-left"><div class="is-max-width flex column"><span>10</span> <span style:color="red">K</span></div></td>
                    <td class="is-text-left"><div class="is-max-width flex column"><span>11</span> <span style:color="transparent"></span></div></td>
                    <td class="is-text-left"><div class="is-max-width flex column"><span>12</span> <span style:color="transparent"></span></div></td>
                    <td class="is-text-left"><div class="is-max-width flex column"><span>13</span> <span style:color="transparent"></span></div></td>
                    <td class="is-text-left"><div class="is-max-width flex column"><span>14</span> <span style:color="magenta">Ka</span></div></td>
                    <td class="is-text-left"><div class="is-max-width flex column"><span>15</span> <span style:color="green">F</span></div></td>
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

<style>
    table {
        width: 100%;
        table-layout: fixed;
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
