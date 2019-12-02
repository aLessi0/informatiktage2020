import {Injectable} from '@angular/core';
import {MatDialog} from '@angular/material';
import {ComponentType} from '@angular/cdk/portal';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ModalService {

  constructor(public dialog: MatDialog) {
  }

  public openDialog<T>(component: ComponentType<any>, disableDialogClose: boolean, data?: T): Observable<any> {
    return Observable.create((subscriber) => {
      const dialogRef = this.dialog.open(component, {
        data,
        disableClose: disableDialogClose,
        panelClass: 'modal',
      });

      dialogRef.afterClosed().subscribe(res => {
        subscriber.next(res);
      });
    });
  }

  public closeDialog() {
    this.dialog.closeAll();
  }
}
