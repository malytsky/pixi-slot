import { SlotViewModel } from '../view-model/SlotViewModel';

export class SlotUI {
  private balanceEl: HTMLDivElement;
  private betEl: HTMLDivElement;
  private winEl: HTMLDivElement;
  private phaseEl: HTMLDivElement;

  private spinBtn: HTMLButtonElement;
  private stopBtn: HTMLButtonElement;
  private betSelect: HTMLSelectElement;
  private autoBtn: HTMLButtonElement;
  private autoStopBtn: HTMLButtonElement;

  private vm: SlotViewModel;

  constructor(vm: SlotViewModel, parent: HTMLElement) {
    this.vm = vm;
    // ── Создание DOM элементов ──
    this.balanceEl = document.createElement('div');
    this.betEl = document.createElement('div');
    this.winEl = document.createElement('div');
    this.phaseEl = document.createElement('div');

    this.spinBtn = document.createElement('button');
    this.spinBtn.textContent = 'SPIN';

    this.stopBtn = document.createElement('button');
    this.stopBtn.textContent = 'STOP';

    this.autoBtn = document.createElement('button');
    this.autoBtn.textContent = 'AUTO 5 SPINS';
    this.autoStopBtn = document.createElement('button');
    this.autoStopBtn.textContent = 'STOP AUTO';

    this.betSelect = document.createElement('select');
    this.vm.model.bets.forEach(b => {
      const opt = document.createElement('option');
      opt.value = String(b);
      opt.textContent = b.toString();
      if (b === this.vm.bet) opt.selected = true;
      this.betSelect.appendChild(opt);
    });

    // ── Размещение в DOM ──
    parent.appendChild(this.balanceEl);
    parent.appendChild(this.betEl);
    parent.appendChild(this.winEl);
    parent.appendChild(this.phaseEl);
    parent.appendChild(this.betSelect);
    parent.appendChild(this.spinBtn);
    parent.appendChild(this.stopBtn);
    parent.appendChild(this.autoBtn);
    parent.appendChild(this.autoStopBtn);

    // ── События ──
    this.autoBtn.addEventListener('click', () => vm.startAuto(5));
    this.autoStopBtn.addEventListener('click', () => vm.stopAuto());
    this.spinBtn.addEventListener('click', () => vm.startSpin());
    this.stopBtn.addEventListener('click', () => vm.stopSpin());
    this.betSelect.addEventListener('change', () => {
      vm.setBet(Number(this.betSelect.value));
    });

    // ── Подписка на изменения VM ──
    this.vm.subscribe(() => this.render());
    this.render();
  }

  private render() {
    this.balanceEl.textContent = `Balance: ${this.vm.balance}`;
    this.betEl.textContent = `Bet: ${this.vm.bet}`;
    this.winEl.textContent = `Win: ${this.vm.win}`;
    this.phaseEl.textContent = `Phase: ${this.vm.phase}`;

    this.spinBtn.disabled = this.vm.phase !== 'idle';
    this.stopBtn.disabled = this.vm.phase !== 'spinning';
    this.betSelect.disabled = this.vm.phase !== 'idle';
    this.autoBtn.disabled = this.vm.phase !== 'idle';
    this.autoStopBtn.disabled = this.vm.phase === 'idle';
  }
}
