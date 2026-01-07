export function mockSpin(bet:number) {
    return {
        win: Math.random() > 0.7 ? bet * 5 : 0,
        reel0: ['A', 'A', 'A'],
        reel1: ['A', 'A', 'A'],
        reel2: ['A', 'A', 'A'],
        reel3: ['A', 'A', 'A'],
        reel4: ['A', 'A', 'A'],
    };
}
