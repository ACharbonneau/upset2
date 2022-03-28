/** @jsxImportSource @emotion/react */
import '@fortawesome/fontawesome-free/css/all.css';

import { css } from '@emotion/react';
import { FC } from 'react';

import { useSvgDimensions } from '../atoms/dimensionsAtom';
import translate from '../utils/transform';

export const SvgBase: FC = ({ children }) => {
  const { height, width, margin } = useSvgDimensions();

  return (
    <div
      css={css`
        height: 100%;
        width: 100%;
        text.icon {
          font-family: 'Font Awesome 5 Free';
          font-weight: 700;
          font-size: 12px;
        }
      `}
    >
      <svg height={height + 2 * margin} width={width + 2 * margin}>
        <g transform={translate(margin)}>
          <rect
            height={height}
            width={width}
            fill="none"
            stroke="black"
            opacity="0"
          />
          {children}
        </g>
      </svg>
    </div>
  );
};
