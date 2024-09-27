import { Directive, HostBinding, HostListener, input, signal } from "@angular/core";

@Directive({
  selector: "[appDropdownContainer]",
  standalone: true,
})
export class DropdownContainerDirective {
  @HostBinding('class')
  classNames = 'lb-dropdown-container';
}

@Directive({
  selector: "[appDropdownTrigger]",
  standalone: true,
})
export class DropdownTriggerDirective {
  dropdown = input.required<DropdownDirective>()

  @HostListener('click', ["$event"])
  openDropdown($event: MouseEvent): void {
    $event.preventDefault();
    $event.stopPropagation();
    this.dropdown().toggle();
  }

  @HostListener('document:click')
  closeDropdown(): void {
    if (this.dropdown().active()) {
      this.dropdown().toggle()
    }
  }
}

@Directive({
  selector: "[appDropdown]",
  standalone: true,
  host: {
    '[class.active]': 'active()'
  },
  exportAs: 'dropdown'
})
export class DropdownDirective {
  @HostBinding('class')
  classNames = 'lb-dropdown'
  
  active = signal(false);

  toggle() {
    this.active.update((value) => !value)
  }

  constructor() {
    console.log(this.active())
  }
}
