// React
import React, { useEffect, useState } from "react";

// Design
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

// Internal

// Third-party
import { useTranslation } from "react-i18next";
import { ResponsiveLine } from '@nivo/line';
import { colors } from 'sdk-fe-eyeflow';

const CustomTooltip = ({ color, value, id }) => (
  <Box sx={{
    background: colors.paper.blue.dark,
    width: '100%',
    height: '100%',
    display: 'flex',
    // flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 1,
    textTransform: 'uppercase',
  }}>
    <div style={{ width: '15px', height: '15px', backgroundColor: color }}></div>
    &nbsp;&nbsp;
    {id}: {value}
  </Box>
);




const responsiveTheme = {
  tooltip: {
    container: {
      background: colors.paper.blue.dark
    }
  },
  labels: {
    text: {
      fontSize: 35,
      fill: '#ffffff',
      textShadow: "1px 1px 2px #353535"
    }
  },
  legends: {
    text: {
      fontSize: 20,
      fill: '#ffffff',
    }
  },
  "grid": {
    "line": {
        "stroke": "#dddddd",
        "strokeWidth": 0.1
    }
  },
  "axis": {
    "domain": {
        "line": {
            "stroke": "#777777",
            "strokeWidth": 1
        }
    },
    "legend": {
        "text": {
            "fontSize": 12,
            "fill": "white",
            "outlineWidth": 0,
            "outlineColor": "transparent"
        }
    },
    "ticks": {
        "line": {
            "stroke": "#777777",
            "strokeWidth": 1
        },
        "text": {
            "fontSize": 11,
            "fill": "white",
            "outlineWidth": 0,
            "outlineColor": "transparent"
        }
    }
  }
};

const responsiveLegends = [
  {
    anchor: 'bottom',
    direction: 'column',
    justify: false,
    translateY: 100,
    translateX: -80,
    itemsSpacing: 10,
    itemWidth: 10,
    itemHeight: 18,
    itemTextColor: 'white',
    itemDirection: 'left-to-right',
    itemOpacity: 1,
    symbolSize: 15,
    symbolShape: 'square',
    effects: [
      {
        on: 'hover',
        style: {
          itemTextColor: '#000'
        }
      }
    ],
  }
];

export default function Line({ chart }) {

  const { t } = useTranslation();
  const [info, setInfo] = useState([]);
  const [queryHasColors, setQueryHasColors] = useState(false);

  useEffect(() => {
    if (!chart?.result?.length) return
    else {
      let newInfo = chart?.result ?? [];
      newInfo.id = t(newInfo.id);
      setInfo(newInfo);
      setQueryHasColors(Object.keys(chart?.chartInfo?.colors_results ?? {}).length > 0 ? true : false);
    }
    // setData(chart.result)
  }, [chart])


  return (
    <Box
      sx={{
        display: 'flex',
        width: `${chart.chartInfo.width}`,
        height: `${chart.chartInfo.height}`,
        flexDirection: 'column',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          width: '100%',
          height: '50px',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }} textAlign={'center'}>
          {t(chart.chartInfo.localeId)}
        </Typography>
      </Box>
      {
        chart?.result?.length > 0 ?
          <Box
            sx={{
              display: 'flex',
              width: `calc(${chart.chartInfo.width}px / ${chart?.result.length})`,
              height: 'calc(100% - 50px)',
              flexGrow: 1,
              // rotate: '90deg',
            }}
          >
            <ResponsiveLine
              data={info}
              // margin={{ top: 100, right: 50, bottom: 250, left: 100 }}
              margin={{ top: 100, right: 0, bottom: 200, left: 30 }}

              theme={responsiveTheme}
              // legends={responsiveLegends}
              colors={queryHasColors ? (i) => { return i.data.color } : { scheme: 'nivo' }}
              enableArea={chart?.chartInfo?.enableArea ?? false}
              xScale={{ type: 'point' }}
              yScale={{
                  type: 'linear',
                  // min: 'auto',
                  // max: 'auto',
                  stacked: false,
                  reverse: false
              }}
              // yFormat=" >-.2f"
              pointSize={8}
              axisTop={null}
              axisRight={null}
              axisBottom={{
                  tickSize: 5,
                  tickPadding: 5,
                  tickRotation: 0,
                  legend: chart?.chartInfo?.x_axis ? (t(chart?.chartInfo?.x_axis)).toUpperCase() : "",
                  legendOffset: 50,
                  legendPosition: 'middle'
              }}
              axisLeft={{
                tickSize: 5,
                tickPadding: 5,
                tickRotation: 0,
                legend: chart?.chartInfo?.y_axis ? t(chart?.chartInfo?.y_axis).toUpperCase() : "",
                // legendOffset: -40,
                legendPosition: 'middle'
              }}
              useMesh={true}
              enableSlices={chart?.chartInfo?.enableSlices ?? "x"}
            />
          </Box>

          :
          <Box
            sx={{
              display: 'flex',
              width: '100%',
              height: '100%',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Typography
              variant="h3"
              component="div"
              sx={{ flexGrow: 1 }}
              textAlign={'center'}
            >
              {t('no_data_to_show')}
            </Typography>
          </Box>
      }
    </Box>
  );
}