import { AttackType } from '../src/spells/enums/attack-type.enum';
import { DiceType } from '../src/spells/enums/dice-type.enum';
import { MagicSchool } from '../src/spells/enums/magic-school.enum';
import { OutputType } from '../src/spells/enums/output-type.enum';
import { SaveAbility } from '../src/spells/enums/save-ability.enum';
import { SpellLevel } from '../src/spells/enums/spell-level.enum';

export interface SpellTemplate {
  name: string;
  level: SpellLevel;
  school: MagicSchool;

  castTime: string;
  ritual: boolean;

  range: string;

  duration: string;
  concentration: boolean;

  components: {
    verbal: boolean;
    somatic: boolean;
    material?: string; // presence implies required; absence means none
  };

  spellType: {
    attackSpell?: {
      kind: 'attack';
      attackType: AttackType;
      critRange?: number; // If number selected is 18, then the crit range is 18, 19 and 20
    };

    saveSpell?: {
      kind: 'save';
      saveAbility: SaveAbility;
    };

    utilitySpell?: {
      kind: 'utility';
    };
  };

  outputType: {
    leveledOutput?: {
      kind: 'leveled';

      dice: {
        count: number;
        die: DiceType;
        type: OutputType;
        addCastingMod?: boolean;
        flatBonus?: number;
      }[];

      projectiles?: {
        baseCount: number;
        upcast?: {
          count: number;
          everyNLevels: number;
          aboveLevel: number;
        };
      };

      upcast?: {
        dice?: {
          count: number;
          die: DiceType;
          type: OutputType;
          everyNLevels: number;
          aboveLevel: number;
          flatBonus?: number;
        }[];
      };
    };

    cantripOutput?: {
      kind: 'cantrip';
      dice: {
        count: number;
        die: DiceType;
        type: OutputType;
        addCastingMod?: boolean;
        flatBonus?: number;
      }[];

      scaling: {
        characterLevel: number;
        /** Total dice count at this threshold */
        diceCount?: number;
        /** Total projectile count at this threshold */
        projCount?: number;
      }[];
    };

    utilityOutput?: {
      kind: 'utility'; // no dice, no damage
    };
  };

  notes: string;
}
