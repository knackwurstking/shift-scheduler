<script>
  import * as Store from "../../lib/stores";

  import * as utils from "../../lib/js/utils";

  import Page from "./Page.svelte";
  import PageSection from "./PageSection.svelte";

  const weekStart = Store.WeekStart.create();

  export let year;

  /** @type {{ month: number; data: _Day[] }[][]} */
  let pagesData = [];

  $: if (!!year && !!weekStart)
    (async () => {
      const data = [];
      for (const month of [1, 3, 5, 7, 9, 11]) {
        data.push([
          {
            month: month - 1,
            data: await utils.getDaysForMonth(year, month - 1, {
              weekStart: $weekStart,
            }),
          },
          {
            month: month,
            data: await utils.getDaysForMonth(year, month, {
              weekStart: $weekStart,
            }),
          },
        ]);
      }
      pagesData = data;
    })();
</script>

<div {...$$restProps}>
  {#each pagesData as data}
    <Page {year}>
      <PageSection
        style="padding: 1em;"
        month={data[0].month}
        data={data[0].data}
      />

      <PageSection
        style="padding: 1em;"
        month={data[1].month}
        data={data[1].data}
      />
    </Page>
  {/each}
</div>

<style>
  div {
    width: 100%;
  }
</style>
