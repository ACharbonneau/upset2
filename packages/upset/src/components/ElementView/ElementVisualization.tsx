import { Button } from '@mui/material';
import { Box } from '@mui/system';
import { useMemo, useState } from 'react';
import { VegaLite } from 'react-vega';
import { useRecoilValue } from 'recoil';

import { bookmarkedIntersectionSelector } from '../../atoms/config/currentIntersectionAtom';
import { histogramSelector, scatterplotsSelector } from '../../atoms/config/plotAtoms';
import { elementItemMapSelector } from '../../atoms/elementsSelectors';
import { AddPlotDialog } from './AddPlotDialog';
import { generateVega } from './generatePlotSpec';

export const ElementVisualization = () => {
  const [openAddPlot, setOpenAddPlot] = useState(false);
  const scatterplots = useRecoilValue(scatterplotsSelector);
  const histograms = useRecoilValue(histogramSelector);
  const bookmarked = useRecoilValue(bookmarkedIntersectionSelector);

  const items = useRecoilValue(elementItemMapSelector(bookmarked));
  const vegaItems = useMemo(() => {
    return {
      elements: Object.values(JSON.parse(JSON.stringify(items))),
    };
  }, [items]);

  const vegaSpec = useMemo(() => {
    return generateVega(scatterplots, histograms) as any;
  }, [histograms, scatterplots]);

  const onClose = () => setOpenAddPlot(false);

  return (
    <Box>
      <Button onClick={() => setOpenAddPlot(true)}>Add Plot</Button>
      <AddPlotDialog open={openAddPlot} onClose={onClose} />
      <Box>
        {(scatterplots.length > 0 || histograms.length > 0) && (
          <VegaLite spec={vegaSpec} data={vegaItems} actions={false} />
        )}
      </Box>
    </Box>
  );
};
