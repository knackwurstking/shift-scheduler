<script>
  import { utils } from "../../lib/js";
  import * as Store from "../../lib/stores";

  import PDFTable from "./PDFTable.svelte";

  const weekStart = Store.WeekStart.create();

  export let year;

  /** @type {{ month: number; data: _Day[] }[]} */
  let pagesData = [];

  $: if (!!year && !!weekStart)
    (async () => {
      const data = [];
      for (let month = 0; month < 12; month++) {
        data.push({
          month: month,
          data: await utils.getDaysForMonth(year, month, {
            weekStart: $weekStart,
          }),
        });
      }
      pagesData = data;
    })();
</script>

<div
  class={"is-max-width " + ($$restProps.class || "")}
  {...$$restProps}
  style:height="fit-content"
  style:background="#ffffff"
  data-theme="light"
>
  {#each pagesData as data}
    <PDFTable style="padding: 1em;" month={data.month} data={data.data} />
  {/each}
</div>
