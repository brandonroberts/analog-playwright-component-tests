import { Component, Injectable } from "@angular/core";

@Injectable({ providedIn: 'root' })
export class MyService {}

@Component({
  selector: 'app-test',
  standalone: true,
  template: `<h2>Test Works</h2>`,
  styles: [`
    h2 {
      color: red;
    }
  `]
})
export class TestComponent {
  constructor(private myService: MyService) {}
}