import { a, useTransition } from 'react-spring';
import { useRecoilValue } from 'recoil';

import { hiddenSetSelector } from '../../atoms/config/setManagementAtoms';
import { upsetConfigAtom } from '../../atoms/config/upsetConfigAtoms';
import { dimensionsSelector } from '../../atoms/dimensionsAtom';
import { maxSetSizeSelector } from '../../atoms/maxSetSizeSelector';
import { setsSelector } from '../../atoms/setsAtoms';
import { useScale } from '../../hooks/useScale';
import { useProvenance } from '../../provenance';
import translate from '../../utils/transform';
import Group from '../custom/Group';
import { SetSizeBar } from '../custom/SetSizeBar';
import { SetHeader } from './SetHeader';
import { SetManagement } from './SetManagement';

/** @jsxImportSource @emotion/react */
export const MatrixHeader = () => {
  const { actions } = useProvenance();
  const sets = useRecoilValue(setsSelector);
  const { visibleSets } = useRecoilValue(upsetConfigAtom);
  const dimensions = useRecoilValue(dimensionsSelector);
  const maxCarinality = useRecoilValue(maxSetSizeSelector);
  const { set } = dimensions;

  const hiddenSets = useRecoilValue(hiddenSetSelector);

  const hiddenSetsTransition = useTransition(
    hiddenSets.map((setId, idx) => ({ id: setId, x: idx * (set.width + 1) })),
    {
      keys: (d) => d.id,
      enter: ({ x }) => ({ transform: translate(x, 0) }),
      update: ({ x }) => ({ transform: translate(x, 0) }),
    },
  );

  const scale = useScale([0, maxCarinality], [0, set.cardinality.height]);

  return (
    <>
      <SetHeader visibleSets={visibleSets} scale={scale} />
      <SetManagement />
      <Group
        tx={
          dimensions.matrixColumn.visibleSetsWidth +
          dimensions.gap +
          dimensions.matrixColumn.setManagementWidth +
          dimensions.gap
        }
        ty={0}
      >
        {hiddenSetsTransition(({ transform }, item) => {
          return (
            <a.g
              transform={transform}
              onClick={() => actions.addVisibleSet(item.id)}
            >
              <SetSizeBar
                scale={scale}
                setId={item.id}
                size={sets[item.id].size}
                foregroundOpacity={0.4}
                label={sets[item.id].elementName}
                showLabel
              />
            </a.g>
          );
        })}
      </Group>
    </>
  );
};
