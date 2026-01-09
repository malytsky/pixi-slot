import * as PIXI from 'pixi.js';
import { gsap } from "gsap";

const SYMBOLS = ['A', 'B', 'C', 'D', 'E'];
const ROWS = 3;
const SYMBOL_HEIGHT = 120;

export class Reel {
    container = new PIXI.Container();
    symbols: PIXI.Text[] = [];
    speed = 0;
    readonly maxSpeed = 18;

    private stopping = false;
    private stoppingDone = false;
    private stopCount = 0;
    private mockSymbols!: string[];

    constructor(x: number) {
        this.container.x = x;

        for (let i = 0; i < ROWS + 2; i++) {
            const t = new PIXI.Text(this.randomSymbol(), { fill: 'white', fontSize: 64 });
            t.y = i * SYMBOL_HEIGHT;
            this.container.addChild(t);
            this.symbols.push(t);
        }
    }

    start(symbols: string[]) {
        this.stopCount = 0;
        this.speed = this.maxSpeed;
        this.stopping = false;
        this.stoppingDone = false;
        this.mockSymbols = symbols;

        this.container.removeChildren();
        this.symbols = [];

        for (let i = 0; i < ROWS + 2; i++) {
            const t = new PIXI.Text(this.randomSymbol(), { fill: 'white', fontSize: 64 });
            t.y = i * SYMBOL_HEIGHT;
            this.container.addChild(t);
            this.symbols.push(t);
        }
    }

    stop() {
        this.stopping = true;
    }

    update() {
        if (this.speed > 0.1 && !this.stopping) {
            for (const s of this.symbols) {
                s.y += this.speed;
            }

            for (const s of this.symbols) {
                if (s.y >= (ROWS + 1) * SYMBOL_HEIGHT) {
                    s.y -= (ROWS + 2) * SYMBOL_HEIGHT;
                    s.text = this.randomSymbol();
                }
            }
        }
        else if (this.stopping) {
            for (let i = 0; i < this.symbols.length; i++) {
                if (this.symbols[i].y >= (ROWS + 1) * SYMBOL_HEIGHT) {
                    this.symbols[i].y -= (ROWS + 2) * SYMBOL_HEIGHT;
                    this.symbols[i].text =
                        this.mockSymbols[i] ?? this.randomSymbol();
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
                    if (this.symbols[i].y > 300) {
                        this.symbols[i].y = -240;
                    }

                    if (i * SYMBOL_HEIGHT - this.symbols[i].y < 300) {
                        gsap.to(this.symbols[i], {
                            y: i * SYMBOL_HEIGHT,
                            duration: 0.5,
                        });
                    }
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
