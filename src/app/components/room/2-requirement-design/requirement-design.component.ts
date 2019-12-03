import {Component, Inject, Renderer2} from '@angular/core';
import {AbstractRoom} from '../abstract-room';
import {DataService} from '../../../service/data.service';
import {ModalService} from '../../../service/modal.service';
import {ProgressService} from '../../../service/progress.service';
import {Howl} from 'howler';

@Component({
  selector: 'app-requirement-design',
  templateUrl: './requirement-design.component.html',
  styleUrls: ['./requirement-design.component.scss']
})
export class RequirementDesignComponent extends AbstractRoom {

  ueliHidden = true;
  treeCounter = 0;

  private fireSound = new Howl({
    src: ['/assets/sound/feuer.mp3']
  });

  constructor(@Inject(DataService) protected readonly dataService: DataService,
              @Inject(ProgressService) protected readonly progressService: ProgressService,
              @Inject(ModalService) protected readonly modalService: ModalService,
              @Inject(Renderer2) protected readonly renderer: Renderer2) {
    super(dataService, progressService, modalService, renderer);
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

  public fireClick(): void {
    if (!this.fireSound.playing()) {
      this.fireSound.play();
    }
    this.openInfo('room2fire', '/assets/sprites/Room/2-req-and-design/Fire.svg', () => this.fireSound.stop());
  }

  public ueliVisible() {
    this.treeCounter++;
    if (this.treeCounter >= 2) {
      this.ueliHidden = false;
    } else {
      this.ueliHidden = true;
    }
  }
}
