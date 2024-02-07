import { useEffect, useMemo, useState } from "react";

// Design
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

// Third party
import { ResponsivePie } from "@nivo/pie";
import { colors, dateFormat } from "sdk-fe-eyeflow";
import { useTranslation } from "react-i18next";
import { cloneDeep } from "lodash";
import { ResponsiveBar } from "@nivo/bar";

// Internal
import ImageCard from "../../ImageCard";

const ITEM_WIDTH = 400;
const ITEM_HEIGHT = 300;

const styleSx = {
  mainBoxSx: Object.assign({}, window.app_config.style.box, {
    bgcolor: "background.paper",
    display: "flex",
    justifyContent: "space-evenly",
    // paddingRight: 1,
    position: "relative",
  }),
  graphBoxSx: {
    display: "flex",
    flexDirection: "column",
    height: "100%",
    width: `${ITEM_WIDTH - 80}px`,
    justifyContent: "center",
    padding: 1,
    gap: 1,
    alignItems: "center",
    // justifyContent: 'space-evenly',
    // width: '100%',
    // flexGrow: 1,
    // border: '1px solid #000000',
    // position: 'relative',
  },
  pieBoxSx: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    height: ITEM_HEIGHT,
    width: ITEM_WIDTH,
  },
  imageBoxSx: {
    display: "block",
    margin: "auto",
    width: "100%",
    height: "100%",
  },
  cardBoxSx: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    // maxHeight: `min(${ITEM_HEIGHT}px, 50%)`,
    // maxWidth: `min(${ITEM_WIDTH}px, 50%)`,
    width: "100%",
    height: "50%",
    // border: "8px solid #000000",
  },
};

export default function MetalStampingBox({ data, config }) {
  const { t } = useTranslation();

  const showLastAnomaly = config?.lastAnomaly?.show;

  let { selectedCamera } = useMemo(() => {
    let selectedCamera = config?.selected_camera ?? null;
    if (!selectedCamera) {
      console.error("No camera selected in config");
    }
    return { selectedCamera };
  }, [config]);

  let { imageData, anomalyImageData, anomaliesBarData } = useMemo(() => {
    let partsOk = data?.batch_data?.parts_ok ?? 0;
    let partsNg = data?.batch_data?.parts_ng ?? 0;
    let partsPieData = [];
    if (partsOk || partsNg) {
      partsPieData = [
        {
          id: "OK",
          label: "OK",
          value: partsOk,
          color: colors.eyeflow.green.light,
        },
        {
          id: "NG",
          label: "NG",
          value: partsNg,
          color: colors.eyeflow.red.dark,
        },
      ];
    }

    let imageData = null;
    let lastInspectionData = data?.batch_data?.last_inspection;
    if (selectedCamera && lastInspectionData) {
      imageData = cloneDeep(
        lastInspectionData?.images?.find(
          (image) => image.camera_name === selectedCamera
        )
      );
      if (!imageData) {
        console.error(`No image data for camera ${selectedCamera}`);
      } else if (!imageData.image_url) {
        imageData = null;
        console.error(`No image url for camera ${selectedCamera}`);
      } else {
        imageData.event_time = dateFormat(lastInspectionData?.event_time);
        // imageData.event_time = lastInspectionData?.event_time;
      }
    }
    let anomalyImageData = cloneDeep(
      data?.batch_data?.last_anomaly?.images?.[0]
    );
    if (data?.batch_data?.last_anomaly?.event_time) {
      anomalyImageData.event_time = dateFormat(
        data.batch_data.last_anomaly.event_time
      );
    }
    // TODO select anomaly image

    let totalBoxes = data?.info?.total_packs ?? 0;
    let currentBox = 0;
    let totalParts = 0;
    if (data?.batch_data) {
      let sumParts =
        (!isNaN(data?.batch_data?.parts_ok) ? data?.batch_data?.parts_ok : 0) +
        (!isNaN(data?.batch_data?.parts_ng) ? data?.batch_data?.parts_ng : 0);
      currentBox = Math.ceil(sumParts / data?.info?.parts_per_pack);
      if (
        !(
          typeof currentBox === "number" &&
          isFinite(currentBox) &&
          currentBox >= 0
        )
      ) {
        currentBox = 0;
      }

      totalParts = sumParts;
    }

    return {
      imageData,
      anomalyImageData,
      partsPieData,
      totalBoxes,
      currentBox,
      totalParts,
    };
  }, [selectedCamera, data]);

  return (
    <Box
      width={config?.width ?? "calc(100%)"}
      height={config?.height ?? "100%"}
      // height={'941px'}
      sx={styleSx.mainBoxSx}
    >
      <Box
        id="image-box"
        sx={styleSx.imageBoxSx}
        // height={`${height}px`}
      >
        {imageData && (
          <Box sx={styleSx.cardBoxSx}>
            <ImageCard
              imageData={imageData}
              eventTime={imageData.event_time}
              title={t("last_inspection")}
            />
          </Box>
        )}

        {showLastAnomaly &&
        anomaliesBarData &&
        anomaliesBarData.length > 0 &&
        anomalyImageData ? (
          <Box sx={styleSx.cardBoxSx}>
            <ImageCard
              imageData={anomalyImageData}
              title={t("last_anomaly")}
              eventTime={anomalyImageData.event_time}
              color="error.main"
            />
          </Box>
        ) : (
          <Box sx={styleSx.cardBoxSx}>
            <Typography
              sx={{
                color: "success.main",
                fontSize: "4rem",
                textAlign: "center",
              }}
            >
              {t("no_anomalies")}
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
}
