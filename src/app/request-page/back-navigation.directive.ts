import { Directive, HostListener } from "@angular/core";
import { NavigationService } from "app/services/navigation.service";

@Directive({
  selector: "[navigateBack]",
})
export class BackButtonDirective {
  constructor(private navigation: NavigationService) {}

  @HostListener("click")
  onClick(): void {
    this.navigation.back();
  }
}
