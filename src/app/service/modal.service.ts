import {Injectable} from '@angular/core';
import {MatDialog} from '@angular/material';
import {ComponentType} from '@angular/cdk/portal';

@Injectable({
  providedIn: 'root'
})
export class ModalService {

  constructor(public dialog: MatDialog) {
  }

  public openDialog(component: ComponentType<any>): void {
    const dialogRef = this.dialog.open(component, {
      width: '250px',
      data: {}
    });

    dialogRef.afterClosed().subscribe(res => {
    });
  }
}
