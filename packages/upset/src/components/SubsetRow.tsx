import { Subset } from '@visdesignlab/upset2-core';
import React, { FC } from 'react';
import { useRecoilValue } from 'recoil';

import { upsetConfigAtom } from '../atoms/config/upsetConfigAtoms';
import { AttributeBars } from './AttributeBars';
import { CardinalityBar } from './CardinalityBars';
import { DeviationBar } from './DeviationBars';
import { Matrix } from './Matrix';

type Props = {
  subset: Subset;
};

export const SubsetRow: FC<Props> = ({ subset }) => {
  const { visibleSets } = useRecoilValue(upsetConfigAtom);

  return (
    <>
      <Matrix sets={visibleSets} subset={subset} />
      <CardinalityBar size={subset.size} row={subset} />
      <DeviationBar deviation={subset.deviation} />
      <AttributeBars attributes={subset.attributes} />
    </>
  );
};
