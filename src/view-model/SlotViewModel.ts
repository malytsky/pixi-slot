import { SlotModel } from '../domain/SlotModel';

export type Phase = 'idle' | 'spinning' | 'showWin';

export class SlotViewModel {
    private subscribers: (() => void)[] = [];

    phase: Phase = 'idle';
    stopRequested = false;
    forceStop = false;

    constructor(public model: SlotModel) {}

    subscribe(fn: () => void) {
        this.subscribers.push(fn);
    }

    private notify() {
        this.subscribers.forEach(fn => fn());
    }

    startSpin() {
        if (this.phase !== 'idle') return;
        this.forceStop = false;
        this.model.takeBet();
        this.stopRequested = false;
        this.phase = 'spinning';
        this.notify();
    }

    stopSpin() {
        if (this.phase !== 'spinning') return;
        this.forceStop = true;
    }

    finishSpin(win: number) {
        this.model.applyWin(win);
        this.phase = 'showWin';
        this.notify();

        setTimeout(() => {
            this.phase = 'idle';
            this.stopRequested = false;
            this.notify();
        }, 1000);
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
