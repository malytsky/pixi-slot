import * as PIXI from 'pixi.js';
import { SlotViewModel } from '../view-model/SlotViewModel';
import { gsap } from "gsap";

const SYMBOLS = ['A', 'B', 'C', 'D', 'E'];
const ROWS = 3;
const REEL_WIDTH = 110;
const SYMBOL_HEIGHT = 120;

class Reel {
    container = new PIXI.Container();
    symbols: PIXI.Text[] = [];
    speed = 0;
    readonly maxSpeed = 18;
    readonly deceleration = 1.2;
    private stopping = false;
    private stoppingDone = false;

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

    start() {
        this.speed = this.maxSpeed;
        this.stopping = false;
        this.stoppingDone = false;
    }

    stop() {
        this.stopping = true;
    }

    update() {
        if (this.speed > 0.1) {
            // сдвигаем символы на speed
            for (const s of this.symbols) {
                s.y += this.speed;
            }

            // если символ ушёл вниз за предел, переносим наверх и меняем текст
            for (const s of this.symbols) {
                if (s.y >= (ROWS + 1) * SYMBOL_HEIGHT) {
                    s.y -= (ROWS + 2) * SYMBOL_HEIGHT;
                    s.text = this.randomSymbol();
                }
            }

            // замедление
            if (this.stopping) {
                this.speed = Math.max(0, this.speed - this.deceleration);
            }
        }
        else if (!this.stoppingDone) {
            // при остановке корректируем символы до точной сетки
            for (let i = 0; i < this.symbols.length; i++) {
                gsap.to(this.symbols[i], {
                    y: i * SYMBOL_HEIGHT,
                    duration: 0.5 + Math.random() * 0.5,
                    ease: "back.out(2)"
                });
            }
            this.speed = 0;
            this.stoppingDone = true;
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

    constructor(private vm: SlotViewModel) {
        for (let i = 0; i < 5; i++) {
            const reel = new Reel(i * REEL_WIDTH);
            this.reels.push(reel);
            this.container.addChild(reel.container);
        }

        // подписка на фазу спина
        this.vm.subscribe(() => this.onVMChange());
    }

    private onVMChange() {
        if (this.vm.phase === 'spinning') {
            this.reels.forEach(r => r.start());
            this.spinEndTime = performance.now() + 1500; // авто-стоп через 1.5 сек
        }

        if (this.vm.stopRequested) {
            this.reels.forEach(r => r.stop());
        }
    }

    update() {
        if (this.vm.phase !== 'spinning') return;

        const now = performance.now();

        // автоматическая остановка после времени
        if (!this.vm.stopRequested && now >= this.spinEndTime) {
            this.reels.forEach(r => r.stop());
        }

        this.reels.forEach(r => r.update());

        // проверка, остановились ли все рилы
        if (this.reels.every(r => r.stopped)) {
            const win = Math.random() > 0.7 ? this.vm.bet * 5 : 0;
            this.vm.finishSpin(win);
        }
    }
}
