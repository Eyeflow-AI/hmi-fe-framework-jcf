import { useEffect, Suspense } from 'react';

import { useDispatch, useSelector } from 'react-redux';
import { useLocation, matchPath } from 'react-router-dom';

import { instance } from './api';
import { getStationList, getStation, setStationId } from './store/slices/app';
import getStationListThunk from './store/thunks/stationList';

import addInterceptors from './api/addInterceptors';
import getOriginalURLPath from './utils/functions/getOriginalURLPath';

addInterceptors(instance);



function PrepareApp({ children }) {
  const dispatch = useDispatch();
  const location = useLocation();

  const stationList = useSelector(getStationList);
  const station = useSelector(getStation);
  const stationId = station?._id ?? null;
  const stationSlugLabel = station?.slugLabel ?? "";

  useEffect(() => {
    dispatch(getStationListThunk());
  }, [dispatch]);

  useEffect(() => {
    if (stationList?.length > 0) {
      let thisMatch = getOriginalURLPath(location.pathname);
      if (thisMatch) {
        // Change station on URL change
        if (location.state?.changeType !== "click" && thisMatch.params.stationSlugLabel && thisMatch.params.stationSlugLabel !== stationSlugLabel) {
          console.log("Changing station because URL Changed");
          let newStation = stationList.find((el) => el.slugLabel === thisMatch.params.stationSlugLabel);
          if (newStation) {
            dispatch(setStationId(newStation._id));
          }
          else {
            console.error("Something went wrong");
          };
        }
      }
      else {
        //TODO Error handling
        console.error("Something went wrong");
      }
    };
  }, [stationList, location, stationSlugLabel]);

  useEffect(() => {
    if (stationList?.length > 0) {
      if (!stationId || (stationId && stationList.findIndex((el) => el._id === stationId) === -1)) {
        dispatch(setStationId(stationList[0]._id));
      };
    }
    else {
      dispatch(setStationId(""));
    };
  }, [dispatch, stationId, stationList]);

  return (
    <Suspense fallback={<p> Loading...</p>}>
      {stationId
        ? children
        : "Missing station list"
      }
    </Suspense>
  );
};

export default PrepareApp;
