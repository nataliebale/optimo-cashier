import { DIContainer } from '../../core/infrastructure/DependencyInjection';
import { WindowManager } from './WindowManager';

DIContainer.bind<WindowManager>(WindowManager).to(WindowManager).inSingletonScope();

export const ElectronDIContainer = DIContainer;
