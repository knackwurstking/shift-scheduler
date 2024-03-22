<script>
  import { UI } from "ui";

  import { lang } from "../../lib/js";
  import * as Store from "../../lib/stores";

  const shiftSetup = Store.ShiftSetup.create();
</script>

<section>
  <UI.Text.Label
    primary={lang.get("view settings", "startDatePrimaryText")}
    row
  >
    <UI.Input.Date
      value={$shiftSetup.startDate}
      on:input={(ev) => {
        // @ts-ignore
        shiftSetup.updateStartDate(ev.currentTarget.value);
      }}
    />
  </UI.Text.Label>
</section>
