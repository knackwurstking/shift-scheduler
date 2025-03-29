import * as ui from "ui";

export type Direction = "left" | "right";

export const swipeRange = 75;

export class SwipeHandler extends ui.Events<{ swipe: Direction }> {
    public container: HTMLElement;

    protected finalTransform: boolean = false;
    protected startX: number | null = null;
    protected clientX: number | null = null;

    protected onMouseMove?: (ev: MouseEvent & { currentTarget: Element }) => Promise<void>;
    protected onTouchMove?: (ev: TouchEvent & { currentTarget: Element }) => Promise<void>;

    protected onMouseOrTouchEnd?: (
        ev: (TouchEvent | MouseEvent) & { currentTarget: Element },
    ) => Promise<void>;

    protected onTouchCancel?: (ev: TouchEvent & { currentTarget: Element }) => Promise<void>;

    protected animationFrameHandler?: () => Promise<void>;

    constructor(container: HTMLElement) {
        super();

        this.container = container;
    }

    public start() {
        this.onMouseMove = async (ev) => {
            if (this.finalTransform) return;

            if (ev.buttons === 1) {
                if (this.startX === null) {
                    this.startX = ev.clientX;
                    this.containerItems().forEach((item) => item.classList.add("moving"));
                }

                this.clientX = ev.clientX;
            }
        };

        this.onTouchMove = async (ev) => {
            if (this.finalTransform) return;

            if (this.startX === null) {
                this.startX = ev.touches[0].clientX;
                this.containerItems().forEach((item) => item.classList.add("moving"));
            }

            this.clientX = ev.touches[0].clientX;
        };

        this.onMouseOrTouchEnd = async (ev) => {
            if (this.startX === null || this.clientX === null || this.finalTransform) return;
            this.finalTransform = true;

            if (!this.isMinSwipe()) {
                this.setTransition(`left ${0.15}s ease`);
                this.moveX(0);
                setTimeout(() => this.resetSwipe(), 150);
                return;
            }

            const r = ev.currentTarget.getBoundingClientRect();
            this.setTransition(`left ${0.3}s ease`);
            this.moveX(this.clientX > this.startX ? +(r.width + 1) : -r.width + 1);
            setTimeout(() => this.resetSwipe(), 300);
        };

        this.onTouchCancel = async (ev) => {
            if (this.startX !== null) await this.onMouseOrTouchEnd!(ev);
        };

        this.animationFrameHandler = async () => {
            if (this.finalTransform || this.startX === null || this.clientX === null) {
                requestAnimationFrame(this.animationFrameHandler!);
                return;
            }

            this.moveX(this.clientX - this.startX);
            requestAnimationFrame(this.animationFrameHandler!);
        };

        this.container.addEventListener(
            "mousemove",
            this.onMouseMove as (this: HTMLElement, ev: MouseEvent) => any,
            { passive: true },
        );

        this.container.addEventListener(
            "mouseup",
            this.onMouseOrTouchEnd as (this: HTMLElement, ev: MouseEvent) => any,
        );

        this.container.addEventListener(
            "mouseout",
            this.onMouseOrTouchEnd as (this: HTMLElement, ev: MouseEvent) => any,
        );

        this.container.addEventListener(
            "touchmove",
            this.onTouchMove as (this: HTMLElement, ev: TouchEvent) => any,
            { passive: true },
        );

        this.container.addEventListener(
            "touchend",
            this.onMouseOrTouchEnd as (this: HTMLElement, ev: TouchEvent) => any,
        );

        this.container.addEventListener(
            "touchcancel",
            this.onTouchCancel as (this: HTMLElement, ev: TouchEvent) => any,
        );

        requestAnimationFrame(this.animationFrameHandler);
    }

    public stop() {
        if (!!this.onMouseMove) {
            this.container.removeEventListener(
                "mousemove",
                this.onMouseMove as (this: HTMLElement, ev: MouseEvent) => any,
            );
        }

        if (!!this.onMouseOrTouchEnd) {
            this.container.removeEventListener(
                "mouseup",
                this.onMouseOrTouchEnd as (this: HTMLElement, ev: MouseEvent) => any,
            );

            this.container.removeEventListener(
                "mouseout",
                this.onMouseOrTouchEnd as (this: HTMLElement, ev: MouseEvent) => any,
            );

            this.container.removeEventListener(
                "touchend",
                this.onMouseOrTouchEnd as (this: HTMLElement, ev: TouchEvent) => any,
            );
        }

        if (!!this.onTouchMove) {
            this.container.removeEventListener(
                "touchmove",
                this.onTouchMove as (this: HTMLElement, ev: TouchEvent) => any,
            );
        }

        if (!!this.onTouchCancel) {
            this.container.removeEventListener(
                "touchcancel",
                this.onTouchCancel as (this: HTMLElement, ev: TouchEvent) => any,
            );
        }
    }

    protected containerItems(): HTMLElement[] {
        return Array.from(this.container.children) as HTMLElement[];
    }

    protected isMinSwipe(): boolean {
        if (this.startX === null || this.clientX === null) return false;
        return Math.abs(this.startX - this.clientX) > swipeRange * (window.innerWidth / 1080);
    }

    protected moveX(dX: number): void {
        // NOTE: -100% | 0% | 100%
        const items = this.containerItems();

        items[0].style.left = `calc(-100% + ${dX}px)`;
        items[1].style.left = `calc(0% + ${dX}px)`;
        items[2].style.left = `calc(100% + ${dX}px)`;
    }

    protected setTransition(value: string): void {
        const items = this.containerItems();
        items.forEach((c) => (c.style.transition = value));
    }

    protected resetSwipe(): void {
        // Reset final transform
        this.setTransition("none");

        if (this.isMinSwipe()) {
            this.reorderItems();
        }

        this.startX = null;
        this.clientX = null;
        this.finalTransform = false;
        this.containerItems().forEach((item) => item.classList.remove("moving"));
    }

    protected reorderItems(): void {
        if (this.startX === null || this.clientX === null) return;

        const items = this.containerItems();
        const direction = this.clientX > this.startX ? "right" : "left";
        switch (direction) {
            case "left":
                // The first item will be the last
                this.container.appendChild(this.container.removeChild(items[0]));
                break;
            case "right":
                // The last item will be the first
                this.container.insertBefore(this.container.removeChild(items[2]), items[0]);
                break;
        }

        this.moveX(0);
        this.dispatch("swipe", direction);
    }
}
