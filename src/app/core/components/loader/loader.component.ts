import {
  Component,
  computed,
  effect,
  HostBinding,
  inject,
  input,
} from "@angular/core";
import { MatIconModule } from "@angular/material/icon";
import { NgStyle } from "@angular/common";

@Component({
  selector: "app-loader",
  standalone: true,
  imports: [MatIconModule, NgStyle],
  templateUrl: "./loader.component.html",
  styleUrl: "./loader.component.scss",
})
export class LoaderComponent {
  display = input<"inline" | "block">("inline");

  @HostBinding("class")
  className = `show-${this.display()}`;

  constructor() {
    effect(() => {
      this.className = `show-${this.display()}`;
    });
  }
}
