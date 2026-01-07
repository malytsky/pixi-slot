export function mockSpin() {
    return {
        win: Math.random() < 0.4 ? 50 : 0
    };
}
