<script>
    import { UI } from "svelte-css";

    import * as Store from "../../lib/stores";

    import * as lang from "../../lib/js/lang";

    /***************
     * Store: theme
     ***************/

    const theme = Store.theme.create();

    /********************
     * Store: week-start
     ********************/

    const weekStart = Store.weekStart.create();
</script>

<article class="ui-card has-margin">
    <h3 style="margin: var(--spacing)">
        {lang.get("view settings", "titleMisc")}
    </h3>

    <hr />

    <section>
        <UI.Text.Label
            primary={lang.get("view settings", "miscThemePrimaryText")}
            row
        >
            <UI.Input.Select
                items={[
                    { value: "system", label: "System" },
                    { value: "dark", label: "Dark" },
                    { value: "light", label: "Light" },
                ]}
                selected={{
                    value: $theme,
                    label: $theme.charAt(0).toUpperCase() + $theme.slice(1),
                }}
                on:change={(ev) => theme.set(ev.detail.value)}
            />
        </UI.Text.Label>
    </section>

    <hr />

    <section>
        <UI.Text.Label
            style="cursor: pointer;"
            primary={lang.get("view settings", "miscWeekStartPrimaryText")}
            useLabel
            row
        >
            <input
                style={`
                    transform: scale(1.25);
                `}
                type="checkbox"
                checked={$weekStart === "mon"}
                on:change={(ev) => {
                    if (ev.currentTarget.checked) weekStart.monday();
                    else weekStart.sunday();
                }}
            />
        </UI.Text.Label>
    </section>
</article>
