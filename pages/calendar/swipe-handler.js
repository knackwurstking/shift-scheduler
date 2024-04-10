import constants from "../../lib/constants"

export default class SwipeHandler {
    /** @type {HTMLElement} */
    #root
    /** @type {boolean} */
    #destroy

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
     */
    constructor(root) {
        this.#root = root
        this.#destroy = false

        this.#startX = null
        this.#clientX = null
        this.#finalTransformRunning = false

        this.#onTouchMove = async (ev) => {
            if (this.#finalTransformRunning) return;
            if (this.#startX === null) this.#startX = ev.touches[0].clientX;
            this.#clientX = ev.touches[0].clientX
        }

        this.#onTouchEnd = async () => {
            if (this.#startX === null) return;

            const clientX = this.#clientX
            const startX = this.#startX
            let swipeDirection = "none"

            this.#clientX = this.#startX = null

            this.#finalTransformRunning = true
            this.#setTransition("transform 0.25s ease")
            if (Math.abs(startX - clientX) > constants.swipeRange * (window.innerWidth / 1080)) {
                this.#transform(clientX < startX ? "100%" : "-100%")
                swipeDirection = clientX > startX ? "right" : "left"
            } else {
                this.#transform("0%")
            }
            setTimeout(() => {
                this.#setTransition("none")
                this.#reorderItems(swipeDirection)
                this.#finalTransformRunning = false
            }, 250)
        }

        this.#onTouchCancel = async (ev) => {
            if (this.#startX !== null) await this.#onTouchEnd(ev);
        }

        this.#animationFrameHandler = async () => {
            if (this.#destroy) return
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
        this.#root.removeEventListener("touchmove", this.#onTouchMove)
        this.#root.removeEventListener("touchend", this.#onTouchEnd)
        this.#root.removeEventListener("touchcancel", this.#onTouchCancel)

        this.#destroy = false
    }

    /**
     * @param {string} diff
     */
    #transform(diff) {
        for (let x = 0; x < this.#root.children.length; x++) {
            // @ts-ignore
            this.#root.children[x].style.transform = `translateX(calc(-100% - ${diff}))`
        }
    }

    /**
     * @param {string} value
     */
    #setTransition(value) {
        for (let x = 0; x < this.#root.children.length; x++) {
            // @ts-ignore
            this.#root.children[x].style.transition = value
        }
    }

    /**
     * @param {"left" | "right" | "none" | string} swipeDirection
     */
    #reorderItems(swipeDirection) {
        // TODO: needs testing, use the current date for that
        switch (swipeDirection) {
            case "left":
                // The first item will be the last
                this.#root.appendChild(this.#root.removeChild(this.#root.firstChild))
                break
            case "right":
                // The last item will be the first
                this.#root.insertBefore(
                    this.#root.removeChild(this.#root.lastChild),
                    this.#root.children[0]
                )
                break
            case "none":
                break
            default:
                throw `Ooop, what is this for a direction "${swipeDirection}"?`
        }

        this.#transform("0%")
    }
}
