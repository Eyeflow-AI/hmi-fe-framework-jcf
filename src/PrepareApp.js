// React
import { useEffect, Fragment } from 'react';

// Design


// Internal
import { instance } from './api';
import { getStationList, getStation, setStationId } from './store/slices/app';
import getStationListThunk from './store/thunks/stationList';
import getPartsListThunk from './store/thunks/partsList';
import addInterceptors from './api/addInterceptors';
import getOriginalURLPath from './utils/functions/getOriginalURLPath';
import AlertUpdater from './utils/Hooks/AlertUpdater';
import CheckVersion from './utils/Hooks/CheckVersion';

// Thirdy-party
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';

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
    dispatch(getPartsListThunk());
  }, [dispatch]);

  useEffect(() => {
    if (location.pathname && stationList?.length > 0) {
      let thisMatch = getOriginalURLPath(location.pathname);
      if (thisMatch) {
        if (thisMatch.params.stationSlugLabel !== ":stationSlugLabel") {
          // Change station on URL change
          if (location.state?.changeType !== "click" && thisMatch.params.stationSlugLabel && thisMatch.params.stationSlugLabel !== stationSlugLabel) {
            console.warn("Changing station because URL Changed");
            let newStation = stationList.find((el) => el.slugLabel === thisMatch.params.stationSlugLabel);
            if (newStation) {
              dispatch(setStationId(newStation._id));
            }
            else {
              console.error(`Could not find slug label ${thisMatch.params.stationSlugLabel} in`, stationList, { url: location.pathname });
            };
          }
        }
      }
      else {
        //TODO Error handling
        console.warn(`Could not find match for ${location.pathname}. If you are not redirected, this is an error.`);
      }
    };
  }, [dispatch, stationList, location, stationSlugLabel]);

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
    <Fragment>
      <AlertUpdater />
      <CheckVersion />
      {stationId
        ? children
        : "Missing station list"
      }
    </Fragment>
  );
};

export default PrepareApp;
