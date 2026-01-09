import * as PIXI from 'pixi.js';
import { SlotViewModel } from '../view-model/SlotViewModel';
import { mockSpin } from '../mock/spinMock';
import type {SpinResult} from "../mock/spinMock";
import { Reel } from './Reel';

const REEL_WIDTH = 110;

enum SceneState {
    Idle,
    Spinning,
    ShowWin,
}

export class SlotScene {
    container = new PIXI.Container();

    private reels: Reel[] = [];
    private state: SceneState = SceneState.Idle;

    private spinEndTime = 0;
    private showWinEndTime = 0;

    private data!: SpinResult;

    constructor(private vm: SlotViewModel) {
        for (let i = 0; i < 5; i++) {
            const reel = new Reel(i * REEL_WIDTH);
            this.reels.push(reel);
            this.container.addChild(reel.container);
        }

        this.vm.subscribe(() => this.onVMIntent());
    }

    // ─────────────────────────
    // INTENTS FROM VIEWMODEL
    // ─────────────────────────
    private onVMIntent() {
        if (this.vm.phase === 'spinning' && this.state === SceneState.Idle) {
            this.enterSpinning();
        }

        if (this.vm.stopRequested && this.state === SceneState.Spinning) {
            console.log(123);
            this.reels.forEach(r => r.stop());
        }

        if (this.vm.stopRequested) {
            console.log(123);
        }
    }

    // ─────────────────────────
    // STATE ENTERS
    // ─────────────────────────
    private enterSpinning() {
        this.state = SceneState.Spinning;

        this.vm.takeBet();
        this.data = mockSpin(this.vm.bet);

        for (let i = 0; i < this.reels.length; i++) {
            this.reels[i].start(this.data.reels[i]);
        }

        this.spinEndTime = performance.now() + 1500;
    }

    private enterShowWin() {
        this.state = SceneState.ShowWin;
        this.vm.applyWin(this.data.win);
        this.showWinEndTime = performance.now() + 1000;
    }

    private enterIdle() {
        this.state = SceneState.Idle;
        this.vm.finishShowWin();
    }

    // ─────────────────────────
    // UPDATE LOOP
    // ─────────────────────────
    update() {
        const now = performance.now();

        if (this.state === SceneState.Spinning) {
            if (now >= this.spinEndTime) {
                this.reels.forEach(r => r.stop());
            }

            this.reels.forEach(r => r.update());

            if (this.reels.every(r => r.stopped)) {
                this.enterShowWin();
            }
        }

        if (this.state === SceneState.ShowWin) {
            if (now >= this.showWinEndTime) {
                this.enterIdle();
            }
        }
    }
}
