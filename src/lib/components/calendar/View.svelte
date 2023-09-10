<script>
    import * as utils from "../../js/utils";
    import * as db from "../../js/db";

    /** @type {Month[]} */
    let months;
    $: !!months && console.debug("months:", ...months);

    /** @type {number} */
    export let currentMonthCount;
    $: typeof currentMonthCount === "number" && getMonths();

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
        console.debug("get months...", { currentMonthCount, settings })
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
                    date: date.getDate(),
                    disable: disable,
                    today: !!(
                        today.getFullYear() === date.getFullYear() &&
                        today.getMonth() === date.getMonth() &&
                        today.getDate() === date.getMonth()
                    ),
                    defaultShift: disable ? null : utils.calcShiftStep(settings, date),
                    data: disable ? null : await getData(date),
                })
            }
            data.push({
                monthCount: monthCount,
                data: monthData,
            });
        }
        return data;
    }

    /** @param {Date} date */
    function getData(date) {
        return new Promise((resolve) => {
            db.open().then(() => {
                db.get(date, (item) => {
                    resolve({
                        note: item.note,
                        shift: item.shift,
                    })
                }).catch((err) => {
                    console.error(err);
                    resolve(null)
                })
            }).catch((err) => {
                console.error(err);
                resolve(null)
            });
        });
    }
</script>

<div class="_container">
    {#each months as month}
        <div class="_month">
        </div>
    {/each}
</div>

<style>
    div._container {
    }

    div._month {
    }
</style>