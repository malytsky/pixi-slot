export function mockSpin(bet: number): SpinResult {
    const SYMBOLS = ['A', 'B', 'C', 'D', 'E'];
    function randomSymbol() {
        return SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];
    }

    return {
        win: Math.random() > 0.7 ? bet * 5 : 0,
        reels: Array.from({ length: 5 }, () =>
            [randomSymbol(), randomSymbol(), randomSymbol()]
        ),
    };
}


export type SpinResult = {
    win: number;
    reels: string[][];
};
