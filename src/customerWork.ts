export const customerWork = [
  { id: 'little-moments', title: 'Little moments', category: 'Portraits', file: 'child-portrait-7x5', dimensions: '5 × 7', sizeLabel: '7 × 5', width: 1060, height: 1484 },
  { id: 'faith-harmony', title: 'Faith & harmony', category: 'Creative designs', file: 'faith-artwork-9x12', dimensions: '9 × 12', sizeLabel: '12 × 9', width: 1448, height: 1086 },
  { id: 'floral-story', title: 'A floral story', category: 'Creative designs', file: 'rukmini-portrait-8x10', dimensions: '8 × 10', sizeLabel: '10 × 8', width: 1402, height: 1122 },
  { id: 'portrait-bloom', title: 'Portrait in bloom', category: 'Creative designs', file: 'deulu-portrait-8x6', dimensions: '8 × 6', sizeLabel: '8 × 6', width: 1086, height: 1448 },
  { id: 'wide-perspective', title: 'A wider perspective', category: 'Portraits', file: 'portrait-24x18', dimensions: '24 × 18', sizeLabel: '24 × 18', width: 1448, height: 1086 },
  { id: 'scenic-moment', title: 'A moment outdoors', category: 'Creative designs', file: 'scenic-portrait-16x20', dimensions: '16 × 20', sizeLabel: '20 × 16', width: 1121, height: 1403 },
  { id: 'statement-portrait', title: 'The statement portrait', category: 'Portraits', file: 'portrait-18x24', dimensions: '18 × 24', sizeLabel: '24 × 18', width: 1086, height: 1448 },
  { id: 'full-colour', title: 'A story in full colour', category: 'Creative designs', file: 'colorful-portrait-12x18', dimensions: '12 × 18', sizeLabel: '12 × 18', width: 1024, height: 1536 },
] as const

export type CustomerWork = typeof customerWork[number]
