<script>
  import { Filesystem, Encoding, Directory } from "@capacitor/filesystem";
  import { Share } from "@capacitor/share";
  import { UI, JS } from "ui";

  import * as lang from "../../lib/js/lang";
  import * as db from "../../lib/js/db";
  import * as utils from "../../lib/js/utils";

  import * as Stores from "../../lib/stores";

  /**
   * @typedef BackupData
   * @type {{
   *  settings: SettingsData;
   *  storage: StorageData;
   * }}
   *
   * @typedef SettingsData
   * @type {Stores.shiftSetup.Setup}
   *
   * @typedef StorageData
   * @type {{ [month: string]: db.DBData }}
   */

  const settingsStorage = Stores.settingsStorage.create();
  const shiftSetup = Stores.shiftSetup.create();

  /**
   * @param {string} result
   */
  async function handleReaderOnLoad(result) {
    /** @type {BackupData} */
    const data = JSON.parse(result);

    if (data.settings) {
      shiftSetup.update((setup) => ({ ...setup, ...data.settings }));
    }

    for (const [key, dbData] of Object.entries(data.storage)) {
      if (!db.validate(dbData)) {
        console.error(`Import data: invalid key="${key}":`, dbData);
        return;
      }

      await utils.mergeDataWithShifts(dbData);
    }

    for (const [key, dbData] of Object.entries(data.storage)) {
      const keySplit = key.split("-", 3);
      const year = parseInt(keySplit[1], 10);
      const month = parseInt(keySplit[2], 10);
      await db.set(year, month, dbData);
    }

    settingsStorage.close();
  }

  /**
   * @param {FileReader} reader
   */
  async function readerOnLoad(reader) {
    switch (typeof reader.result) {
      case "string":
        try {
          await handleReaderOnLoad(reader.result);
        } catch (err) {
          alert(`Import data failed!\nerror: ${err}`);
        }
        break;
      default:
        alert("Wrong data!");
    }
  }

  /**
   * @param {ProgressEvent<FileReader>} ev
   */
  async function readerOnError(ev) {
    console.error("Import data: read file failed!", ev);
  }

  async function importBackup() {
    const input = document.createElement("input");

    input.type = "file";

    input.onchange = async () => {
      const reader = new FileReader();
      reader.onload = () => readerOnLoad(reader);
      reader.onerror = (ev) => readerOnError(ev);
      reader.readAsText(input.files[0]);
    };

    input.click();
  }

  async function exportBackup() {
    /** @type {BackupData} */
    const backup = {
      settings: $shiftSetup,
      storage: await db.getAll(),
    };

    if (JS.Utils.isAndroid()) {
      androidExport(backup);
    } else {
      browserExport(backup);
    }
  }

  /**
   * @param {BackupData} data
   */
  async function androidExport(data) {
    const result = await Filesystem.writeFile({
      path: getFileName(),
      data: JSON.stringify(data),
      encoding: Encoding.UTF8,
      directory: Directory.Cache,
    });

    const today = new Date();
    const month = (today.getMonth() + 1).toString().padStart(2, "0");
    const date = today.getDate().toString().padStart(2, "0");
    Share.share({
      title: `${today.getFullYear()}-${month}-${date} Backup`,
      url: result.uri,
      dialogTitle: `Backup "${getFileName()}"`,
    });
  }

  /**
   * @param {BackupData} data
   */
  async function browserExport(data) {
    const blob = new Blob([JSON.stringify(data)], {
      type: "octet/stream",
    });

    const anchor = document.createElement("a");

    anchor.setAttribute("href", window.URL.createObjectURL(blob));
    anchor.setAttribute("download", getFileName());

    anchor.click();
  }

  function getFileName() {
    const today = new Date();
    const month = (today.getMonth() + 1).toString().padStart(2, "0");
    const date = today.getDate().toString().padStart(2, "0");
    return `shift-scheduler-backup_${today.getFullYear()}-${month}-${date}.json`;
  }
</script>

<article class="ui-card has-margin">
  <h3 style="margin: var(--spacing)">
    {lang.get("view settings", "titleBackup")}
  </h3>

  <hr />

  <section>
    <UI.FlexGrid.Row class="is-max-width" gap="calc(var(--spacing) / 2)">
      <UI.Button.Root
        class="is-max"
        variant="outline"
        color="primary"
        on:click={() => importBackup()}
      >
        Import
      </UI.Button.Root>

      <UI.Button.Root
        class="is-max"
        variant="outline"
        color="primary"
        on:click={() => exportBackup()}
      >
        Export
      </UI.Button.Root>
    </UI.FlexGrid.Row>
  </section>
</article>
