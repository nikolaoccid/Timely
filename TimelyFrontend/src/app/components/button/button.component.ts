import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.css']
})
export class ButtonComponent {
  @Input() text!: string;
  @Output() onBtnClick = new EventEmitter();

  onButtonClick() {
    this.onBtnClick.emit();
  }
}
