import React, { useEffect, useState } from 'react'


//Design
import Box from '@mui/material/Box';


//Internal
import AppBar from '../../components/AppBar';
import EventHeader from '../../components/EventHeader';
import EventMenuBox from '../../components/EventMenuBox';
import EventBatchDataBox from '../../components/EventBatchDataBox';
import GetBatchList from '../../utils/Hooks/GetBatchList';
import GetSelectedStation from '../../utils/Hooks/GetSelectedStation';
import API from '../../api';


const styleSx = {
  mainBox: {
    display: 'flex',
    width: 'calc(100vw)',
    padding: 1,
    overflow: 'hidden',
  },
  eventMenuBox: Object.assign({}, window.app_config.style.box, {
    bgcolor: 'white',
  }),
  dataBox: {
    display: 'flex',
    flexDirection: 'column',
    flexGrow: 1,
    marginLeft: 1,
    gap: 1,
  },
};


export default function Monitor({pageOptions}) {

  const { _id: stationId } = GetSelectedStation();
  const [queryParams, setQueryParams] = useState(null);
  const { batchList } = GetBatchList({ stationId, queryParams, sleepTime: pageOptions.options.getEventSleepTime });
  const [selectedBatch, setSelectedBatch] = useState(null);
  const [selectedBatchCountData, setSelectedBatchCountData] = useState(null);

  const onChangeEvent = (batchId) => {
    API.get.batch({ stationId, batchId })
      .then((data) => {
        setSelectedBatch(data.batch);
        setSelectedBatchCountData(data.countData);
      })
      .catch(console.error);
  };

  useEffect(() => {
    if (selectedBatch && batchList.findIndex((el) => el._id === selectedBatch._id) === -1) {
      setSelectedBatch(null);
      setSelectedBatchCountData(null);
    };
    // eslint-disable-next-line
  }, [batchList]);

  useEffect(() => {
    if (queryParams && queryParams.station !== stationId) {
      setQueryParams((params) => Object.assign({}, params, { station: stationId }));
    };
  }, [stationId, queryParams]);

  const onChangeParams = (newValue) => {
    setQueryParams((params) => {
      let newParams = Boolean(params) ? { ...params } : {};
      Object.assign(newParams, newValue);
      if (!newParams.hasOwnProperty("station")) {
        newParams["station"] = stationId;
      };
      return newParams;
    });
  };

  return (
    <>
      <AppBar />
      <Box id="monitor-main-box" sx={styleSx.mainBox} height={`calc(100vh - ${window.app_config.components.AppBar.height}px)`}>
        <Box id="monitor-event-menu-box" sx={styleSx.eventMenuBox} width={pageOptions.options.eventMenuWidth}>
          <EventMenuBox
            type="batch"
            events={batchList}
            selectedEvent={selectedBatch}
            onChangeEvent={onChangeEvent}
            queryParams={queryParams}
            onChangeParams={onChangeParams}
            config={pageOptions.components.EventMenuBox}
          />
        </Box>
        <Box id="monitor-data-box" sx={styleSx.dataBox}>
          <EventHeader
            data={selectedBatch}
            disabled={!selectedBatch}
            config={pageOptions.components.EventHeader}
          />
          <EventBatchDataBox
            data={selectedBatch}
            countData={selectedBatchCountData}
            disabled={!selectedBatch}
            config={pageOptions.components.EventBatchDataBox}
          />
        </Box>
      </Box>
    </>
  );
}
