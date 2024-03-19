<script>
  import Backup from "./Backup.svelte";
  import ShiftSettings from "./ShiftSettings.svelte";
  import Miscellaneous from "./Miscellaneous.svelte";
  import Storage from "./Storage.svelte";
</script>

<div class="root no-scrollbar">
  <Backup />
  <br />
  <ShiftSettings />
  <br />
  <Miscellaneous />
  <br />
  <Storage />
</div>

<style>
  .root {
    height: 100%;
    padding-top: 3em;
    overflow: hidden;
    overflow-y: auto;
  }
</style>
