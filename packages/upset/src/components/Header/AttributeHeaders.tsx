import { useRecoilValue } from 'recoil';

import { upsetConfigAtom } from '../../atoms/config/upsetConfigAtoms';
import { dimensionsSelector } from '../../atoms/dimensionsAtom';
import translate from '../../utils/transform';
import { AttributeHeader } from './AttributeHeader';

export const AttributeHeaders = () => {
  const dimensions = useRecoilValue(dimensionsSelector);
  const { visibleAttributes } = useRecoilValue(upsetConfigAtom);

  return (
    <g
      transform={translate(
        dimensions.matrixColumn.width +
          dimensions.gap +
          dimensions.cardinality.width +
          dimensions.gap +
          dimensions.attribute.width +
          dimensions.attribute.vGap,
        dimensions.header.totalHeight - dimensions.attribute.height,
      )}
    >
      {visibleAttributes.map((attribute, idx) => {
        return (
          <g
            key={attribute}
            transform={translate(
              idx * (dimensions.attribute.width + dimensions.attribute.vGap),
              0,
            )}
          >
            <AttributeHeader attribute={attribute} />
          </g>
        );
      })}
    </g>
  );
};
