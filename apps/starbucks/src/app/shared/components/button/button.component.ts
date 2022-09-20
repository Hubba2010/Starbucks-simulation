import {
  ChangeDetectionStrategy,
  Component,
  Output,
  Input,
  EventEmitter,
} from '@angular/core';

@Component({
  selector: 'starbucks-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ButtonComponent {
  @Input() disabled?: boolean;
  @Output() clicked = new EventEmitter<void>();

  click(): void {
    this.clicked.emit();
  }
}
