export default class StackLayout {
    /**
     * @param {HTMLElement}
     */
    constructor(container) {
        this.container = container
        this.pageClassName = "stack-layout-page"
    }

    back() {
        const children = [...this.container.children].reverse()

        const el = children.find(c => c.classList.contains(this.pageClassName))
        if (!!el) rootContainer.removeChild(el)

        return this
    }

    /**
     * @param {HTMLElement}
     */
    setPage(page) {
        page.classList.add(this.pageClassName)
        this.container.appendChild(page)

        return this
    }
}
