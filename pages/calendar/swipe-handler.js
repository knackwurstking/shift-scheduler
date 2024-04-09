export default class SwipeHandler {
    /** @type {HTMLElement} */
    #root
    /** @type {string} */
    #itemQuery

    /** @type {HTMLElement[]} */
    #items

    /** @type {((ev: TouchEvent) => void|Promise<void>)} */
    #onTouchMove
    /** @type {((ev: TouchEvent) => void|Promise<void>)} */
    #onTouchEnd
    /** @type {((ev: TouchEvent) => void|Promise<void>)} */
    #onTouchCancel
    /** @type {(() => void|Promise<void>)} */
    #animationFrameHandler

    /** @type {number | null} */
    #startX
    /** @type {number | null} */
    #clientX

    /** @type {boolean} */
    #finalTransformRunning

    /**
     * @param {HTMLElement} root
     * @param {string} itemQuery
     */
    constructor(root, itemQuery) {
        this.#root = root
        this.#itemQuery = itemQuery

        this.#startX = null
        this.#clientX = null
        this.#finalTransformRunning = false

        // @ts-ignore
        this.#items = [...this.#root.querySelectorAll(this.#itemQuery)]

        this.#onTouchMove = async (ev) => {
            if (this.#finalTransformRunning) return;
            if (this.#startX === null) this.#startX = ev.touches[0].clientX;
            this.#clientX = ev.touches[0].clientX
        }

        this.#onTouchEnd = async (ev) => {
            if (this.#startX === null) throw `Ooops, how could this happen :)`; // should never happen (i think)

            const clientX = this.#clientX // TODO: modify this value to max left/right
            const startX = this.#startX

            this.#clientX = this.#startX = null

            this.#finalTransformRunning = true
            this.#setTransition("transform 0.25s ease")
            this.#transform(clientX < startX ? "100%" : "-100%")
            setTimeout(() => {
                this.#setTransition("none")
                // TODO: reorder items (the last one will be the first one, and so on)
                this.#finalTransformRunning = false
            }, 250)
        }

        this.#onTouchCancel = async (ev) => {
            if (this.#startX !== null) await this.#onTouchEnd(ev);
        }

        this.#animationFrameHandler = async () => {
            if (this.#startX === null) {
                requestAnimationFrame(this.#animationFrameHandler)
                return
            };

            this.#transform(`${this.#startX - this.#clientX}px`)
            requestAnimationFrame(this.#animationFrameHandler)
        }
    }

    start() {
        this.#root.addEventListener("touchmove", this.#onTouchMove)
        this.#root.addEventListener("touchend", this.#onTouchEnd)
        this.#root.addEventListener("touchcancel", this.#onTouchCancel)

        requestAnimationFrame(this.#animationFrameHandler)
    }

    stop() {
        // TODO: Kill the animation frame handler
    }

    /**
     * @param {string} diff
     */
    #transform(diff) {
        for (let x = 0; x < this.#items.length; x++) {
            this.#items[x].style.transform = `translateX(calc(-100% - ${diff}))`
        }
    }

    /**
     * @param {string} value
     */
    #setTransition(value) {
        for (let x = 0; x < this.#items.length; x++) {
            this.#items[x].style.transition = value
        }
    }
}
