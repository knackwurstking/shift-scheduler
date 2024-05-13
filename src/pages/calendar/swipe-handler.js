import ui from "ui";

/**
 * @typedef {"left" | "right"} Direction
 * @typedef {import(".").CalendarPage} CalendarPage 
 *
 * @typedef {{
 *  swipe: Direction
 * }} _Events
 */

export const swipeRange = 75;

/** @extends {ui.js.events.Events<_Events>} */
export class SwipeHandler extends ui.js.events.Events {
    /** @type {number | null} */
    #startX = null;
    /** @type {number | null} */
    #clientX = null;

    /** @type {boolean} */
    #finalTransform = false;

    /**
     * @param {CalendarPage} calendar
     */
    constructor(calendar) { // {{{
        super();

        this.calendar = calendar;

        this.onMouseMove;
        this.onTouchMove;
        this.onTouchEnd;
        this.onTouchCancel;
        this.kill;
        this.animationFrameHandler;
    } // }}}

    start() { // {{{
        /** @type {((ev: MouseEvent) => void|Promise<void>)} */
        this.onMouseMove = async (ev) => { // {{{
            if (this.#finalTransform) return;

            if (ev.buttons === 1) { // primary button
                if (this.#startX === null) this.#startX = ev.clientX;
                this.#clientX = ev.clientX;
            }
        }; // }}}

        /** @type {((ev: TouchEvent) => void|Promise<void>)} */
        this.onTouchMove = async (ev) => { // {{{
            if (this.#finalTransform) return;

            if (this.#startX === null) this.#startX = ev.touches[0].clientX;
            this.#clientX = ev.touches[0].clientX;
        }; // }}}

        /** @type {((ev: TouchEvent | MouseEvent) => void|Promise<void>)} */
        this.onTouchEnd = async (ev) => { // {{{
            if (this.#startX === null || this.#finalTransform) return;
            this.#finalTransform = true;

            // Start final transform
            console.debug(`[Calendar SwipeHandler] transform lock`);

            if (!this.isMinSwipe()) {
                this.setTransition(`left ${0.15}s ease`);
                this.moveX(0);
                setTimeout(() => this.resetSwipe(), 150);
                return;
            }

            // @ts-ignore
            const r = ev.currentTarget.getBoundingClientRect();
            this.setTransition(`left ${0.3}s ease`);
            this.moveX(
                this.#clientX > this.#startX ? +(r.width + 1) : -r.width + 1,
            );
            setTimeout(() => this.resetSwipe(), 300);
        }; // }}}

        /** @type {((ev: TouchEvent | MouseEvent) => void|Promise<void>)} */
        this.onTouchCancel = async (ev) => { // {{{
            if (this.#startX !== null) await this.onTouchEnd(ev);
        }; // }}}

        /** @type {boolean} */
        this.kill = false;

        /** @type {(() => void|Promise<void>)} */
        this.animationFrameHandler = async () => { // {{{
            if (this.kill) return;
            if (this.#finalTransform || this.#startX === null) {
                requestAnimationFrame(this.animationFrameHandler);
                return;
            }

            this.moveX(this.#clientX - this.#startX);
            requestAnimationFrame(this.animationFrameHandler);
        }; // }}}

        this.calendar.addEventListener("mousemove", this.onMouseMove, { passive: true });
        this.calendar.addEventListener("mouseup", this.onTouchEnd);
        this.calendar.addEventListener("mouseout", this.onTouchEnd);

        this.calendar.addEventListener("touchmove", this.onTouchMove, { passive: true });
        this.calendar.addEventListener("touchend", this.onTouchEnd);
        this.calendar.addEventListener("touchcancel", this.onTouchCancel);

        requestAnimationFrame(this.animationFrameHandler);
    } // }}}

    stop() { // {{{
        this.calendar.removeEventListener("touchmove", this.onTouchMove);
        this.calendar.removeEventListener("touchend", this.onTouchEnd);
        this.calendar.removeEventListener("touchcancel", this.onTouchCancel);

        this.kill = false;
    } // }}}

    isMinSwipe() { // {{{
        return (
            Math.abs(this.#startX - this.#clientX) >
            swipeRange * (window.innerWidth / 1080)
        );
    } // }}}

    /**
     * @param {number} dX - always the value for the center item
     */
    moveX(dX) { // {{{
        // NOTE: -100% | 0% | 100%
        const items = this.calendar.getItems();

        // @ts-ignore
        items[0].style.left = `calc(-100% + ${dX}px)`;
        // @ts-ignore
        items[1].style.left = `calc(0% + ${dX}px)`;
        // @ts-ignore
        items[2].style.left = `calc(100% + ${dX}px)`;
    } // }}}

    /**
     * @param {string} value
     */
    setTransition(value) { // {{{
        const items = this.calendar.getItems();

        // @ts-ignore
        items.forEach((c) => (c.style.transition = value));
    } // }}}

    /** @private */
    resetSwipe() { // {{{
        // Reset final transform
        this.setTransition("none");
        if (this.isMinSwipe()) {
            this.reorderItems();
        }
        this.#startX = null;
        this.#clientX = null;
        this.#finalTransform = false;

        console.debug(`[Calendar SwipeHandler] release transform lock`);
    } // }}}

    /** @private */
    reorderItems() { // {{{
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
        this.dispatch("swipe", direction);
    }
} // }}}
