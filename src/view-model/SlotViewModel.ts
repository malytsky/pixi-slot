import { SlotModel } from '../domain/SlotModel';

export type Phase = 'idle' | 'spinning' | 'showWin';

type Subscriber = () => void;

export class SlotViewModel {
    private subs: Subscriber[] = [];

    phase: Phase = 'idle';
    win = 0;

    autoLeft = 0;
    stopRequested = false;

    constructor(public readonly model: SlotModel) {}

    // ─── getters для UI ───
    get balance() {
        return this.model.balance;
    }

    get bet() {
        return this.model.bet;
    }

    // ─── UI intents ───
    requestSpin() {
        if (this.phase !== 'idle') return;
        this.phase = 'spinning';
        this.stopRequested = false;
        this.notify();
    }

    requestStop() {
        this.stopRequested = true;
        this.notify();
    }

    startAuto(count: number) {
        if (this.phase !== 'idle') return;
        this.autoLeft = count;
        this.requestSpin();
    }

    stopAuto() {
        this.autoLeft = 0;
    }

    // ─── scene callbacks ───
    applyWin(win: number) {
        this.win = win;
        this.model.applyWin(win);
        this.phase = 'showWin';
        this.notify();
    }

    finishShowWin() {
        this.phase = 'idle';

        if (this.autoLeft > 0) {
            this.autoLeft--;
            this.notify();
            this.requestSpin();
        } else {
            this.notify();
        }
    }

    takeBet() {
        this.model.takeBet();
    }

    setBet(value: number) {
        this.model.setBet(value);
        this.notify();
    }

    // ─── subscribe ───
    subscribe(fn: Subscriber) {
        this.subs.push(fn);
    }

    private notify() {
        this.subs.forEach(s => s());
    }
}
