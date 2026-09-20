import type { Packet } from '@/data/types';
import { DELGADO_PACKET } from './delgado';
import { ALVAREZ_PACKET, BROOKS_PACKET, CHEN_PACKET, KIM_PACKET, NGUYEN_PACKET, PATEL_PACKET } from './others';

export const PACKETS: Record<string, Packet> = {
  [DELGADO_PACKET.caseId]: DELGADO_PACKET,
  [ALVAREZ_PACKET.caseId]: ALVAREZ_PACKET,
  [KIM_PACKET.caseId]: KIM_PACKET,
  [CHEN_PACKET.caseId]: CHEN_PACKET,
  [PATEL_PACKET.caseId]: PATEL_PACKET,
  [NGUYEN_PACKET.caseId]: NGUYEN_PACKET,
  [BROOKS_PACKET.caseId]: BROOKS_PACKET,
};
