import { ClockService } from './../services/Clock/ClockService';
import { PipeService } from './../services/Pipe/PipeService';
import { Container, interfaces } from 'inversify';
import { ApplicationDb } from '../../core/infrastructure/ApplicationDb';
import { DeviceService } from '../../core/services/Device/DeviceService';
import { HttpAdapter } from '../../core/services/Http/HttpAdapter';
import { JobService } from '../../core/services/Job/JobService';
import { OperatorService } from '../../core/services/Operator/OperatorService';
import { OrderService } from '../../core/services/Order/OrderService';
import { SettingsService } from '../../core/services/Settings/SettingService';
import { ShiftService } from '../../core/services/Shift/ShiftService';
import { SynchronizationService } from '../../core/services/Synchronization/SynchronizationService';
import { SystemEventService } from '../../core/services/SystemEvent/SystemEventService';
import { UpdateService } from '../../core/services/Update/UpdateService';
import { OperatorSessionService } from '../../core/services/Operator/OperatorSessionService';
import { CheckService } from '../../core/services/Check/CheckService';
import { SpaceService } from '../../core/services/Space/SpaceService';
import { TableService } from '../../core/services/Space/TableService';
import { TransactionHistoryService } from '../../core/services/History/TransactionHistoryService';
import { TransactionDb } from './TransactionDb';
import { ReturnOrderService } from '../services/Order/ReturnOrderService';

const DIContainer = new Container();

function DIBind() {
  DIContainer.bind<ApplicationDb>(ApplicationDb).toSelf().inSingletonScope();
  DIContainer.bind<TransactionDb>(TransactionDb).toSelf().inSingletonScope();
  DIContainer.bind<SettingsService>(SettingsService).toSelf().inSingletonScope();
  DIContainer.bind<DeviceService>(DeviceService).toSelf().inSingletonScope();
  DIContainer.bind<HttpAdapter>(HttpAdapter).toSelf().inSingletonScope();
  DIContainer.bind<JobService>(JobService).toSelf().inSingletonScope();
  DIContainer.bind<OperatorService>(OperatorService).toSelf().inSingletonScope();
  DIContainer.bind<ShiftService>(ShiftService).toSelf().inSingletonScope();
  DIContainer.bind<SynchronizationService>(SynchronizationService).toSelf().inSingletonScope();
  DIContainer.bind<SystemEventService>(SystemEventService).toSelf().inSingletonScope();
  DIContainer.bind<UpdateService>(UpdateService).toSelf().inSingletonScope();
  DIContainer.bind<OrderService>(OrderService).toSelf().inSingletonScope();
  DIContainer.bind<CheckService>(CheckService).toSelf().inSingletonScope();
  DIContainer.bind<ClockService>(ClockService).toSelf().inSingletonScope();
  DIContainer.bind<OperatorSessionService>(OperatorSessionService).toSelf().inTransientScope();
  DIContainer.bind<SpaceService>(SpaceService).toSelf().inSingletonScope();
  DIContainer.bind<TableService>(TableService).toSelf().inSingletonScope();
  DIContainer.bind<PipeService>(PipeService).toSelf().inSingletonScope();
  DIContainer.bind<ReturnOrderService>(ReturnOrderService).toSelf().inSingletonScope();
  DIContainer.bind<TransactionHistoryService>(TransactionHistoryService)
    .toSelf()
    .inSingletonScope();
}

function DIControllerBinder<T>(serviceIdentifier: interfaces.ServiceIdentifier<T>) {
  DIContainer.bind<T>(serviceIdentifier).toSelf().inTransientScope();
}

DIBind();

export { DIContainer, DIControllerBinder, DIBind };
