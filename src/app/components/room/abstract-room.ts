import {Inject, Input} from '@angular/core';
import {RoomModel} from '../../model/game/room.model';
import {QuestionModel} from '../../model/game/question.model';
import {QuizfrageComponent} from '../base/quizfrage/quizfrage.component';
import {InfotextComponent, InfotextData} from '../base/infotext/infotext.component';
import {DataService} from '../../service/data.service';
import {ModalService} from '../../service/modal.service';


export class AbstractRoom {

  @Input() public room: RoomModel;

  constructor(@Inject(DataService) protected readonly dataService: DataService,
              @Inject(ModalService) protected readonly modalService: ModalService) {
  }

  public openQuestion(question: QuestionModel): void {
    this.dataService.selectQuestion(question);
    this.modalService.openDialog(QuizfrageComponent, false).subscribe(() => {
      this.dataService.unselectQuesion();
    });
  }

  public openInfoModal(): void {
    const text: InfotextData = {
      text: '"Lorem Ipsum Dolor Sit anem!" schrie Dumbledore durch den Wald.' +
        ' Die Affen jedoch reagierten kaum und so konnte Mittelerde vom Terminator ' +
        'verschohnt werden. Im Hintergrund hört man Dumbo sagen: "Möge die Macht mit dir sein"'
    };
    this.modalService.openDialog(InfotextComponent, false, text)
      .subscribe(() => console.log('closed'));
  }

}
