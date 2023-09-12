<script>
    import MonthContainer from "./MonthContainer.svelte";

    import * as utils from "../../js/utils";
    import * as db from "../../js/db";

    /** @type {number} */
    export let currentMonthCount;
    $: typeof currentMonthCount === "number" && getMonths().then((data) => (months = data));

    /** @type {Shift | null} */
    export let editModeShift;

    /** @type {Month[]} */
    let months = [];
    $: console.debug(months);

    /** @type {Settings} */
    let settings = JSON.parse(localStorage.getItem("settings") || "{}");
    $: {
        if (settings) {
            if (typeof settings.startDate === "string") {
                settings.startDate = new Date(settings.startDate);
            }
        }
    }

    /** @type {HTMLDivElement} */
    let container;
    $: !!container && initContainer();

    function initContainer() {
        setTimeout(() => {
            if (container.children.length < 3) initContainer();
            else resetScroll(container);
        }, 250);
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
            const current = new Date(today.getFullYear(), today.getMonth() + monthCount, 1);
            for (let d = 0; d < 42; d++) {
                const date = new Date(
                    current.getFullYear(),
                    current.getMonth() + monthCount,
                    current.getDate() + (d - current.getDay())
                );

                const disable = date.getMonth() !== current.getMonth();

                monthData.push({
                    date: date,
                    disable: disable,
                    today: !!(
                        today.getFullYear() === date.getFullYear() &&
                        today.getMonth() === date.getMonth() &&
                        today.getDate() === date.getDate()
                    ),
                    defaultShift: disable ? null : utils.calcShiftStep(settings, date),
                    data: {
                        shift: null,
                        note: "",
                    },
                });
            }

            data.push({
                monthCount: monthCount,
                data: monthData,
            });
        }
        console.debug(currentMonthCount, data)
        return data;
    }

    /**
     *
     * @param {HTMLDivElement} target
     */
    function resetScroll(target) {
        target.scrollTop = target.clientHeight;
    }
</script>

<div
    bind:this={container}
    class="_container"
    on:scroll={(ev) => {
        switch (ev.currentTarget.scrollTop) {
            case 0:
                // scroll up
                ev.currentTarget.insertBefore(
                    ev.currentTarget.removeChild(ev.currentTarget.children[2]),
                    ev.currentTarget.firstChild
                );
                // NOTE: resetScroll will trigger a new scroll event
                currentMonthCount -= 2;
                resetScroll(ev.currentTarget);
            case ev.currentTarget.clientHeight * 2:
                // scroll down
                ev.currentTarget.appendChild(ev.currentTarget.removeChild(ev.currentTarget.children[0]));
                currentMonthCount += 1;
                resetScroll(ev.currentTarget);
        }
    }}
>
    {#each months as month}
        <div class="_month">
            <MonthContainer data={month.data} {editModeShift} />
        </div>
    {/each}
</div>

<style>
    div._container {
        width: 100%;
        height: 100%;

        overflow: scroll;
        scroll-snap-type: y mandatory;

        -ms-overflow-style: none;
        scrollbar-width: none;
    }

    div._container::-webkit-scrollbar {
        display: none;
    }

    div._container div._month {
        width: 100%;
        height: 100%;

        scroll-snap-align: center;
    }
</style>
