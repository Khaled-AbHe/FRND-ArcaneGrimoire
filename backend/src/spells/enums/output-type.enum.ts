export enum OutputType {
  // Physical
  Piercing = 'Piercing',
  Bludgeoning = 'Bludgeoning',
  Slashing = 'Slashing',

  // Elemental
  Acid = 'Acid',
  Cold = 'Cold',
  Fire = 'Fire',
  Lightning = 'Lightning',
  Poison = 'Poison',
  Thunder = 'Thunder',

  // Mystical
  Force = 'Force',
  Radiant = 'Radiant',
  Necrotic = 'Necrotic',
  Psychic = 'Psychic',

  // Misc
  Elemental = 'Elemental', // For multiple choice damage types (i.e. Chromatic Orb, Sorcerer's Burst...)
  Mystical = 'Mystical', // For Spirit Guardians
  TemporaryHP = 'Temporary HP',
  Healing = 'Healing',
  AdditionalBeast = 'Additional Beast',
}
