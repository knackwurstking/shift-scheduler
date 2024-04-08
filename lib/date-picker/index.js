export default class DatePicker {
    /**
     * @param {Date} date
     */
    constructor(date) {
        this.date = date
    }

    toMonthString() {
        return `${this.date.getFullYear()} / ${(this.date.getMonth() + 1).toString().padStart(2, "0")}`
    }
}
