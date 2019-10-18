import {Component, Inject, Renderer2} from '@angular/core';
import {AbstractRoom} from '../abstract-room';
import {DataService} from '../../../service/data.service';
import {ModalService} from '../../../service/modal.service';
import {ProgressService} from '../../../service/progress.service';
import {MovieComponent} from "../../base/movie/movie.component";

@Component({
  selector: 'app-playground',
  templateUrl: './playground.component.html',
  styleUrls: ['./playground.component.scss']
})
export class PlaygroundComponent extends AbstractRoom {

  constructor(@Inject(DataService) protected readonly dataService: DataService,
              @Inject(ProgressService) protected readonly progressService: ProgressService,
              @Inject(ModalService) protected readonly modalService: ModalService,
              @Inject(Renderer2) protected readonly renderer: Renderer2) {
    super(dataService, progressService, modalService, renderer);
  }

  public ngOnInit(): void {
    super.ngOnInit();
  }

  public entryAbaton(): void {
    this.modalService.openDialog(MovieComponent, false, {
    }).subscribe(() => {});
  }

}
