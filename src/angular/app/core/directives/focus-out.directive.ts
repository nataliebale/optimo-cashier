import { Directive, EventEmitter, Output, HostListener, ElementRef, NgModule } from '@angular/core';

@Directive({
  selector: '[focusOut]',
})
export class FocusOutDirective {
  @Output()
  focusOut = new EventEmitter<any>();

  constructor(private elementRef: ElementRef) {}

  @HostListener('document:click', ['$event.target'])
  onMouseEnter(target) {
    const clickedInside = this.elementRef.nativeElement.contains(target);
    if (!clickedInside) {
      this.focusOut.emit(target);
    }
  }
}

@NgModule({
  declarations: [FocusOutDirective],
  exports: [FocusOutDirective],
})
export class FocusOutModule {}
