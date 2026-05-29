import { PactMagic, Spell } from "../../../types";

export default interface PactSettingsProps {
  pactMagic: PactMagic;
  onUpdate: (pact: PactMagic) => void;
  spells?: Spell[];
}
