import * as PIXI from 'pixi.js';
import { SlotModel } from './domain/SlotModel';
import { SlotViewModel } from './view-model/SlotViewModel';
import { SlotScene } from './scene/SlotScene';
import { SlotUI } from './ui/SlotUI';

async function bootstrap() {
  // ROOT контейнер для canvas + UI
  const appRoot = document.createElement('div');
  appRoot.style.display = 'flex';
  appRoot.style.flexDirection = 'column';
  appRoot.style.alignItems = 'center';
  appRoot.style.gap = '12px';
  appRoot.style.marginTop = '10px';
  document.body.appendChild(appRoot);

  // ─── Pixi Application ───
  const app = new PIXI.Application();

  // В Pixi v8 нужно вызвать init с опциями
  await app.init({
    width: 500,
    height: 300,
    backgroundColor: 0x222222,
  });

  // Добавляем canvas в DOM
  appRoot.appendChild(app.canvas);

  // ─── DOMAIN + VIEWMODEL ───
  const model = new SlotModel();
  const vm = new SlotViewModel(model);

  // ─── SCENE ───
  const scene = new SlotScene(vm);
  app.stage.addChild(scene.container);

  // ticker для обновления сцены
  app.ticker.add(() => scene.update());

  // ─── UI ───
  new SlotUI(vm, appRoot);

  console.log('Pixi Application initialized, canvas added');
}

bootstrap();
