import { css } from '@emotion/react';
import { CoreUpsetData, UpsetConfig } from '@visdesignlab/upset2-core';
import { createContext, FC, useMemo } from 'react';
import { useSetRecoilState } from 'recoil';

import { upsetConfigAtom } from '../atoms/config/upsetConfigAtoms';
import { isAtLatestAtom, isAtRootAtom } from '../atoms/provenanceAtom';
import { getActions, initializeProvenanceTracking, UpsetActions, UpsetProvenance } from '../provenance';
import { Body } from './Body';
import { ElementSidebar } from './ElementView/ElementSidebar';
import { Header } from './Header/Header';
import { Sidebar } from './Sidebar';
import { SvgBase } from './SvgBase';

/** @jsxImportSource @emotion/react */
const baseStyle = css`
  padding: 0.25em;
`;

export const ProvenanceContext = createContext<{
  provenance: UpsetProvenance;
  actions: UpsetActions;
}>(undefined!);

type Props = {
  data: CoreUpsetData;
  config: UpsetConfig;
  extProvenance?: {
    provenance: UpsetProvenance;
    actions: UpsetActions;
  };
  yOffset: number;
};

export const Root: FC<Props> = ({ config, yOffset }) => {
  // Get setter for recoil config atom
  const setState = useSetRecoilState(upsetConfigAtom);
  const rootSetter = useSetRecoilState(isAtRootAtom);
  const latestSetter = useSetRecoilState(isAtLatestAtom);

  // Initialize Provenance and pass it setter to connect
  const { provenance, actions } = useMemo(() => {
    const provenance = initializeProvenanceTracking(
      config,
      setState,
      rootSetter,
      latestSetter,
    );
    const actions = getActions(provenance);
    return { provenance, actions };
  }, [config]);

  return (
    <ProvenanceContext.Provider
      value={{
        provenance,
        actions,
      }}
    >
      <div
        css={css`
          flex: 0 0 auto;
          overflow: auto;
          ${baseStyle};
        `}
      >
        <Sidebar />
      </div>
      <div
        css={css`
          flex: 1 1 auto;
          overflow: auto;
          ${baseStyle};
        `}
      >
        <SvgBase>
          <Header />
          <Body />
        </SvgBase>
      </div>
      <ElementSidebar yOffset={yOffset} />
    </ProvenanceContext.Provider>
  );
};
