import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Log } from '../../Log';

@Component({
  selector: 'app-log-entry',
  templateUrl: './log-entry.component.html',
  styleUrls: ['./log-entry.component.css']
})
export class LogEntryComponent {
  @Input() log!: Log;
  @Input() actions?: boolean = true;
  @Input() duration!: string
  @Output() onEdit: EventEmitter<Log> = new EventEmitter;
  @Output() onDelete: EventEmitter<Log> = new EventEmitter;
  

  onEditClick(log: Log) {
    this.onEdit.emit(log);
  }

  onDeleteClick(log: Log) {
    this.onDelete.emit(log)
  }
}
