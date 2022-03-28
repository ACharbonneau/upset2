import { atom, useRecoilState } from 'recoil';

export const rowHoverAtom = atom<string | null>({
  key: 'row-hover',
  default: null,
});

export const columnHoverAtom = atom<string | null>({
  key: 'column-hover',
  default: null,
});

export function useHoveredEntities() {
  const [hoveredRow, setHoveredRow] = useRecoilState(rowHoverAtom);
  const [hoveredColumn, setHoveredColumn] = useRecoilState(columnHoverAtom);

  return {
    shouldTreatAsHovered: (id: string) =>
      hoveredRow === id || hoveredColumn === id,
    rows: {
      set: setHoveredRow,
      get: hoveredRow,
    },
    columns: {
      set: setHoveredColumn,
      get: hoveredColumn,
    },
  };
}
