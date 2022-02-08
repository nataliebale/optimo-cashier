import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { IconAddRoundedComponent } from './add-rounded/icon-add-rounded.component';
import { IconAlertRoundedComponent } from './alert-rounded/icon-alert-rounded.component';
import { IconAlertComponent } from './alert/icon-alert.component';
import { IconArrowDownBlueComponent } from './arrow-down-blue/icon-arrow-down-blue.component';
import { IconArrowDownSmallComponent } from './arrow-down-small/icon-arrow-down-small.component';
import { IconArrowDownWhiteComponent } from './arrow-down-white/icon-arrow-down-white.component';
import { IconArrowDownComponent } from './arrow-down/icon-arrow-down.component';
import { IconArrowLeftBigComponent } from './arrow-left-big/icon-arrow-left-big.component';
import { IconArrowRightBigComponent } from './arrow-right-big/icon-arrow-right-big.component';
import { IconArrowRightComponent } from './arrow-right/icon-arrow-right.component';
import { IconArrowGrayComponent } from './arrows-gray/icon-arrow-gray.component';
import { IconBackComponent } from './back/icon-back.component';
import { IconBackspaceComponent } from './backspace/icon-backspace.component';
import { IconBurgerWhiteComponent } from './burger-white/icon-burger-white.component';
import { IconBurgerComponent } from './burger/icon-burger.component';
import { IconBuyGrayComponent } from './buy-gray/icon-buy-gray.component';
import { IconCalendarComponent } from './calendar/icon-calendar.component';
import { IconCArdComponent } from './card/icon-card.component';
import { IconCashComponent } from './cash/icon-cash.component';
import { IconChangeComponent } from './change/icon-change.component';
import { IconCloseBoldComponent } from './close-bold/icon-close-bold.component';
import { IconCloseShiftComponent } from './close-shift/icon-close-shift.component';
import { IconcloseComponent } from './close/icon-close.component';
import { IconCorrectCompleteComponent } from './complete-correct/icon-correct-complete.component';
import { IconCompleteComponent } from './complete/icon-complete.component';
import { IconCorrectBlueSmComponent } from './correct-blue-sm/icon-correct-blue-sm.component';
import { IconCorrectBlueComponent } from './correct-blue/icon-correct-blue.component';
import { IconCorrectGrayComponent } from './correct-gray/icon-correct-gray.component';
import { IconCorrectWhiteComponent } from './correct-white/icon-correct-white.component';
import { IconDebetCardComponent } from './debet-card/icon-debet-card.component';
import { IconDocComponent } from './doc/icon-doc.component';
import { IconDownloadGrayComponent } from './download-gray/icon-download-gray.component';
import { IconEmployeeAddComponent } from './employee-add/icon-employee-add.component';
import { IconEmptyOrdersComponent } from './empty-orders/icon-empty-orders.component';
import { IconExitComponent } from './exit/icon-exit.component';
import { IconFilterComponent } from './filter/icon-filter.component';
import { IconGbComponent } from './gb/icon-gb.component';
import { IconHistoryComponent } from './history/icon-history.component';
import { IconComponent, IconServiceConfig } from './icon.component';
import { IconKeysComponent } from './keys/icon-keys.component';
import { IconLariNextComponent } from './lari-next/icon-lari-next.component';
import { IconLariOneComponent } from './lari-one/icon-lari-one.component';
import { IconLariTimeComponent } from './lari-time/icon-lari-time.component';
import { IconLariComponent } from './lari/icon-lari.component';
import { IconLbComponent } from './lb/icon-lb.component';
import { IconLoaderBigComponent } from './loader-big/icon-loader-big.component';
import { IconLoaderComponent } from './loader/icon-loader.component';
import { IconlogOutComponent } from './log-out/icon-log-out.component';
import { IconLogoutBlueComponent } from './logout-blue/icon-logout-blue.component';
import { IconMinusComponent } from './minus/icon-minus.component';
import { IconMoreBlackComponent } from './more-black/icon-more-black.component';
import { IconMoreComponent } from './more/icon-more.component';
import { IconNoDataComponent } from './no-data/icon-no-data.component';
import { IconNoImgComponent } from './no-img/icon-no-img.component';
import { IconNoOrderHorecaComponent } from './no-order-horeca/icon-no-order-horeca.component';
import { IconNoOrderRetailComponent } from './no-order-retail/icon-no-order-retail.component';
import { IconOffComponent } from './off/icon-off.component';
import { IconPayComponent } from './pay/icon-pay.component';
import { IconPlusComponent } from './plus/icon-plus.component';
import { IconPrintComponent } from './print/icon-print.component';
import { IconSearchComponent } from './search/icon-search.component';
import { IconStatusCorrectedComponent } from './status-corrected/icon-status-corrected.component';
import { IconStatusRefundedComponent } from './status-refunded/icon-status-refunded.component';
import { IconSyncCopyComponent } from './sync-copy/icon-sync-copy.component';
import { IconSyncGrayComponent } from './sync-gray/icon-sync-gray.component';
import { IconSyncWhiteComponent } from './sync-white/icon-sync-white.component';
import { IconSyncComponent } from './sync/icon-sync.component';
import { IconTbComponent } from './tb/icon-tb.component';
import { IconTrashComponent } from './trash/icon-trash.component';
import { IconTurnOffRedComponent } from './turn-off-red/icon-turn-off-red.component';
import { IconUpdateWhiteComponent } from './update-white/icon-update-white.component';
import { IconUpdateComponent } from './update/icon-update.component';
import { IconUsersComponent } from './users/icon-users.component';
import { IconWifiGrayComponent } from './wifi-gray/icon-wifi-gray.component';
import { IconWifiWhiteComponent } from './wifi-white/icon-wifi-white.component';
import { IconWifiComponent } from './wifi/icon-wifi.component';

const ENTRY_COMPONENTS = [
  IconBackComponent,
  IconArrowRightComponent,
  IconBurgerComponent,
  IconcloseComponent,
  IconChangeComponent,
  IconMoreComponent,
  IconGbComponent,
  IconLbComponent,
  IconPrintComponent,
  IconWifiComponent,
  IconOffComponent,
  IconDebetCardComponent,
  IconArrowDownWhiteComponent,
  IconCorrectCompleteComponent,
  IconArrowDownBlueComponent,
  IconCorrectWhiteComponent,
  IconLoaderBigComponent,
  IconLariTimeComponent,
  IconUsersComponent,
  IconMoreBlackComponent,
  IconCloseShiftComponent,
  IconSyncWhiteComponent,
  IconSearchComponent,
  IconWifiWhiteComponent,
  IconArrowDownComponent,
  IconAlertRoundedComponent,
  IconUpdateWhiteComponent,
  IconAddRoundedComponent,
  IconCompleteComponent,
  IconNoImgComponent,
  IconLoaderComponent,
  IconLariOneComponent,
  IconPayComponent,
  IconSyncComponent,
  IconUpdateComponent,
  IconCloseBoldComponent,
  IconArrowLeftBigComponent,
  IconArrowRightBigComponent,
  IconArrowDownSmallComponent,
  IconTurnOffRedComponent,
  IconArrowGrayComponent,
  IconLariNextComponent,
  IconNoOrderHorecaComponent,
  IconEmptyOrdersComponent,
  IconNoOrderRetailComponent,
  IconlogOutComponent,
  IconBackspaceComponent,
  IconBurgerWhiteComponent,
  IconDownloadGrayComponent,
  IconCorrectBlueComponent,
  IconLogoutBlueComponent,
  IconCorrectGrayComponent,
  IconWifiGrayComponent,
  IconSyncGrayComponent,
  IconBuyGrayComponent,
  IconSyncCopyComponent,
  IconPlusComponent,
  IconTbComponent,
  IconMinusComponent,
  IconTrashComponent,
  IconCashComponent,
  IconCArdComponent,
  IconDocComponent,
  IconKeysComponent,
  IconLariComponent,
  IconAlertComponent,
  IconExitComponent,
  IconHistoryComponent,
  IconFilterComponent,
  IconCalendarComponent,
  IconCorrectBlueSmComponent,
  IconNoDataComponent,
  IconEmployeeAddComponent,
  IconStatusCorrectedComponent,
  IconStatusCorrectedComponent,
  IconStatusRefundedComponent,
];

@NgModule({
  declarations: [IconComponent, ...ENTRY_COMPONENTS],
  imports: [CommonModule],
  exports: [IconComponent, ...ENTRY_COMPONENTS],
  entryComponents: ENTRY_COMPONENTS,
  providers: [
    {
      provide: IconServiceConfig,
      useValue: {
        gb: IconGbComponent,
        tb: IconTbComponent,
        lb: IconLbComponent,
        back: IconBackComponent,
        burger: IconBurgerComponent,
        close: IconcloseComponent,
        more: IconMoreComponent,
        wifi: IconWifiComponent,
        print: IconPrintComponent,
        lari: IconLariComponent,
        pay: IconPayComponent,
        off: IconOffComponent,
        exit: IconExitComponent,
        sync: IconSyncComponent,
        keys: IconKeysComponent,
        minus: IconMinusComponent,
        plus: IconPlusComponent,
        cash: IconCashComponent,
        doc: IconDocComponent,
        card: IconCArdComponent,
        trash: IconTrashComponent,
        users: IconUsersComponent,
        alert: IconAlertComponent,
        change: IconChangeComponent,
        search: IconSearchComponent,
        update: IconUpdateComponent,
        loader: IconLoaderComponent,
        complete: IconCompleteComponent,
        backspace: IconBackspaceComponent,
        history: IconHistoryComponent,
        filter: IconFilterComponent,
        calendar: IconCalendarComponent,
        'no-data': IconNoDataComponent,
        'correct-blue-sm': IconCorrectBlueSmComponent,
        'no-img': IconNoImgComponent,
        'no-order-horeca': IconNoOrderHorecaComponent,
        'log-out': IconlogOutComponent,
        'buy-gray': IconBuyGrayComponent,
        'arrows-gray': IconArrowGrayComponent,
        'debet-card': IconDebetCardComponent,
        'download-gray': IconDownloadGrayComponent,
        'logout-blue': IconLogoutBlueComponent,
        'loader-big': IconLoaderBigComponent,
        'lari-one': IconLariOneComponent,
        'lari-next': IconLariNextComponent,
        'sync-gray': IconSyncGrayComponent,
        'sync-copy': IconSyncCopyComponent,
        'close-bold': IconCloseBoldComponent,
        'burger-white': IconBurgerWhiteComponent,
        'empty-orders': IconEmptyOrdersComponent,
        'update-white': IconUpdateWhiteComponent,
        'correct-gray': IconCorrectGrayComponent,
        'add-rounded': IconAddRoundedComponent,
        'alert-rounded': IconAlertRoundedComponent,
        'arrow-right': IconArrowRightComponent,
        'arrow-down': IconArrowDownComponent,
        'lari-time': IconLariTimeComponent,
        'arrow-down-white': IconArrowDownWhiteComponent,
        'turn-off-red': IconTurnOffRedComponent,
        'correct-complete': IconCorrectCompleteComponent,
        'no-order-retail': IconNoOrderRetailComponent,
        'sync-white': IconSyncWhiteComponent,
        'wifi-white': IconWifiWhiteComponent,
        'wifi-gray': IconWifiGrayComponent,
        'more-black': IconMoreBlackComponent,
        'correct-white': IconCorrectWhiteComponent,
        'correct-blue': IconCorrectBlueComponent,
        'arrow-down-blue': IconArrowDownBlueComponent,
        'arrow-down-small': IconArrowDownSmallComponent,
        'arrow-left-big': IconArrowLeftBigComponent,
        'arrow-right-big': IconArrowRightBigComponent,
        'icon-close-shift': IconCloseShiftComponent,
        'employee-add': IconEmployeeAddComponent,
        'status-corrected': IconStatusCorrectedComponent,
        'status-refunded': IconStatusRefundedComponent,
      },
    },
  ],
})
export class IconModule {}
