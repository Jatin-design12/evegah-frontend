import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-icon-button',
  templateUrl: './icon-button.component.html',
  styleUrls: ['./icon-button.component.scss']
})
export class IconButtonComponent implements OnInit {
  @Input() label: string;
  @Input() icon: string;
  @Input() class: string
  @Input() disabled :boolean = false;
  @Output() onClick = new EventEmitter<any>();

  constructor() { }

  ngOnInit(): void {
  }
  onClickButton(event) {
    this.onClick.emit(event);
  }
}
