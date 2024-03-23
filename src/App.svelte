<script>
  import { App } from "@capacitor/app";
  import { onMount, onDestroy } from "svelte";
  import { UI } from "ui";

  import { lang, utils } from "./lib/js";
  import * as Store from "./lib/stores";

  import Header from "./view/Header.svelte";
  import Main from "./view/Main.svelte";
  import Footer from "./view/Footer.svelte";

  const cleanUp = [];

  const view = Store.View.create();
  const editMode = Store.EditMode.create();
  const theme = Store.Theme.create();

  /** @type {Date} */
  let currentDate = new Date();

  $: !!view && initViewStore();

  /**
   * @param {_Views} currentView
   */
  function viewSubscribeHandler(currentView) {
    console.debug(`view=${currentView}`);

    // reset edit mode
    editMode.indexUnselect();
    editMode.disable();
  }

  function initViewStore() {
    cleanUp.push(view.subscribe(viewSubscribeHandler));
  }

  function androidBackButtonHandler() {
    if ($editMode.open) {
      editMode.disable();
    } else {
      view.back();
    }
  }

  onMount(async () => {
    if (utils.isAndroid()) {
      App.addListener("backButton", androidBackButtonHandler);
    }

    view.goto("calendar");
  });

  onDestroy(() => cleanUp.forEach((fn) => fn()));
</script>

<UI.Theme.Root
  mode={$theme === "system" ? null : $theme}
  variant="zinc"
  auto={$theme === "system"}
/>

<Main bind:currentDate />

<Header
  bind:currentDate
  title={!!$view ? lang.get()["app-bar"][$view] : undefined}
  on:backbuttonclick={() => view.back()}
  on:editmodeclick={() => editMode.toggle()}
  on:currentdatechange={({ detail }) => (currentDate = detail)}
  on:goto={({ detail }) => view.goto(detail)}
/>

<Footer />

<style>
  :global(html, body, #app) {
    width: 100%;
    height: 100%;
  }
</style>
