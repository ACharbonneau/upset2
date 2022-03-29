import { atom } from 'recoil';

export const isAtRootAtom = atom({
  key: 'is-at-root',
  default: true,
});

export const isAtLatestAtom = atom({
  key: 'is-at-latest',
  default: true,
});
