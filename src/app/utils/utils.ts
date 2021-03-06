import { Deck } from '../models/deck';

export function deckToCurve(deck: Deck): Array<any> {
  const ret: any[] = [];
  deck.cards.forEach((card) => {
    if (
      card.type_line
        .split(' ')
        .find((t) => t.toLocaleLowerCase() === 'land') === undefined
    ) {
      let searchingFor = '';
      if (!card.color_identity[0]) {
        searchingFor = 'Colorless';
      } else if (card.color_identity.length > 1) {
        searchingFor = 'Multi';
      } else {
        searchingFor = card.color_identity[0];
      }
      let found = ret.find((r) => {
        if (r.name === searchingFor) {
          return true;
        }
        if (r.name.length !== card.color_identity.length) {
          return false;
        }
        for (let i = 0; i < r.name.length; i++) {
          if (r.name[i] !== card.color_identity[i]) {
            return false;
          }
        }
        return true;
      });
      if (!found) {
        found = {
          name: searchingFor,
          data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
          color: curveColor(card.color_identity),
        };
        ret.push(found);
      }
      if (card.cmc >= 9) {
        found.data[9] += card.amount;
      } else {
        found.data[card.cmc] += card.amount;
      }
    }
  });
  return ret;
}

function curveColor(color: Array<string>): string {
  if (color.length > 1) {
    return '#C9B47D';
  }
  switch (color[0]) {
    case 'G':
      return '#3d684b';
    case 'R':
      return '#c6553e';
    case 'B':
      return '#383431';
    case 'W':
      return '#ffffff';
    case 'U':
      return '#3b6ba0';
    default:
      return '#BEB9B2';
  }
}
