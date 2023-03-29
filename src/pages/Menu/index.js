// React
import React, {useMemo} from 'react';

// Design
import Grid from '@mui/material/Grid';

import PageWrapper from '../../components/PageWrapper';
import GetSelectedStation from '../../utils/Hooks/GetSelectedStation';
import updatePath from '../../utils/functions/updatePath';
import ToolButton from '../../components/ToolButton';

// Third-party
import { useNavigate } from "react-router-dom";


export default function Home({pageOptions}) {

  const station = GetSelectedStation();
  const navigate = useNavigate();

  const {pageList} = useMemo(() => {
    let pageList = [];
    for (let pageData of (pageOptions?.options?.pageList ?? [])) {
      if (window.app_config.pages.hasOwnProperty(pageData.page)) {
        pageList.push({data: window.app_config.pages[pageData.page], icon: pageData.icon});
      }
      else {
        console.error(`Missing page ${pageData.page} in feConfig`);
      };
    };
    // let pageList = .map((page) => {window.app_config.pages[]});
    return {pageList};
  }, [pageOptions]);

  const onButtonClick = (pageData) => {
    navigate(updatePath(pageData.path, station), {state: {changeType: "click"}}); 
  };

  return (
    <PageWrapper>
      {({width, height}) => 
        <Grid
          container
          justifyContent={"center"}
          alignItems={"center"}
          spacing={4}
          width={width}
          height={height}
        >
          {pageList.map((pageData, index) =>
          <Grid item key={`tool-${index}`}>
            <ToolButton pageData={pageData} onButtonClick={onButtonClick}/>
          </Grid> 
          )}
        </Grid>
      }
    </PageWrapper>
  );
}
