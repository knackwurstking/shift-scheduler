import { events } from "ui";
import constants from "../../lib/constants";

export default class SwipeHandler extends events.Events {
  /** @type {HTMLElement} */
  #root;
  /** @type {boolean} */
  #kill;

  /** @type {((ev: TouchEvent) => void|Promise<void>)} */
  #onTouchMove;
  /** @type {((ev: TouchEvent) => void|Promise<void>)} */
  #onTouchEnd;
  /** @type {((ev: TouchEvent) => void|Promise<void>)} */
  #onTouchCancel;

  /** @type {(() => void|Promise<void>)} */
  #animationFrameHandler;

  /** @type {number | null} */
  #startX;
  /** @type {number | null} */
  #clientX;

  /** @type {boolean} */
  #finalTransformRunning;

  /**
   * @param {HTMLElement} root
   */
  constructor(root) {
    super();

    this.#root = root;
    this.#kill = false;

    this.#startX = null;
    this.#clientX = null;
    this.#finalTransformRunning = false;

    this.#onTouchMove = async (ev) => {
      if (this.#finalTransformRunning) return;
      if (this.#startX === null) this.#startX = ev.touches[0].clientX;
      this.#clientX = ev.touches[0].clientX;
    };

    this.#onTouchEnd = async () => {
      if (this.#startX === null) return;

      const clientX = this.#clientX;
      const startX = this.#startX;
      let swipeDirection = "none";

      this.#clientX = this.#startX = null;

      this.#finalTransformRunning = true;
      let transitionTime = 0.4;
      if (
        Math.abs(startX - clientX) >
        constants.swipeRange * (window.innerWidth / 1080)
      ) {
        swipeDirection = clientX > startX ? "right" : "left";
        this.#setTransition(`transform ${transitionTime}s ease`);
        this.#transform(swipeDirection === "left" ? "100%" : "-100%");
      } else {
        transitionTime /= 4;
        this.#setTransition(`transform ${transitionTime.toFixed(3)}s ease`);
        this.#transform("0%");
      }

      setTimeout(
        () => {
          this.#setTransition("none");
          this.#reorderItems(swipeDirection);
          this.#finalTransformRunning = false;
        },
        Math.floor(transitionTime * 1000),
      );
    };

    this.#onTouchCancel = async (ev) => {
      if (this.#startX !== null) await this.#onTouchEnd(ev);
    };

    this.#animationFrameHandler = async () => {
      if (this.#kill) return;
      if (this.#startX === null) {
        requestAnimationFrame(this.#animationFrameHandler);
        return;
      }

      this.#transform(`${this.#startX - this.#clientX}px`);
      requestAnimationFrame(this.#animationFrameHandler);
    };
  }

  start() {
    this.#root.addEventListener("touchmove", this.#onTouchMove);
    this.#root.addEventListener("touchend", this.#onTouchEnd);
    this.#root.addEventListener("touchcancel", this.#onTouchCancel);

    requestAnimationFrame(this.#animationFrameHandler);
  }

  stop() {
    this.#root.removeEventListener("touchmove", this.#onTouchMove);
    this.#root.removeEventListener("touchend", this.#onTouchEnd);
    this.#root.removeEventListener("touchcancel", this.#onTouchCancel);

    this.#kill = false;
  }

  /**
   * @param {"swipe"} key
   * @param {"left" | "right" | "none"} data
   */
  dispatchWithData(key, data) {
    super.dispatchWithData(key, data);
    return this;
  }

  /**
   * @param {"swipe"} key
   * @param {(data: "left" | "right" | "none") => void|Promise<void>} listener
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
   * @param {string} diff
   */
  #transform(diff) {
    for (let x = 0; x < this.#root.children.length; x++) {
      // @ts-ignore
      this.#root.children[x].style.transform =
        `translateX(calc(-100% - ${diff}))`;
    }
  }

  /**
   * @param {string} value
   */
  #setTransition(value) {
    for (let x = 0; x < this.#root.children.length; x++) {
      // @ts-ignore
      this.#root.children[x].style.transition = value;
    }
  }

  /**
   * @param {"left" | "right" | "none" | string} swipeDirection
   */
  #reorderItems(swipeDirection) {
    switch (swipeDirection) {
      case "left":
        // The first item will be the last
        this.#root.appendChild(this.#root.removeChild(this.#root.firstChild));
        break;
      case "right":
        // The last item will be the first
        this.#root.insertBefore(
          this.#root.removeChild(this.#root.lastChild),
          this.#root.children[0],
        );
        break;
      case "none":
        break;
      default:
        throw `Ooop, what is this for a direction "${swipeDirection}"?`;
    }

    this.#transform("0%");
    this.dispatchWithData("swipe", swipeDirection);
  }
}
