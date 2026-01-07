export class SlotModel {
    readonly bets = [10, 20, 50, 100];

    balance = 1000;
    bet = 10;
    lastWin = 0;

    canSpin(): boolean {
        return this.balance >= this.bet;
    }

    takeBet(): void {
        if (!this.canSpin()) {
            throw new Error('Недостаточно средств для ставки');
        }
        this.balance -= this.bet;
    }

    applyWin(win: number): void {
        this.lastWin = win;
        this.balance += win;
    }

    setBet(value: number): void {
        if (this.bets.includes(value)) {
            this.bet = value;
        }
    }
}
