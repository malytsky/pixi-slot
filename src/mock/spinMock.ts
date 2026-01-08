export function mockSpin(bet:number) {
    const SYMBOLS = ['A', 'B', 'C', 'D', 'E'];
    function randomSymbol() {
        return SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];
    }
    return {
        win: Math.random() > 0.7 ? bet * 5 : 0,
        reel0: [randomSymbol(), randomSymbol(),, randomSymbol()],
        reel1: [randomSymbol(), randomSymbol(),, randomSymbol()],
        reel2: [randomSymbol(), randomSymbol(),, randomSymbol()],
        reel3: [randomSymbol(), randomSymbol(),, randomSymbol()],
        reel4: [randomSymbol(), randomSymbol(),, randomSymbol()],
    };
}
