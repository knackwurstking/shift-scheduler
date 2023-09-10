<script>
    import MonthContainer from "./MonthContainer.svelte";

    import * as utils from "../../js/utils";
    import * as db from "../../js/db";

    /** @type {Month[]} */
    let months = [];

    /** @type {number} */
    export let currentMonthCount;
    $: typeof currentMonthCount === "number" && getMonths().then(data => months = data);

    /** @type {Settings} */
    let settings = JSON.parse(localStorage.getItem("settings") || "{}");
    $: {
        if (settings) {
            if (typeof settings.startDate === "string") {
                settings.startDate = new Date(settings.startDate);
            }
        }
    }

    async function getMonths() {
        await db.open();

        /** @type {Month[]} */
        const data = [];
        const today = new Date();
        for (let m = -1; m < 2; m++) {
            const monthCount = currentMonthCount + m;
            /** @type {Day[]} */
            const monthData = [];

            for (let d = 0; d < 42; d++) {
                const currentMonth = new Date(
                    today.getFullYear(),
                    today.getMonth() + monthCount,
                    1
                ).getMonth();
                const date = new Date(
                    today.getFullYear(),
                    today.getMonth() + monthCount,
                    today.getDay() + (d - today.getDay())
                );

                const disable = date.getMonth() !== currentMonth;

                monthData.push({
                    date: date,
                    disable: disable,
                    today: !!(
                        today.getFullYear() === date.getFullYear() &&
                        today.getMonth() === date.getMonth() &&
                        today.getDate() === date.getDate()
                    ),
                    defaultShift: disable ? null : utils.calcShiftStep(settings, date),
                    data: null,
                })
            }

            data.push({
                monthCount: monthCount,
                data: monthData,
            });
        }
        return data;
    }
</script>

<div class="_container">
    {#each months as month}
        <div class="_month">
            <MonthContainer
                data={month.data}
            />
        </div>
    {/each}
</div>

<style>
    div._container {
    }

    div._container div._month {
    }
</style>