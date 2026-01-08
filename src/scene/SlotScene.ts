import * as PIXI from 'pixi.js';
import { SlotViewModel } from '../view-model/SlotViewModel';
import {mockSpin} from "../mock/spinMock";
import type {SpinResult} from "../mock/spinMock";
import {Reel} from "./Reel.ts";
const REEL_WIDTH = 110;

export class SlotScene {
    container = new PIXI.Container();
    private reels: Reel[] = [];
    private spinEndTime = 0;
    private vm:SlotViewModel;
    private data!: SpinResult;

    constructor(vm:SlotViewModel) {
        this.vm = vm;
        for (let i = 0; i < 5; i++) {
            const reel = new Reel(i * REEL_WIDTH);
            this.reels.push(reel);
            this.container.addChild(reel.container);
        }

        this.vm.subscribe(() => this.onVMChange());
    }

    private onVMChange() {
        if (this.vm.phase === 'spinning') {
            this.data = mockSpin(this.vm.bet);

            for (let i = 0; i < this.reels.length; i++) {
                this.reels[i].start(this.data.reels[i]);
            }

            this.spinEndTime = performance.now() + 1500;
        }

        if (this.vm.stopRequested) {
            this.reels.forEach(r => r.stop());
        }
    }

    update() {
        if (this.vm.phase !== 'spinning') return;

        const now = performance.now();

        if (now >= this.spinEndTime) {
            this.reels.forEach(r => r.stop());
        }

        this.reels.forEach(r => r.update());

        if (this.reels.every(r => r.stopped)) {
            this.vm.finishSpin(this.data.win);
        }
    }
}

