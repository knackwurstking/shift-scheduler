<script>
    /** @type {number} */
    export let currentMonth;
    /** @type {import(".").Day} */
    export let day;
</script>

<div
    class="day-content"
    class:disabled={day.date.getMonth() !== currentMonth}
    class:today={
        day.date.getFullYear() === (new Date().getFullYear()) &&
        day.date.getMonth() === (new Date().getMonth()) &&
        day.date.getDate() === (new Date().getDate())
    }
    data-value={`${(day.date.getMonth() === currentMonth) ? day.date.getDate() : NaN}`}
>
</div>