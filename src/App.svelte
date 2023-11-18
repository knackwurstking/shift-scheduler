<script>
    import "./app.css";

    import { App } from "@capacitor/app";
    import { onMount, onDestroy } from "svelte";

    import { CSS } from "svelte-css";

    import {
        createEditModeStore,
        createEditModeIndexStore,
    } from "./lib/stores/edit-mode-store";

    import { createViewStore } from "./lib/stores/view-store";
    import { createThemeStore } from "./lib/stores/theme-store";

    import * as lang from "./lib/js/lang";
    import * as utils from "./lib/js/utils";

    import Header from "./Header.svelte";
    import Main from "./Main.svelte";
    import Footer from "./Footer.svelte";

    /***********************
     * Variable Definitions
     ***********************/

    /** @type {Date} */
    let currentDate = new Date();

    let enableBackButton = false;
    let enableDatePicker = false;

    /**************
     * Store: view
     **************/

    let unsubscribeView;

    const view = createViewStore();

    $: view && subscribeView();

    async function subscribeView() {
        const handler = async (_view) => {
            console.debug(`view=${_view}`);

            // reset edit mode
            editModeIndex.unselect();
            editMode.disable();

            enableDatePicker = _view === "calendar";
            enableBackButton = view.history().length > 1;
        };

        console.debug("subscribe to view");
        unsubscribeView = view.subscribe(handler);
    }

    /**************************************
     * Store: edit-mode && edit-mode-index
     **************************************/

    const editMode = createEditModeStore();
    const editModeIndex = createEditModeIndexStore();

    /***************
     * Store: theme
     ***************/

    const theme = createThemeStore();

    /********************
     * Mount and Destroy
     ********************/

    onMount(async () => {
        if (utils.isAndroid()) {
            App.addListener("backButton", () => view.back());
        }

        view.goto("calendar");
    });

    onDestroy(() => {
        if (unsubscribeView) unsubscribeView();
    });
</script>

<CSS.Root
    mode={$theme === "system" ? undefined : $theme}
    variant="zinc"
    auto={$theme === "system"}
/>

<Main bind:currentDate />

<Header
    {enableBackButton}
    {enableDatePicker}
    bind:datePickerDate={currentDate}
    title={$view === "settings" ? (lang.get("appBar", "settings")) : undefined}
    on:backbuttonclick={() => view.back()}
    on:editmodeclick={() => editMode.toggle()}
    on:currentdatechange={({ detail }) => (currentDate = detail)}
    on:goto={({ detail }) => view.goto(detail)}
/>

<Footer />
