import { ReactionType } from '../../enums';

export interface Reaction {
  id: string;
  targetId: string;
  ownerId: string;
  type: ReactionType;
}
