// React
import React, { useEffect, useState } from "react";

// Design
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

// Internal

// Third-party
import { useTranslation } from "react-i18next";
import { ResponsiveBar } from '@nivo/bar'



export default function Bar({ chart }) {

  const { t } = useTranslation();
  const [info, setInfo] = useState([]);
  const [keys, setKeys] = useState([]);
  const [queryHasColors, setQueryHasColors] = useState(false);

  useEffect(() => {
    if (!chart?.result?.length) return
    else if (chart.result.length === 1 && Object.keys(chart.result[0]).length > 0) {
      let newKeys = Object.keys(chart.result[0]);
      let data = chart.result[0];
      let newInfo = [];
      Object.keys(data).forEach((item) => {
        let _item = {
          id: item,
          [item]: data[item],
        }
        if (Object.keys(chart?.chartInfo?.colors_results).length > 0 && chart?.chartInfo?.colors_results?.[item]) {
          _item.color = chart.chartInfo.colors_results[item]
        }

        newInfo.push(_item)
      })
      setInfo(newInfo);
      setKeys(newKeys);
      setQueryHasColors(Object.keys(chart?.chartInfo?.colors_results ?? {}).length > 0 ? true : false);
    }
    else if (chart.result.length > 1) {
      let newKeys = chart.result.map((item) => item._id);
      let data = chart.result;
      let newInfo = [];
      data.forEach((item) => {
        let _item = {
          id: item._id,
          [item._id]: item.value,
        }
        if (chart?.chartInfo?.colors_results?.length > 0 && chart?.chartInfo?.colors_results?.[item._id]) {
          _item.color = chart.chartInfo.colors_results[item._id]
        }
        newInfo.push(_item);
      })

      setInfo(newInfo);
      setKeys(newKeys);
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
        chart?.result.length > 0 ?
          <Box
            sx={{
              display: 'flex',
              width: '100%',
              height: 'calc(100% - 50px)',
              flexGrow: 1,
            }}
          >
            <ResponsiveBar
              data={info}
              keys={keys}
              indexBy="id"
              margin={{ top: 100, right: 130, bottom: 100, left: 60 }}
              padding={0.3}
              valueScale={{ type: 'linear' }}
              indexScale={{ type: 'band', round: true }}
              colors={queryHasColors ? (i) => { console.log(i); return i.data.color } : { scheme: 'nivo' }}
              // colors={i => {
              //   // console.log({ i })
              //   return i.data.color
              // }}
              axisTop={null}
              axisRight={null}
              labelSkipWidth={12}
              labelSkipHeight={12}
              labelTextColor={{
                from: 'color',
                modifiers: [
                  [
                    'darker',
                    1.6
                  ]
                ]
              }}
              role="application"
              ariaLabel={t(chart.chartInfo.localeId)}
              barAriaLabel={function (e) { return e.id + ": " + e[e.id] }}
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