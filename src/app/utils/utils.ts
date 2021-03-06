import { Deck } from '../models/deck';

export function deckToCurve(deck: Deck): Array<any> {
  const ret: any[] = [];
  deck.cards.forEach((card) => {
    if (
      card.type_line
        .split(' ')
        .find((t) => t.toLocaleLowerCase() === 'land') === undefined
    ) {
      let found = ret.find((r) => {
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
          name:
            card.color_identity.length > 1
              ? 'Multi'
              : !card.color_identity[0]
              ? 'Colorless'
              : card.color_identity,
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
      return '#7E956D';
    case 'R':
      return '#DB8664';
    case 'B':
      return '#ACA29A';
    case 'W':
      return '#F0F2C0';
    case 'U':
      return '#B5CDE3';
    default:
      return '#BEB9B2';
  }
}
