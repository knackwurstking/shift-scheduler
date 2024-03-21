<script>
  import { lang } from "../../lib/js";

  import MiscTheme from "./MiscTheme.svelte";
  import MiscWeekStart from "./MiscWeekStart.svelte";
</script>

<article class="ui-card has-margin">
  <h3 style="margin: var(--spacing)">
    {lang.get("view settings", "titleMisc")}
  </h3>

  <hr />
  <MiscTheme />
  <hr />
  <MiscWeekStart />
</article>
