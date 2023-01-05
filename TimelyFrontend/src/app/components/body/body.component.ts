import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Log } from '../../Log';
import { ApiService } from '../../services/api.service';
import toDateTimeLocalFormat from '../../utils/toDateTimeLocalFormat';
import { DialogBodyComponent } from '../dialog-body/dialog-body.component';

@Component({
  selector: 'app-body',
  templateUrl: './body.component.html',
  styleUrls: ['./body.component.css']
})

export class BodyComponent {
  public name!: string;
  public logs!: Log[];
  public projectName!: string;
  public startDateTime!: Date;
  public endDateTime!: Date;
  public isCurrentLogStarted = false;

  constructor(private apiService: ApiService, private matDialog: MatDialog) { }

  ngOnInit() {
    this.apiService.getLogs().subscribe((res) => {
      this.logs = res;
    }, error => console.error(error));
  }

  onBtnClick() {
    if (this.isCurrentLogStarted === false) {
      this.toggleCurrentLogStarted();
      this.startDateTime = new Date;
      return;
    }
      this.toggleCurrentLogStarted();
      this.openDialog('add');
  }

  toggleCurrentLogStarted() {
    return this.isCurrentLogStarted = !this.isCurrentLogStarted;
  }

  openDialog(mode: string, log?: Log) {
    if (mode === 'add') {
      const dialogRef = this.matDialog.open(DialogBodyComponent, {
        data: { name: this.name, projectName: this.projectName, mode: mode },
        width: '500px'
      });

      dialogRef!.afterClosed().subscribe((result) => {
        if (!result) { return; }
        this.projectName = result;
        this.postLog();
      });
    }

    if (log?.startDateTime && log?.endDateTime && mode === 'edit') {
      const dialogRef = this.matDialog.open(DialogBodyComponent, {
        data: {
          name: this.name,
          id: log.id,
          projectName: log.projectName,
          startDateTime: toDateTimeLocalFormat(log.startDateTime),
          endDateTime: toDateTimeLocalFormat(log.endDateTime),
          mode: mode
        },
        width: '500px'
      });

      dialogRef!.afterClosed().subscribe((result) => {
        if (!result) { return }
        const logEdit: Log = {
          id: result.id,
          projectName: result.projectName,
          startDateTime: result.startDateTime,
          endDateTime: result.endDateTime
          }
        this.editLog(logEdit);
      });

    }
  }


  updateFrontendLogs(log: Log, mode: string) {
    if (mode === 'add') {
      this.logs?.push(log)
    }
    if (mode === 'remove') {
      this.logs = this.logs?.filter(el =>  el.id !== log.id )
    }
    if (mode === 'update') {
      this.logs.forEach((el) => {
          if (el.id === log.id) {
            el.projectName = log.projectName;
            el.startDateTime = new Date(log.startDateTime ?? '');
            el.endDateTime = new Date(log.endDateTime ?? '');
          }
      })
    }
  }


  postLog() {
    const newLog = {
      projectName: this.projectName,
      startDateTime: this.startDateTime,
      endDateTime: new Date()
    }

    try {
      this.apiService.addLog(newLog).subscribe((res) => {
        this.updateFrontendLogs(res, 'add');
      })
    } catch (e) {
      console.error(e);
    }
  }


  onDelete(log:Log) {
    try {
      this.apiService.deleteLog(log).subscribe();
      this.updateFrontendLogs(log, 'remove')
    } catch (e) {
      console.error(e);
    }
    
  }


  onEdit(log: Log) {
    this.openDialog('edit', log)

  }


  editLog(log: Log) {
    try {
      this.apiService.editLog(log).subscribe();
      this.updateFrontendLogs(log, 'update')
    } catch (e) {
      console.error(e);
    }
  }

  deleteAllLogs() {
    if (this.isCurrentLogStarted) { this.toggleCurrentLogStarted() }
    this.logs.map((el) => {
      this.onDelete(el);
      this.updateFrontendLogs(el, 'remove')
    })
  }

  calculateDuration(startDateTime, endDateTime) {
    let duration= ''
    if (!startDateTime || !endDateTime) {
      return duration;
    }

    let dateDiff = Math.round(Math.abs(new Date(endDateTime).getTime() - new Date(startDateTime).getTime()) / 1000);

    const days = Math.floor(dateDiff / 86400);
    dateDiff -= days * 86400;

    const hours = Math.floor(dateDiff / 3600) % 24;
    dateDiff -= hours * 3600;

    const minutes = Math.floor(dateDiff / 60) % 60;
    dateDiff -= minutes * 60;

    const seconds = dateDiff % 60;
    if (days !== 0) {
      duration += `${days} d `
    }
    if (hours !== 0) {
      duration += `${hours} h `
    }
    if (minutes !== 0) {
      duration += `${minutes} m `
    }
    if (seconds !== 0) {
      duration += `${seconds} s`
    }

    return duration;
  }
  
}
