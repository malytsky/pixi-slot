import { SlotViewModel } from '../view-model/SlotViewModel';
import { SlotScene } from './SlotScene';

export class SlotStateMachine {
    private handledPhase: string | null = null;

    constructor(
        private vm: SlotViewModel,
        private scene: SlotScene
    ) {}

    update() {
        if (this.vm.phase === this.handledPhase) return;
        this.handledPhase = this.vm.phase;

        switch (this.vm.phase) {
            case 'idle':
                console.log("idle");
                //if (this.vm.autoPlay) this.vm.spin();
                break;
            case 'spinning':
                //this.scene.startSpin();
                break;
            case 'win':
                //this.scene.showWin();
                break;
        }
    }
}
