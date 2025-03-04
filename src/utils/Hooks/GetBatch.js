import { useState, useEffect } from "react";

import API from "../../api";
import Clock from "./Clock";
import { isEqual } from "lodash";

export default function GetBatch({ stationId, sleepTime = 30000 } = {}) {
  const [batchId, setSelectedBatchId] = useState(null);
  const [data, setData] = useState({ batch: null });
  const [loading, setLoading] = useState(null);
  const { clock } = Clock({ sleepTime });

  const onChangeBatchId = (newBatchId) => {
    setSelectedBatchId(newBatchId);
  };

  const loadBatch = () => {
    if (stationId && batchId) {
      API.get
        .batchData({ stationId, batchId }, setLoading)
        .then((response) => {
          let batch = response.batch;

          if (!isEqual(batch, data.batch)) {
            setData(response);
          } else {
            // console.log(`Selected batch did not update`);
          }
        })
        .catch(console.log);
    } else {
      setData({ batch: null });
    }
  };

  useEffect(() => {
    loadBatch();
    // eslint-disable-next-line
  }, [clock, stationId, batchId]);

  return {
    batchId,
    onChangeBatchId,
    batch: data.batch,
    loading,
    loadBatch,
  };
}
