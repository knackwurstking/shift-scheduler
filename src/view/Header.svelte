<script>
  import { createEventDispatcher } from "svelte";
  import { UI } from "ui";

  import * as Store from "../lib/stores";
  import { DatePickerDialog } from "../lib/components";

  import HeaderCenterSlot from "./HeaderCenterSlot.svelte";
  import HeaderLeftSlot from "./HeaderLeftSlot.svelte";
  import HeaderRightSlot from "./HeaderRightSlot.svelte";

  const dispatch = createEventDispatcher();

  const view = Store.View.create();

  /** @type {Date} */
  export let currentDate;

  /** @type {string | undefined} */
  export let title = undefined;

  /** @type {DatePickerDialog} */
  let datePickerDialog;

  let enableBackButton = false;
  let enableDatePicker = false;

  $: !!view && initViewStore();

  function initViewStore() {
    view.subscribe((currentView) => {
      enableBackButton = view.history().length > 1;
      enableDatePicker = currentView === "calendar";
    });
  }
</script>

<UI.TopAppBar.Root uiContainer>
  <svelte:fragment slot="left">
    <HeaderLeftSlot
      {currentDate}
      {datePickerDialog}
      backButton={enableBackButton}
      datePicker={enableDatePicker}
      on:backbuttonclick
    />
  </svelte:fragment>

  <svelte:fragment slot="center">
    <HeaderCenterSlot {title} />
  </svelte:fragment>

  <svelte:fragment slot="right">
    <HeaderRightSlot
      {currentDate}
      datePicker={enableDatePicker}
      on:goto
      on:editmodeclick
      on:currentdatechange
    />
  </svelte:fragment>
</UI.TopAppBar.Root>

<DatePickerDialog
  bind:this={datePickerDialog}
  on:submit={async ({ detail }) => {
    dispatch("currentdatechange", new Date(detail.year, detail.month));
    datePickerDialog.close();
  }}
/>
