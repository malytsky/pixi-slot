import * as PIXI from 'pixi.js';
import { SlotViewModel } from '../view-model/SlotViewModel';
import { gsap } from "gsap";
import {mockSpin} from "../mock/spinMock.ts";
import {SlotStateMachine} from "./SlotStateMachine.ts";

const SYMBOLS = ['A', 'B', 'C', 'D', 'E'];
const ROWS = 3;
const REEL_WIDTH = 110;
const SYMBOL_HEIGHT = 120;

class Reel {
    container = new PIXI.Container();
    symbols: PIXI.Text[] = [];
    speed = 0;
    readonly maxSpeed = 18;
    private stopping = false;
    private stoppingDone = false;
    private symbolsY:number[] = [];
    private stopCount:number;
    private mockSymbols: any[];

    constructor(x: number) {
        this.container.x = x;

        // создаём ROWS + 2 запасных символа
        for (let i = 0; i < ROWS + 2; i++) {
            const t = new PIXI.Text(this.randomSymbol(), { fill: 'white', fontSize: 64 });
            t.y = i * SYMBOL_HEIGHT;
            this.container.addChild(t);
            this.symbols.push(t);
        }
    }

    start(symbols:any) {
        this.stopCount = 0;
        this.speed = this.maxSpeed;
        this.stopping = false;
        this.stoppingDone = false;
        this.container.removeChildren();
        this.symbols = [];
        this.symbolsY = [];
        this.mockSymbols = symbols;

        // создаём ROWS + 2 запасных символа
        for (let i = 0; i < ROWS + 2; i++) {
            const t = new PIXI.Text(this.randomSymbol(), { fill: 'white', fontSize: 64 });
            t.y = i * SYMBOL_HEIGHT;
            this.container.addChild(t);
            this.symbols.push(t);
        }

        for (let i = 0; i < this.symbols.length; i++) {
            this.symbolsY.push(i * SYMBOL_HEIGHT);
        }
    }

    stop() {
        this.stopping = true;
    }

    update() {
        if (this.speed > 0.1 && !this.stopping) {
            console.log(this.speed)
            // сдвигаем символы на speed
            for (const s of this.symbols) {
                s.y += this.speed;
            }

            // если символ ушёл вниз за предел, переносим наверх и меняем текст
            for (const s of this.symbols) {
                if (s.y >= (ROWS + 1) * SYMBOL_HEIGHT) {
                    s.y -= (ROWS + 2) * SYMBOL_HEIGHT;
                    console.log("this.speed", this.speed)
                    s.text = this.randomSymbol();
                }
            }
        } else
            // замедление
        if (this.stopping) {
            for (let i = 0; i < this.symbols.length; i++) {
                if (this.symbols[i].y >= (ROWS + 1) * SYMBOL_HEIGHT) {
                    this.symbols[i].y -= (ROWS + 2) * SYMBOL_HEIGHT;
                    console.log("this.speed", this.speed)
                    this.symbols[i].text = this.mockSymbols[i] ? this.mockSymbols[i] : this.randomSymbol();
                    this.stopCount++;
                }
            }
            if (this.stopCount < 5) {
                for (const s of this.symbols) {
                    s.y += this.speed;
                }
            } else {
                for (const s of this.symbols) {
                    if (s.y >= (ROWS + 1) * SYMBOL_HEIGHT) {
                        s.y -= (ROWS + 2) * SYMBOL_HEIGHT;
                    }
                }
                for (let i = 0; i < this.symbols.length; i++) {
                    if (this.symbols[i].y > 300) this.symbols[i].y = -240;

                    if (i * SYMBOL_HEIGHT - this.symbols[i].y < 300)
                        gsap.to(this.symbols[i], {y: i * SYMBOL_HEIGHT, duration: 0.5/*, ease: "back.out(2)"*/});
                }
                this.speed = 0;
                this.stoppingDone = true;
            }
        }
    }

    get stopped() {
        return this.stoppingDone && this.speed === 0;
    }

    private randomSymbol() {
        return SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];
    }
}


export class SlotScene {
    container = new PIXI.Container();
    private reels: Reel[] = [];
    private spinEndTime = 0;
    private sm:SlotStateMachine;
    private data:object;

    constructor(private vm: SlotViewModel) {
        for (let i = 0; i < 5; i++) {
            const reel = new Reel(i * REEL_WIDTH);
            this.reels.push(reel);
            this.container.addChild(reel.container);
        }

        // подписка на фазу спина
        this.vm.subscribe(() => this.onVMChange());
        this.sm = new SlotStateMachine(vm, this);
    }

    private onVMChange() {
        if (this.vm.phase === 'spinning') {
            this.data = mockSpin(this.vm.bet);
            for (let i = 0; i < this.reels.length; i++) {
                this.reels[i].start(this.data["reel" + i]);
            }
            this.spinEndTime = performance.now() + 1500; // авто-стоп через 1.5 сек
        }

        if (this.vm.stopRequested) {
            this.reels.forEach(r => r.stop());
        }
    }

    update() {
        this.sm.update();

        if (this.vm.phase !== 'spinning') return;

        const now = performance.now();

        // автоматическая остановка после времени
        if (now >= this.spinEndTime) {
            this.reels.forEach(r => r.stop());
        }

        if (this.vm.forceStop) {
            this.reels.forEach(r => r.stop());
        }

        this.reels.forEach(r => r.update());

        // проверка, остановились ли все рилы
        if (this.reels.every(r => r.stopped)) {
            this.vm.phase = 'showWin';
            this.vm.finishSpin(this.data.win);
        }
    }
}
