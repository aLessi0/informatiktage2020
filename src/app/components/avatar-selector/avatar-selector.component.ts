import {Component, EventEmitter, Inject, Input, OnInit, Output} from '@angular/core';
import {DataService} from "../../service/data.service";
import {animate, group, query, state, style, transition, trigger} from "@angular/animations";
import {reduce} from "rxjs/operators";

@Component({
  selector: 'app-avatar-selector',
  templateUrl: './avatar-selector.component.html',
  styleUrls: ['./avatar-selector.component.scss']
})

  /*
animations: [
  trigger('theChoosenOne', [
    transition('up <=> down', [
      animate('0.5s')
    ]),
    state('up', style({
      opacity: 0.5,
      backgroundColor: 'green'
    })),
    state('down', style({
      opacity: 1,
      backgroundColor: 'blue'
    }))
  ])
  ]
})

/*
animations: [
  trigger('theChoosenOne', [
    transition('* <=> *', [
      group([
        query('up', [
          style({transform: 'translateX(100%)'}),
          animate('0.4s easy-in-out', style({transform: 'translateX(0%)'}))
        ], {optional: true}),
        query('down', [
          style({transform: 'translateX(0%)'}),
          animate('0.4s easy-in-out', style({transform: 'translateX(-100%)'}))
        ], {optional: true}),
      ])
    ]),
  ]),
  trigger('squash',  [
    state('* <=> *', style({
      'text-transform':  'uppercase',
    })),
    transition(':decrement',  [
      animate('100ms', style({
        transform:  'scale(0.9, 0.9)',
      })),
      animate('300ms'),
    ]),
  ])
]
*/

export class AvatarSelectorComponent implements OnInit {

  private chosenAvatarType: string = 'Girl';
  private avatarImageBasePath = '/assets/sprites/Icon/Avatar/';

  constructor(@Inject(DataService) private readonly dataService: DataService) {
  }

  ngOnInit() {
    console.log('init avatar selector component');
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
