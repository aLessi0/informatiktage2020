import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {ImageMapCoordinate} from "../image-map/image-map.component";

@Component({
  selector: 'app-avatar-selector',
  templateUrl: './avatar-selector.component.html',
  styleUrls: ['./avatar-selector.component.scss']
})


export class AvatarSelectorComponent implements OnInit {

  public selectAvatar;
  public chosenAvatarType: string = "Girl";

  image = "../../../assets/sprites/Icon/Avatar/Family.svg";
  coordinates: ImageMapCoordinate[] = [
    {
      name: 'Girl',
      x: 0,
      y: 30,
      width: 95,
      height: 220
    },
    {
      name: 'Man',
      x: 95,
      y: 30,
      width: 95,
      height: 220
    },
    {
      name: 'Woman',
      x: 190,
      y: 30,
      width: 95,
      height: 220
    },
    {
      name: 'Boy',
      x: 280,
      y: 30,
      width: 95,
      height: 220
    }
  ];

  ngOnInit() {
    this.selectAvatar = false;
    console.log("init avatar selector component");
  }

  chooseAvatar(avatarNameType: string) {
    this.chosenAvatarType = avatarNameType;
    console.log("choosenAvatar:", avatarNameType, " type: ", this.chosenAvatarType);
    this.selectAvatar = true;
  }

  getClick(coordinate: ImageMapCoordinate) {
    console.log(`Clicked on ${coordinate.name}`);
    this.chooseAvatar(coordinate.name);
  }

}
