import { DBEntry } from "@types";

export class DB {
    public version: number;
    public name: string;

    protected storeName: string = "user";
    protected request: IDBOpenDBRequest | null = null;

    constructor(name: string, version: number) {
        this.name = name;
        this.version = version;
    }

    public open(cb?: (() => void | Promise<void>) | null): void {
        this.request = window.indexedDB.open(this.name, this.version);
        this.request.onerror = this.onError.bind(this);
        this.request.onblocked = this.onBlocked.bind(this);

        this.request.onsuccess = () => {
            if (!!cb) cb();
        };

        this.request.onupgradeneeded = this.onUpgradeNeeded.bind(this);
    }

    public close() {
        if (this.request !== null) this.request.result.close();
    }

    public get(
        year: number,
        month: number,
        date: number,
    ): Promise<DBEntry | null> {
        return new Promise((resolve) => {
            const r = this.roStore().get([year, month, date]);

            r.onsuccess = () => resolve(r.result || null);
            r.onerror = () => resolve(null);
        });
    }

    public getAll(): Promise<DBEntry[]> {
        return new Promise((resolve) => {
            const r = this.roStore().getAll();

            r.onsuccess = () => resolve(r.result);
            r.onerror = (e) => {
                console.warn(
                    `[DB] Error while getting all data from the store: "${this.storeName}"`,
                    e,
                );
                resolve([]);
            };
        });
    }

    public add(data: DBEntry): Promise<void> {
        return new Promise((resolve, reject) => {
            const r = this.rwStore().add(data);

            r.onsuccess = () => resolve();
            r.onerror = async (ev) => {
                console.warn(
                    `[DB] Error while adding "${data.year}-${data.month}-${data.date}" to "${this.storeName}"!`,
                    ev,
                );
                reject(r.error);
            };
        });
    }

    public put(data: DBEntry): Promise<void> {
        return new Promise((resolve, reject) => {
            const r = this.rwStore().put(data);

            r.onsuccess = () => resolve();
            r.onerror = async (ev) => {
                console.warn(
                    `[DB] Error while putting "${data.year}-${data.month}-${data.date}" to "${this.storeName}"!`,
                    ev,
                );
                reject(r.error);
            };
        });
    }

    public delete(year: number, month: number, date: number): Promise<void> {
        return new Promise((resolve, reject) => {
            const r = this.rwStore().delete([year, month, date]);

            r.onsuccess = () => resolve();
            r.onerror = () => {
                reject(r.error);
            };
        });
    }

    public deleteAll(): Promise<void> {
        return new Promise((resolve, reject) => {
            const r = this.rwStore().clear();

            r.onsuccess = () => resolve();
            r.onerror = () => {
                reject(r.error);
            };
        });
    }

    protected roStore(): IDBObjectStore {
        if (this.request === null) throw `request is null, run open first!`;

        return this.request.result
            .transaction(this.storeName, "readonly")
            .objectStore(this.storeName);
    }

    protected rwStore(): IDBObjectStore {
        if (this.request === null) throw `request is null, run open first!`;

        return this.request.result
            .transaction(this.storeName, "readwrite")
            .objectStore(this.storeName);
    }

    protected createStore(db: IDBDatabase): void {
        if (!db.objectStoreNames.contains(this.storeName)) {
            const o = db.createObjectStore(this.storeName, {
                autoIncrement: false,
                keyPath: ["year", "month", "date"],
            });

            o.createIndex("year", "year", { unique: false });
            o.createIndex("month", "month", { unique: false });
            o.createIndex("date", "date", { unique: false });
            o.createIndex("note", "note", { unique: false });
            o.createIndex("shift", "shift", { unique: false });
        }
    }

    protected onError(ev: Event): void {
        console.error(`[DBCustom] Handle request failed: ${this.name}`, {
            error: this.request?.error || null,
            event: ev,
        });

        alert(`[DBCustom] Handle request failed: ${this.name} (see console)`);
    }

    protected onBlocked(ev: IDBVersionChangeEvent): void {
        console.warn(`[DBCustom] Handle request blocked: ${this.name}`, {
            error: this.request?.error || null,
            event: ev,
        });
        alert(`[DBCustom] Handle request blocked: ${this.name} (see console)`);
    }

    protected onUpgradeNeeded(ev: IDBVersionChangeEvent): void {
        switch (ev.oldVersion) {
            case 0:
                if (this.request === null)
                    throw `request is null, run open first!`;
                this.createStore(this.request.result);
                break;
        }
    }
}
