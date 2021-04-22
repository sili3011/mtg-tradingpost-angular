import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CardAdapter } from 'src/app/models/card-adapter';
import { Format } from 'src/app/models/constants';
import { FORMATS, LISTTYPES } from 'src/app/models/enums';
import { imageTooltip } from 'src/app/utils/utils';

@Component({
  selector: 'mtg-card-detail',
  templateUrl: './card-detail.component.html',
  styleUrls: ['./card-detail.component.scss'],
})
export class CardDetailComponent implements OnInit {
  @Input()
  card!: CardAdapter;

  @Input()
  format?: Format;

  @Input()
  listType!: LISTTYPES;

  @Input()
  canCompanion = false;

  @Input()
  isCompanion = false;

  @Input()
  commander = false;

  @Input()
  isMissing = false;

  @Output()
  incrementEmitter: EventEmitter<CardAdapter> = new EventEmitter();

  @Output()
  decrementEmitter: EventEmitter<CardAdapter> = new EventEmitter();

  @Output()
  moveToSidedeckEmitter: EventEmitter<void> = new EventEmitter();

  @Output()
  moveToDeckEmitter: EventEmitter<void> = new EventEmitter();

  @Output()
  assignAsCompanionEmitter: EventEmitter<void> = new EventEmitter();

  @Output()
  unassignAsCompanionEmitter: EventEmitter<void> = new EventEmitter();

  @Output()
  assignAsCommanderEmitter: EventEmitter<void> = new EventEmitter();

  @Output()
  moveToWishlistEmitter: EventEmitter<void> = new EventEmitter();

  Formats = FORMATS;
  ListTypes = LISTTYPES;

  showMenu = false;

  constructor() {}

  ngOnInit(): void {}

  imageTooltip(card: CardAdapter | undefined, type: 'normal' | 'art'): string {
    return card
      ? card!.card_faces
        ? imageTooltip(card!.card_faces[0].image_uris!, type)
        : imageTooltip(card!.image_uris!, type)
      : '';
  }

  increment() {
    this.incrementEmitter.emit(this.card);
  }

  decrement() {
    this.decrementEmitter.emit(this.card);
  }

  cardBacks(): Array<number> {
    const ret = [];
    for (let i = 1; i < this.card.amount; ++i) {
      ret.push(i);
    }
    return ret;
  }

  flipCard(id: string) {
    const flip = document.getElementById(id);
    flip!.classList.contains('animated')
      ? flip!.classList.remove('animated')
      : flip!.classList.add('animated');
  }

  toggleMenu() {
    this.showMenu = !this.showMenu;
  }

  moveToSidedeck() {
    this.moveToSidedeckEmitter.emit();
  }

  moveToDeck() {
    this.moveToDeckEmitter.emit();
  }

  assignAsCompanion() {
    this.assignAsCompanionEmitter.emit();
  }

  unassignAsCompanion() {
    this.unassignAsCompanionEmitter.emit();
  }

  assignAsCommander() {
    this.assignAsCommanderEmitter.emit();
  }

  moveToWishlist() {
    this.moveToWishlistEmitter.emit();
  }
}
