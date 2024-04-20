import ui from "ui"

const template = document.createElement("template");

// TODO: misc html
const templateMisc = `
<article class="ui-card has-margin">
    <h3 class="title">
        <span data-replace="miscTitle"></span>
    </h3>

    <hr />

    <!-- week-start settings -->
    <section>
        <!-- checkbox if the week should start on monday or not -->
        <span data-replace="miscWeekStart"></span>
    </section>

    <hr />

    <!-- theme settings -->
    <section>
        <span data-replace="miscThemeMode"></span>

        <!--hr /-->

        <!-- TODO: maybe add some theme picker select box for "zinc" and some future themes available -->
    </section>
</article>
`

// TODO: shifts html
const templateShifts = `
`

// TODO: backup html
const templateBackup = `
<article class="ui-card backup">
    <h3 class="title">
        <span data-replace="backupTitle"></span>
    </h3>

    <hr />

    <section>
        <div class="ui-grid-row actions" style="--gap: 0.1em;">
            <span data-replace="backupImportButton"></span>

            <span data-replace="backupExportButton"></span>
        </div>
    </section>
</article>
`

// TODO: storage html
const templateStorage = `
`

template.innerHTML = `
<style>
</style>

${templateMisc} <br /> ${templateShifts} <br /> ${templateBackup} <br /> ${templateStorage}
`

// TODO: Settings page is next...
export class SettingsPage extends ui.wc.StackLayoutPage {
    /** @type {import("../../app").App | null} */
    #app = null;
    #initialized = false;

    constructor() {
        super();
        this.shadowRoot.appendChild(template.content.cloneNode(true))
    }

    get app() {
        return this.#app
    }

    set app(app) {
        this.#app = app

        if (super.isConnected && !this.#initialized) {
            this.#initialized = true

            // TODO: connectedCallback shit here
        }
    }

    connectedCallback() {
        super.connectedCallback();

        if (!!this.app) {
            this.app = this.app
        }
    }

    disconnectedCallback() {
        super.connectedCallback();
        this.#initialized = false;

        if (!!this.app) {
            // ...
        }
    }
}
