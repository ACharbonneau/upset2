import { css } from '@emotion/react';
import { CoreUpsetData, UpsetConfig } from '@visdesignlab/upset2-core';
import { createContext, FC, useEffect, useMemo } from 'react';
import { useRecoilState, useSetRecoilState } from 'recoil';

import { attributeAtom } from '../atoms/attributeAtom';
import { itemsAtom } from '../atoms/itemsAtoms';
import { setsAtom } from '../atoms/setsAtoms';
import { UpsetActions, UpsetProvenance, useProvenance } from '../provenance';
import { Body } from './Body';
import { ElementSidebar } from './ElementView/ElementSidebar';
import { Header } from './Header/Header';
import { Sidebar } from './Sidebar';
import { SvgBase } from './SvgBase';

/** @jsxImportSource @emotion/react */
const baseStyle = css`
  padding: 0.25em;
`;

type Props = {
  data: CoreUpsetData;
  config: UpsetConfig;
  extProvenance?: {
    provenance: UpsetProvenance;
    actions: UpsetActions;
  };
  yOffset: number;
};

export const Root: FC<Props> = ({ data, config, yOffset }) => {
  const { provenance } = useProvenance();
  (window.parent.window as any).provenace = () => {
    console.table(JSON.parse(JSON.stringify(provenance.graph.nodes)));
  };

  const [sets, setSets] = useRecoilState(setsAtom);
  const [items, setItems] = useRecoilState(itemsAtom);
  const setAttributeColumns = useSetRecoilState(attributeAtom);

  // This hook will populate initial sets, items, attributes
  useEffect(() => {
    setSets(data.sets);
    setItems(data.items);
    setAttributeColumns(data.attributeColumns);
  }, [data]);

  if (Object.keys(sets).length === 0 || Object.keys(items).length === 0)
    return null;

  return (
    <ProvenanceContext.Provider
      value={{
        provenance,
        actions,
        isAtLatest: provenance.current.children.length === 0,
        isAtRoot: provenance.current.id === provenance.root.id,
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
    </>
  );
};
