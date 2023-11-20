<script>
    import "./app.css";

    import { App } from "@capacitor/app";
    import { onMount, onDestroy } from "svelte";

    import { CSS } from "svelte-css";

    import * as Store from "./lib/stores";

    import * as lang from "./lib/js/lang";
    import * as utils from "./lib/js/utils";

    import Header from "./view/Header.svelte";
    import Main from "./view/Main.svelte";
    import Footer from "./view/Footer.svelte";

    /***********************
    * Variable Definitions
     ***********************/

    const cleanUp = [];

    /** @type {Date} */
    let currentDate = new Date();

    /**************
     * Store: view
     **************/

    const view = Store.view.create();
    $: !!view && cleanUp.push(view.subscribe((currentView) => {
        console.debug(`view=${currentView}`);

        // reset edit mode
        editMode.indexUnselect()
        editMode.disable();
    }));

    /**************************************
     * Store: edit-mode && edit-mode-index
     **************************************/

    const editMode = Store.editMode.create();

    /***************
     * Store: theme
     ***************/

    const theme = Store.theme.create();

    /********************
     * Mount and Destroy
     ********************/

    onMount(async () => {
        if (utils.isAndroid()) {
            App.addListener("backButton", () => view.back());
        }

        view.goto("calendar");
    });

    onDestroy(() => cleanUp.forEach(fn => fn()));
</script>

<CSS.Root
    mode={$theme === "system" ? undefined : $theme}
    variant="zinc"
    auto={$theme === "system"}
/>

<Main bind:currentDate />

<Header
    bind:currentDate
    title={!!$view ? (lang.get("appBar", $view) || undefined) : undefined}
    on:backbuttonclick={() => view.back()}
    on:editmodeclick={() => editMode.toggle()}
    on:currentdatechange={({ detail }) => (currentDate = detail)}
    on:goto={({ detail }) => view.goto(detail)}
/>

<Footer />
