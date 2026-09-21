// Les sports affichés par le front. Les slugs et couleurs correspondent au seeder Laravel.

export interface Sport {
  id: string;
  name: string;
  color: string;
  rgb: string;
}

export const SPORTS: Sport[] = [
  { id: 'foot', name: 'FOOTBALL', color: '#01C187', rgb: '1, 193, 135' },
  { id: 'basket', name: 'BASKET', color: '#FE8D07', rgb: '254, 141, 7' },
  { id: 'tennis', name: 'TENNIS', color: '#FFC93C', rgb: '255, 201, 60' },
  { id: 'multi', name: 'TOUS SPORTS', color: '#3FA9FF', rgb: '63, 169, 255' },
];

/** Le sport correspondant au slug, ou le football par défaut. */
export function trouverSport(slug: string): Sport {
  return SPORTS.find((s) => s.id === slug) ?? SPORTS[0];
}
