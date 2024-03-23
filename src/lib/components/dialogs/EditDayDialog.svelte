<script>
  import { createEventDispatcher } from "svelte";
  import { UI } from "ui";

  import { db, lang } from "../../js";
  import * as Store from "../../stores";

  const dispatch = createEventDispatcher();
  const shiftSetup = Store.ShiftSetup.create();
  const view = Store.View.create();

  /** @type {UI.Dialog.Root} */
  let dialog;

  /** @type {UI.Input.Select} */
  let select;

  /** @type {number} */
  let year;
  /** @type {number} */
  let month;
  /** @type {number} */
  let date;

  /** @type {_Shift | null} */
  let defaultShift;
  /** @type {_Shift | null} */
  let shift;
  /** @type {string} */
  let note;

  /** @type {{ value: string, label: string }[]} */
  let selectItems = [];
  /** @type {{ value: string, label: string }} */
  let selected = undefined;

  /**
   * @param {number} _year
   * @param {number} _month
   * @param {number} _date
   */
  export async function open(_year, _month, _date) {
    year = _year;
    month = _month;
    date = _date;

    defaultShift = shiftSetup.calcShiftStep(new Date(year, month, date));

    const data = (await db.get(year, month))[`${year}-${month}-${date}`];
    shift = data?.shift || null;
    note = data?.note || "";

    selectItems = [
      { value: "-1", label: `(Default) ${defaultShift?.name || ""}` },
      ...$shiftSetup.shifts.map((s, i) => ({
        value: i.toString(),
        label: s.name,
      })),
    ];
    selected = !!shift
      ? {
          value: shiftSetup.getShiftIndex(shift.id).toString(),
          label: shift.name,
        }
      : selectItems[0];

    dialog.showModal();
    view.lock();
  }

  export async function close() {
    select.collapse();
    dialog.close();
    view.unlock();
  }
</script>

<UI.Dialog.Root bind:this={dialog} style={"width: 17rem;" + "max-width: 100%;"}>
  <UI.Dialog.Header
    title={`${year} / ${(month + 1).toString().padStart(2, "0")} / ${
      date?.toString().padStart(2, "0") || "??"
    }`}
    on:close={() => close()}
  />

  <section
    style={"padding-left: calc(var(--spacing) * 2.5);" +
      "padding-right: calc(var(--spacing) * 2.5);"}
  >
    <UI.Input.Select bind:this={select} items={selectItems} bind:selected />
  </section>

  <section class="has-x-margin">
    <span class="ui-input-title">
      {lang.get()["dialog day"]["textfield"]}
    </span>

    <textarea bind:value={note} rows="10" style="width: 100%;" />
  </section>

  <UI.Dialog.Footer>
    <UI.Button.Root
      color="primary"
      on:click={() =>
        dispatch("submit", {
          date: { year, month, date },
          shift: shiftSetup.getShift(parseInt(selected.value, 10)) || null,
          note: note,
        })}
    >
      {lang.get()["buttons"]["submit"]}
    </UI.Button.Root>
  </UI.Dialog.Footer>
</UI.Dialog.Root>

<style>
  textarea {
    resize: none;
  }
</style>
