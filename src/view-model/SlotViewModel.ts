import { SlotModel } from '../domain/SlotModel';

export type Phase = 'idle' | 'spinning' | 'showWin';

export class SlotViewModel {
    private subscribers: (() => void)[] = [];
    phase: Phase = 'idle';
    stopRequested = false;
    forceStop = false;

    private autoSpinsRemaining = 0;

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
        this.stopRequested = true; // теперь корректно уведомляем сцену
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

            // если авто-режим включён и остались спины
            if (this.autoSpinsRemaining > 0) {
                this.autoSpinsRemaining--;
                this.startSpin();
            }
        }, 1000);
    }

    setBet(value: number) {
        this.model.setBet(value);
        this.notify();
    }

    startAuto(spins: number) {
        if (this.phase !== 'idle') return;
        this.autoSpinsRemaining = spins;
        this.startSpin();
    }

    stopAuto() {
        this.autoSpinsRemaining = 0;
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

