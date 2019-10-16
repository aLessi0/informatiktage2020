import {Component, Inject} from '@angular/core';
import {DataService} from '../../service/data.service';

@Component({
  selector: 'app-avatar-selector',
  templateUrl: './avatar-selector.component.html',
  styleUrls: ['./avatar-selector.component.scss']
})
export class AvatarSelectorComponent {
  public chosenAvatarType: string;
  public avatarImageBasePath = '/assets/sprites/Icon/Avatar/';

  constructor(@Inject(DataService) private readonly dataService: DataService) {}

  public chooseAvatarType(event, avatarType) {
    this.chosenAvatarType = avatarType;
  }

  public createAvatar() {
    this.dataService.initData(this.chosenAvatarType);
  }
}
