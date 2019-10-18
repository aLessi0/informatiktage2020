import {Component, Inject, Renderer2} from '@angular/core';
import {AbstractRoom} from '../abstract-room';
import {DataService} from '../../../service/data.service';
import {ModalService} from '../../../service/modal.service';
import {ProgressService} from '../../../service/progress.service';

@Component({
  selector: 'app-requirement-design',
  templateUrl: './requirement-design.component.html',
  styleUrls: ['./requirement-design.component.scss']
})
export class RequirementDesignComponent extends AbstractRoom {

  ueliHidden = true;
  treeCounter: number = 0;

  constructor(@Inject(DataService) protected readonly dataService: DataService,
              @Inject(ProgressService) protected readonly progressService: ProgressService,
              @Inject(ModalService) protected readonly modalService: ModalService,
              @Inject(Renderer2) protected readonly renderer: Renderer2) {
    super(dataService, progressService, modalService, renderer);
  }

  public ngOnInit(): void {
    super.ngOnInit();
  }

  public ursClick(): void {
    this.walkTo('urs', () => this.openQuestion('room2coin1', '/assets/sprites/Room/2-req-and-design/Urs.svg'));
  }

  public petraClick(): void {
    this.walkTo('petra', () => this.openQuestion('room2key', '/assets/sprites/Room/2-req-and-design/Petra.svg'));
  }

  public ueliClick(): void {
    this.walkTo('ueli', () => this.openInfo('room2coin2', '/assets/sprites/Room/2-req-and-design/Ueli.svg'));
  }

  public ueliVisible() {
    this.treeCounter++;
    if (this.treeCounter >= 2) {
      this.ueliHidden = false;
    } else {
      this.ueliHidden = true;
    }
  }

  ueliReset() {
    this.treeCounter = 0;
    this.ueliHidden = true;
  }

}
