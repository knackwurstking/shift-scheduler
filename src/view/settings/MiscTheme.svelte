<script>
    import { UI } from "ui";

    import { lang } from "../../lib/js";
    import * as Store from "../../lib/stores";

    const theme = Store.Theme.create();
</script>

<section>
    <UI.Text.Label primary={lang.get()["settings misc"]["theme picker"]} row>
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
