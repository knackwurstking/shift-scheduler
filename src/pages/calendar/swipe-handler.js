import ui from "ui";
import { constants } from "../../lib";

/**
 * @typedef Direction
 * @type {"left" | "right"}
 */

export default class SwipeHandler extends ui.events.Events {
    /** @type {boolean} */
    #kill = false;

    /** @type {number | null} */
    #startX = null;
    /** @type {number | null} */
    #clientX = null;

    /** @type {boolean} */
    #finalTransform = false;

    /** @type {((ev: TouchEvent) => void|Promise<void>)} */
    #onTouchMove = async (ev) => {
        if (this.#finalTransform) return;
        if (this.#startX === null) this.#startX = ev.touches[0].clientX;
        this.#clientX = ev.touches[0].clientX;
    };

    /** @type {((ev: TouchEvent) => void|Promise<void>)} */
    #onTouchEnd = async (ev) => {
        if (this.#startX === null || this.#finalTransform) return;
        this.#finalTransform = true;

        // Start final transform
        if (constants.debug)
            console.log(`[Calendar SwipeHandler] transform lock`);

        if (!this.isMinSwipe()) {
            this.setTransition(`left ${0.15}s ease`);
            this.moveX(0);
            setTimeout(() => this.#resetSwipe(), 150);
            return;
        }

        // @ts-ignore
        const r = ev.currentTarget.getBoundingClientRect();
        this.setTransition(`left ${0.3}s ease`);
        this.moveX(
            this.#clientX > this.#startX ? +(r.width + 1) : -r.width + 1,
        );
        setTimeout(() => this.#resetSwipe(), 300);
    };

    /** @type {((ev: TouchEvent) => void|Promise<void>)} */
    #onTouchCancel = async (ev) => {
        if (this.#startX !== null) await this.#onTouchEnd(ev);
    };

    /** @type {(() => void|Promise<void>)} */
    #animationFrameHandler = async () => {
        if (this.#kill) return;
        if (this.#finalTransform || this.#startX === null) {
            requestAnimationFrame(this.#animationFrameHandler);
            return;
        }

        this.moveX(this.#clientX - this.#startX);
        requestAnimationFrame(this.#animationFrameHandler);
    };

    /**
     * @param {import(".").CalendarPage} calendar
     */
    constructor(calendar) {
        super(constants.debug);
        this.calendar = calendar;
    }

    start() {
        this.calendar.addEventListener("touchmove", this.#onTouchMove);
        this.calendar.addEventListener("touchend", this.#onTouchEnd);
        this.calendar.addEventListener("touchcancel", this.#onTouchCancel);

        requestAnimationFrame(this.#animationFrameHandler);
    }

    stop() {
        this.calendar.removeEventListener("touchmove", this.#onTouchMove);
        this.calendar.removeEventListener("touchend", this.#onTouchEnd);
        this.calendar.removeEventListener("touchcancel", this.#onTouchCancel);

        this.#kill = false;
    }

    /**
     * @param {"swipe"} key
     * @param {Direction} data
     */
    dispatchWithData(key, data) {
        super.dispatchWithData(key, data);
        return this;
    }

    /**
     * @param {"swipe"} key
     * @param {(data: Direction) => void|Promise<void>} listener
     * @returns {() => void} clean up function
     */
    addListener(key, listener) {
        return super.addListener(key, listener);
    }

    /**
     * @param {"swipe"} key
     * @param {(data: "left" | "right" | "none") => void|Promise<void>} listener
     */
    removeListener(key, listener) {
        super.removeListener(key, listener);
        return this;
    }

    /**
     * @param {number} dX - always the value for the center item
     */
    moveX(dX) {
        // NOTE: -100% | 0% | 100%
        const items = this.calendar.getItems();

        // @ts-ignore
        items[0].style.left = `calc(-100% + ${dX}px)`;
        // @ts-ignore
        items[1].style.left = `calc(0% + ${dX}px)`;
        // @ts-ignore
        items[2].style.left = `calc(100% + ${dX}px)`;
    }

    /**
     * @param {string} value
     */
    setTransition(value) {
        const items = this.calendar.getItems();

        // @ts-ignore
        items.forEach((c) => (c.style.transition = value));
    }

    isMinSwipe() {
        return (
            Math.abs(this.#startX - this.#clientX) >
            constants.swipeRange * (window.innerWidth / 1080)
        );
    }

    #resetSwipe() {
        // Reset final transform
        this.setTransition("none");
        if (this.isMinSwipe()) {
            this.#reorderItems();
        }
        this.#startX = null;
        this.#clientX = null;
        this.#finalTransform = false;

        if (constants.debug)
            console.log(`[Calendar SwipeHandler] release transform lock`);
    }

    #reorderItems() {
        const items = this.calendar.getItems();
        const direction = this.#clientX > this.#startX ? "right" : "left";
        switch (direction) {
            case "left":
                // The first item will be the last
                this.calendar.shadowRoot.appendChild(
                    this.calendar.shadowRoot.removeChild(items[0]),
                );
                break;
            case "right":
                // The last item will be the first
                this.calendar.shadowRoot.insertBefore(
                    this.calendar.shadowRoot.removeChild(items[2]),
                    items[0],
                );
                break;
        }

        this.moveX(0);
        this.dispatchWithData("swipe", direction);
    }
}
