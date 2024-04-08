<script>
    import { UI } from "ui";

    import { lang } from "../../lib/js";
    import * as Store from "../../lib/stores";

    const weekStart = Store.WeekStart.create();
</script>

<section>
    <UI.Text.Label
        style="cursor: pointer;"
        primary={lang.get()["settings misc"]["week start"]}
        useLabel
        row
    >
        <input
            type="checkbox"
            checked={$weekStart === "mon"}
            on:change={(ev) => {
                if (ev.currentTarget.checked) weekStart.monday();
                else weekStart.sunday();
            }}
        />
    </UI.Text.Label>
</section>
