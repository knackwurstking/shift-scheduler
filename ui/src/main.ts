import "../node_modules/ui/css/main.css";
import "./bootstrap-icons.css";
import "./styles.css";

import { registerSW } from "virtual:pwa-register";
import { SendIntent } from "send-intent";
import { App } from "@capacitor/app";
import { Encoding, Filesystem } from "@capacitor/filesystem";
import * as ui from "ui";

import { spinner } from "@components";
import { appBarUtils, backupUtils, db, store } from "@lib";
import * as pages from "@pages";
import { m } from "@paraglide/messages";

console.debug("process.env.MODE:", process.env.MODE);

if (!process.env.MODE) {
    console.debug("PWA updater registered");
    const updateSW = registerSW({
        async onNeedRefresh() {
            store.obj.set("update", { updateSW }, false, { skipStore: true });
            appBarUtils
                .get("settings")
                .setAttribute("data-ui-color", "destructive");
        },
    });
}

db.open(() => {
    if (process.env.MODE === "capacitor") {
        initCapacitor();
    }

    initRouter();
});

function initCapacitor() {
    App.addListener("backButton", ({ canGoBack }) => {
        if (!!document.querySelector(`dialog[open]`)) {
            return;
        }

        if (!canGoBack) {
            App.exitApp();
        } else {
            window.history.back();
        }
    });

    // Handle share target for backup files
    SendIntent.checkSendIntentReceived()
        .then((result) => {
            console.debug("result.url:", result.url);
            console.debug("result.type:", result.type);

            const s = spinner.create();
            s.methods.start();

            if (result.url) {
                Filesystem.readFile({
                    path: result.url,
                    encoding: Encoding.UTF8,
                })
                    .then(async (content) => {
                        console.debug("content.data:", content.data);

                        if (typeof content.data === "string") {
                            try {
                                await backupUtils.updateViaJSON(content.data);
                                alert(m.alert_send_intent_finish());
                            } catch (err) {
                                alert(err);
                            }

                            s.methods.stop();
                            SendIntent.finish();
                        } else {
                            const reader = new FileReader();
                            reader.onload = async (e) => {
                                try {
                                    await backupUtils.updateViaJSON(
                                        e.target?.result || null,
                                    );
                                    alert(m.alert_send_intent_finish());
                                } catch (err) {
                                    alert(err);
                                }

                                s.methods.stop();
                                SendIntent.finish();
                            };
                            reader.readAsText(content.data);
                        }
                    })
                    .catch((err) => {
                        s.methods.stop();
                        alert(err);
                        SendIntent.finish();
                    });
            }
        })
        .catch((err) => {
            console.warn(err);
        });
}

function initRouter() {
    ui.router.hash.init({
        "/": {
            title: "Shift Scheduler",
            onMount: () => pages.calendar.onMount(),
            onDestroy: () => pages.calendar.onDestroy(),
        },

        settings: {
            title: "Shift Scheduler | Settings",
            onMount: () => pages.settings.onMount(),
            onDestroy: () => pages.settings.onDestroy(),
        },

        dbbrowser: {
            title: "Shift Scheduler | DB-Browser",
            onMount: () => pages.dbbrowser.onMount(),
            onDestroy: () => pages.dbbrowser.onDestroy(),
        },
    });
}
