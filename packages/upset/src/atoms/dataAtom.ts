import { CoreUpsetData } from '@visdesignlab/upset2-core';
import { atom } from 'recoil';

export const dataAtom = atom<CoreUpsetData | null>({
  key: 'base-data',
  default: null,
});
