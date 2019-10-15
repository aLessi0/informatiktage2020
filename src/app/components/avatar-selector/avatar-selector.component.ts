import {Component, EventEmitter, Inject, Input, OnInit, Output} from '@angular/core';
import {DataService} from "../../service/data.service";

@Component({
  selector: 'app-avatar-selector',
  templateUrl: './avatar-selector.component.html',
  styleUrls: ['./avatar-selector.component.scss']
})


export class AvatarSelectorComponent implements OnInit {

  private chosenAvatarType: string = "Girl";
  private avatarImageBasePath = '../../../assets/sprites/Icon/Avatar/';

  constructor(@Inject(DataService) private readonly dataService: DataService) {
  }

  ngOnInit() {
    console.log("init avatar selector component");
  }

  public chooseAvatarType(event, avatarType) {
    console.log(event)
    console.log("active chosen avatar:", avatarType);
    this.chosenAvatarType = avatarType;
  }

  public createAvatar() {
    console.log("create avatar: ", this.chosenAvatarType);
    this.dataService.initData(this.chosenAvatarType).then(() => {
      console.log('avatar created');
    });
  }

}
