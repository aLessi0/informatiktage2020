import {Injectable} from '@angular/core';
import {MatDialog} from '@angular/material';
import {ComponentType} from '@angular/cdk/portal';

@Injectable({
  providedIn: 'root'
})
export class ModalService {

  constructor(public dialog: MatDialog) {
  }

  public openDialog(component: ComponentType<any>, disableDialogClose: boolean): void {
    const dialogRef = this.dialog.open(component, {
      width: '300px',
      data: {},
      disableClose: disableDialogClose
    });

    dialogRef.afterClosed().subscribe(res => {
    });
  }
}
