import {Component, ElementRef, Inject, Renderer2, ViewChild} from '@angular/core';
import {AbstractRoom} from '../abstract-room';
import {DataService} from '../../../service/data.service';
import {ModalService} from '../../../service/modal.service';
import {ProgressService} from '../../../service/progress.service';
import {Howl} from 'howler';

@Component({
  selector: 'app-entwicklung',
  templateUrl: './entwicklung.component.html',
  styleUrls: ['./entwicklung.component.scss']
})
export class EntwicklungComponent extends AbstractRoom {

  public planetState = 0;
  public sternbildState = 0;
  public starsHidden = [];
  public clickedStar = false;
  public invertTelescope = false;
  public alienAnimationRunning = false;

  private alienSound = new Howl({
    src: ['/assets/sound/alien.mp3']
  });
  private satelliteSound = new Howl({
    src: ['/assets/sound/satellite.mp3']
  });

  @ViewChild('alien', {read: ElementRef}) private alienRef: ElementRef;

  constructor(@Inject(DataService) protected readonly dataService: DataService,
              @Inject(ProgressService) protected readonly progressService: ProgressService,
              @Inject(ModalService) protected readonly modalService: ModalService,
              @Inject(Renderer2) protected readonly renderer: Renderer2) {
    super(dataService, progressService, modalService, renderer);
  }

  public animateAlien(): void {
    if (this.alienAnimationRunning) {
      return;
    }
    this.alienSound.play();
    this.alienAnimationRunning = true;
    let randomNumber = Math.floor(Math.random() * Math.floor(5));
    let animationClass = 'animation-' + randomNumber;
    this.renderer.addClass(this.alienRef.nativeElement, animationClass);

    this.alienRef.nativeElement.addEventListener('animationend', () => {
      this.alienAnimationRunning = false;
      this.renderer.removeClass(this.alienRef.nativeElement, animationClass);
    });
  }

  public katrinClick(): void {
    this.walkTo('katrin', () => this.openQuestion('room3key', '/assets/sprites/Room/3-develop-and-testing/Katrin.svg'));
  }

  public planetClick() {
    if (this.planetState < 3) {
      this.planetState++;
    }

    if (this.planetState >= 3) {
      this.walkTo('planet', () => this.openQuestion('room3coin1', '/assets/sprites/Room/3-develop-and-testing/Planet.svg'));
    }
  }

  public planetReset() {
    if (this.planetState < 3) {
      this.planetState = 0;
    }
  }

  public satelliteClick() {
    if (!this.satelliteSound.playing()) {
      this.satelliteSound.play();
    }
    this.openInfo('room3satellite', '/assets/sprites/Room/3-develop-and-testing/Satellit.svg');
  }

  public sternbildClick() {
    this.sternbildState = this.sternbildState + 40;
    if (this.sternbildState === 360) {
      this.sternbildState = 0;
    }
  }

  public telescopeClick() {
    this.invertTelescope = !this.invertTelescope;
  }

  public starClick(id) {
    this.clickedStar = true;
    if (!this.isStarHidden(id)) {
      this.starsHidden.push(id);
    }

    // check reward
    if (this.starsHidden.length === 4) {
      this.openInfo('room3coin2', '/assets/sprites/Room/3-develop-and-testing/Stars1-gross1.svg');
    }
  }

  public isStarHidden(id) {
    if (this.starsHidden.indexOf(id) !== -1) {
      return true;
    }
    return false;
  }

  public starReset() {
    if (this.clickedStar === false) {
      this.starsHidden = [];
    } else {
      this.clickedStar = false;
    }
  }

}
