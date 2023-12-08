<script>
    import { Filesystem, Encoding, Directory } from "@capacitor/filesystem";
    import { Share } from "@capacitor/share";

    import FileImportOutline from "svelte-material-icons/FileImportOutline.svelte";
    import FileExportOutline from "svelte-material-icons/FileExportOutline.svelte";

    import { Text, Button, Utils } from "svelte-css";

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

    /**************************
     * Store: settings-storage
     **************************/

    const settingsStorage = Stores.settingsStorage.create();

    /*********************
     * Store: shift-setup
     *********************/

    const shiftSetup = Stores.shiftSetup.create();

    /***********************
     * Function Definitions
     ***********************/

    /**
     * @param {string} result
     */
    const handleReaderOnLoad = async (result) => {
        /** @type {BackupData} */
        const data = JSON.parse(result);

        if (data.settings) {
            shiftSetup.update(setup => ({ ...setup, ...data.settings }));
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
    };

    /**
     * @param {FileReader} reader
     */
    const readerOnLoad = async (reader) => {
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
    };

    /**
     * @param {ProgressEvent<FileReader>} ev
     */
    const readerOnError = async (ev) => {
        console.error("Import data: read file failed!", ev);
    };

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
            settings: await getSettings(),
            storage: await getStorage(),
        }

        if (Utils.isAndroid()) {
            androidExport(backup);
        } else {
            browserExport(backup);
        }
    }

    /**
     * @returns {Promise<SettingsData>}
     */
    async function getSettings() {
        return $shiftSetup;
    }

    /**
     * @returns {Promise<StorageData>}
     */
    async function getStorage() {
        return await db.getAll();
    }

    /**
     * @param {BackupData} data
     */
    async function androidExport(data) {
        const fileName = "shift-scheduler-backup.json";

        const result = await Filesystem.writeFile({
            path: fileName,
            data: JSON.stringify(data),
            encoding: Encoding.UTF8,
            directory: Directory.Cache,
        });

        Share.share({
            title: fileName,
            url: result.uri,
            dialogTitle: "shift-scheduler backup",
        });
    }

    /**
     * @param {BackupData} data
     */
    async function browserExport(data) {
        const fileName = "shift-scheduler-backup.json";

        const blob = new Blob(
            [JSON.stringify(data)],
            {
                type: "octet/stream",
            }
        );

        const anchor = document.createElement("a");

        anchor.setAttribute("href", window.URL.createObjectURL(blob));
        anchor.setAttribute("download", fileName);

        anchor.click();
    }
</script>

<article class="ui-card has-margin">
    <section>
        <Text.Label
            primary={lang.get("settingsView", "labelupdownPrimaryText")}
            secondary={lang.get(
                "settingsView",
                "labelupdownSecondaryText"
            )}
            row
        >
            <Button.Icon
                style="margin: calc(var(--spacing) / 2)"
                on:click={() => importBackup()}
            >
                <FileImportOutline />
            </Button.Icon>
            <Button.Icon
                style="margin: calc(var(--spacing) / 2)"
                on:click={() => exportBackup()}
            >
                <FileExportOutline />
            </Button.Icon>
        </Text.Label>
    </section>
</article>
