import "./bootstrap-icons.css";
import "./styles.css";

import { App } from "@capacitor/app";
import * as ui from "ui";
import { registerSW } from "virtual:pwa-register";
import { SendIntent } from "send-intent";
import { Encoding, Filesystem } from "@capacitor/filesystem";

import { backupUtils, db } from "@lib";
import * as pages from "@pages";
import { m } from "@paraglide/messages";
import { spinner } from "@components";

console.debug("process.env.MODE:", process.env.MODE);

if (!process.env.MODE) {
    console.debug("PWA updater registered");
    const updateSW = registerSW({
        async onNeedRefresh() {
            // NOTE: I need to separate this button from the capacitor `process.env.MODE`
            const updateButton =
                document.querySelector<HTMLElement>(
                    `.ui-app-bar .left .update`,
                ) || document.createElement("button");

            updateButton.className = "udpate";
            updateButton.setAttribute("variant", "ghost");
            updateButton.setAttribute("color", "destructive");
            updateButton.innerText = m.update();

            document.querySelector(".ui-app-bar .left")!.append(updateButton);

            updateButton.onclick = async () => {
                if (confirm(m.update_alert_message())) {
                    const s = spinner.create();
                    s.methods.start();
                    await updateSW();
                }
            };
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
                            await backupUtils.parseJSON(content.data);

                            s.methods.stop();
                            alert(m.alert_send_intent_finish());
                            SendIntent.finish();
                        } else {
                            const reader = new FileReader();
                            reader.onload = async (e) => {
                                await backupUtils.parseJSON(
                                    e.target?.result || null,
                                );

                                s.methods.stop();
                                alert(m.alert_send_intent_finish());
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
