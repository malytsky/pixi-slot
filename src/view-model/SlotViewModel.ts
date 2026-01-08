import type {SlotModel} from "../domain/SlotModel";

export type Phase = 'idle' | 'spinning' | 'showWin';

export class SlotViewModel {
    private subscribers: (() => void)[] = [];
    public model: SlotModel;

    phase: Phase = 'idle';
    stopRequested = false;

    private autoSpinsRemaining = 0;

    constructor(model: SlotModel) {
        this.model = model;
    }

    subscribe(fn: () => void) {
        this.subscribers.push(fn);
    }

    private notify() {
        this.subscribers.forEach(fn => fn());
    }

    startSpin() {
        if (this.phase !== 'idle') return;

        this.model.takeBet();
        this.stopRequested = false;
        this.phase = 'spinning';
        this.notify();
    }

    stopSpin() {
        if (this.phase !== 'spinning') return;
        this.stopRequested = true;
        this.notify();
    }

    finishSpin(win: number) {
        this.model.applyWin(win);
        this.phase = 'showWin';
        this.notify();

        setTimeout(() => {
            this.phase = 'idle';
            this.stopRequested = false;
            this.notify();

            if (this.autoSpinsRemaining > 0) {
                this.autoSpinsRemaining--;
                this.startSpin();
            }
        }, 1000);
    }

    startAuto(spins: number) {
        if (this.phase !== 'idle') return;
        this.autoSpinsRemaining = spins;
        this.startSpin();
    }

    stopAuto() {
        this.autoSpinsRemaining = 0;
    }

    setBet(value: number) {
        this.model.setBet(value);
        this.notify();
    }

    get balance() {
        return this.model.balance;
    }

    get bet() {
        return this.model.bet;
    }

    get win() {
        return this.model.lastWin;
    }
}
