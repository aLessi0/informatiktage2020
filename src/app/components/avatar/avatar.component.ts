import {Component, EventEmitter, Inject, Input, OnInit, Output} from '@angular/core';
import {DataService} from "../../service/data.service";

@Component({
  selector: 'app-avatar',
  templateUrl: './avatar.component.html',
  styleUrls: ['./avatar.component.scss']
})
export class AvatarComponent implements OnInit {

  private avatarImageBasePath = '../../../assets/sprites/Icon/Avatar/';

  @Input() avatarType: string;

  constructor(@Inject(DataService) private readonly dataService: DataService) {
  }

  ngOnInit() {
    console.log("init avatar component");
  }

  public getAvatarImg(): string {
    return this.avatarImageBasePath + this.avatarType + ".svg";
  }

  public createAvatar() {
    this.dataService.initData(this.avatarType).then(() => {
      console.log('avatar created');
    });
  }
}
