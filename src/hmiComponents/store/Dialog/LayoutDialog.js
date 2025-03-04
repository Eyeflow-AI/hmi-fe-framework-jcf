// React
import React from "react";

// Design
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";

// Internal
import LayoutConstructor from "../../layoutConstructor";
import { setNotificationBar } from "../../../store/slices/app";

// Third-party
import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import eventsHandler from "../../../utils/functions/eventsHandler";

export default function LayoutDialog({
  open,
  onClose,
  name,
  data,
  style,
  metadata,
  config,
  components,
  componentsInfo,
  setComponentsInfo,
  submitStartInfoComponentFnName,
  submitStartInfoComponentFnExecutor,
  submitStartInfoComponent,
  stationId,
}) {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  // console.log({
  //   LayoutDialog: componentsInfo,
  //   setComponentsInfo,
  //   submitStartInfoComponentFnName,
  //   submitStartInfoComponentFnExecutor,
  //   submitStartInfoComponent,
  // });

  const handleNotificationBar = (message, severity) => {
    dispatch(
      setNotificationBar({
        show: true,
        type: severity,
        message: message,
      })
    );
  };

  const handleClick = () => {
    eventsHandler({
      componentsInfo,
      item: submitStartInfoComponent,
      fnExecutor: submitStartInfoComponentFnExecutor,
      fnName: submitStartInfoComponentFnName,
      stationId,
      handleNotificationBar,
    });

    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      {/* <DialogTitle id="form-dialog-title">Subscribe</DialogTitle> */}
      <DialogContent>
        <LayoutConstructor
          config={config}
          componentsInfo={componentsInfo}
          setComponentsInfo={setComponentsInfo}
        />
      </DialogContent>
      <DialogActions
        sx={{
          display: "flex",
          justifyContent: "space-between",
          gap: 1,
          padding: 2,
        }}
      >
        <Button
          onClick={onClose}
          variant="outlined"
          sx={{
            color: "white",
            // backgroundColor: "white",
            borderColor: "white",
          }}
        >
          {t("cancel")}
        </Button>
        <Button onClick={handleClick} color="primary" variant="contained">
          {t("submit")}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
