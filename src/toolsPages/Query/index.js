// React
import React, { useEffect, useState } from "react";

// Design
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import TextField from "@mui/material/TextField";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Stack from "@mui/material/Stack";
import SaveIcon from "@mui/icons-material/Save";
import FolderIcon from "@mui/icons-material/Folder";
import InputAdornment from "@mui/material/InputAdornment";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import DeleteIcon from "@mui/icons-material/Delete";
import LightbulbIcon from "@mui/icons-material/Lightbulb";

// Internal
import PageWrapper from "../../structure/PageWrapper";
import API from "../../api";
import ExpectedFormatsDialog from "./expectedFormatsDialog";
import AddQueryDialog from "./addQueryDialog";
import { setNotificationBar } from "../../store/slices/app";

// Third-party
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import JsonView from "react18-json-view";
import "react18-json-view/src/style.css";

const style = {
  mainBox: Object.assign({}, window.app_config.style.box, {
    bgcolor: "background.paper",
    display: "flex",
    flexGrow: 1,
  }),
};

export default function Query({ pageOptions }) {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  // eslint-disable-next-line no-unused-vars
  const [queryData, setQueryData] = useState(null);
  const [selectedQuery, setSelectedQuery] = useState("");
  const [searchMethod, setSearchMethod] = useState("");
  const [openExpectedFormatsDialog, setOpenExpectedFormatsDialog] =
    useState(false);
  const [currentText, setCurrentText] = useState(JSON.stringify({}));
  const [errorInText, setErrorInText] = useState(false);
  const [collectionName, setCollectionName] = useState("");
  const [showAddQueryDialog, setShowAddQueryDialog] = useState(false);
  const [jsonData, setJsonData] = useState({});
  const [loadingRunQuery, setLoadingRunQuery] = useState(false);

  const getData = () => {
    API.get
      .query({})
      .then((res) => {
        setQueryData(res?.result ?? []);
      })
      .finally(() => {});
  };

  const removeQuery = () => {
    if (selectedQuery) {
      API.delete
        .query({ queryName: selectedQuery })
        .then((res) => {
          setSearchMethod("");
          setSelectedQuery("");
          setCollectionName("");
          setCurrentText({});
          dispatch(
            setNotificationBar({
              message: t("query_removed_successfully"),
              type: "success",
              show: true,
            })
          );
          getData();
        })
        .catch((err) => {
          dispatch(
            setNotificationBar({
              message: t("failed_to_remove_query"),
              type: "error",
              show: true,
            })
          );
        })
        .finally(() => {});
    }
  };

  useEffect(() => {
    getData();
  }, []);

  const saveQuery = () => {
    if (selectedQuery && searchMethod && collectionName && currentText) {
      let data = {
        queryName: selectedQuery,
        searchMethod: searchMethod,
        collectionName: collectionName,
        query: JSON.stringify(currentText),
      };
      API.put
        .saveQuery({ ...data })
        .then((res) => {
          dispatch(
            setNotificationBar({
              message: t("query_saved_successfully"),
              type: "success",
              show: true,
            })
          );
        })
        .catch((err) => {
          dispatch(
            setNotificationBar({
              message: t("failed_to_save_query"),
              type: "error",
              show: true,
            })
          );
        })
        .finally(() => {});
    }
  };

  const runQuery = () => {
    setJsonData({});
    if (selectedQuery) {
      setLoadingRunQuery(true);
      API.post
        .runQuery({
          searchMethod: searchMethod,
          collectionName: collectionName,
          query: currentText,
        })
        .then((res) => {
          let result = res?.result ?? [];
          setJsonData(result);

          dispatch(
            setNotificationBar({
              message: t("query_run_successfully"),
              type: "success",
              show: true,
            })
          );
        })
        .catch((err) => {
          dispatch(
            setNotificationBar({
              message: t("failed_to_run_query"),
              type: "error",
              show: true,
            })
          );
        })
        .finally(() => {
          setLoadingRunQuery(false);
        });
    }
  };

  const handleSearchMethodChange = (event) => {
    setSearchMethod(event.target.value);
  };

  useEffect(() => {
    if (selectedQuery) {
      let searchMethod = queryData[selectedQuery]?.search_method ?? "";
      let collectioName = queryData[selectedQuery]?.collection_name ?? "";
      let method = {};
      if (Object.keys(queryData[selectedQuery]).includes("restrictionsSet")) {
        method = {
          ...(queryData[selectedQuery]?.restrictionsSet ?? {}),
        };
      } else if (searchMethod === "aggregate") {
        method = {
          pipeline: queryData[selectedQuery]?.pipeline ?? [],
        };
      } else {
        method = {
          ...(queryData[selectedQuery]?.restrictionsSet ?? {}),
        };
      }
      setCollectionName(collectioName);
      setSearchMethod(searchMethod);
      setCurrentText(JSON.stringify(method, undefined, 4));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedQuery]);

  useEffect(() => {
    if (!showAddQueryDialog) {
      getData();
    }
    // eslint-disable-next-line no-unused-vars
  }, [showAddQueryDialog]);

  useEffect(() => {
    if (currentText) {
      try {
        JSON.parse(currentText);
        setErrorInText(false);
      } catch (e) {
        setErrorInText(true);
      }
    }
  }, [currentText]);

  return (
    <PageWrapper>
      {({ width, height }) => (
        <Box width={width} height={height} sx={style.mainBox}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              width: "250px",
              height: "100%",
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                width: "100%",
                height: "30px",
                overflow: "hidden",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Typography textTransform={"uppercase"}>
                {t("queries")}
              </Typography>
            </Box>
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                width: "100%",
                height: "calc(100% - 30px - 60px)",
                overflowX: "hidden",
                overflowY: "auto",
              }}
            >
              {/* {JSON.stringify(Object.keys(queryData ?? {}))} */}
              <List
                sx={{
                  width: "100%",
                }}
              >
                {Object.keys(queryData ?? {}).map((queryName, index) => {
                  return (
                    <ListItemButton
                      key={index}
                      onClick={() => setSelectedQuery(queryName)}
                      selected={selectedQuery === queryName}
                    >
                      {queryName}
                    </ListItemButton>
                  );
                })}
                <ListItemButton onClick={() => setShowAddQueryDialog(true)}>
                  <ListItemText secondary={t("add_query")} />
                </ListItemButton>
              </List>
            </Box>
          </Box>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              flexGrow: 1,
              height: "100%",
              width: "calc(50% - 250px)",
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexGrow: 1,
                height: "85px",
                width: "100%",
                marginTop: 1,
              }}
            >
              <TextField
                id="collection-name"
                label={t("collection_name")}
                variant="outlined"
                value={collectionName}
                onChange={(event) => setCollectionName(event.target.value)}
                sx={{
                  width: 150,
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <FolderIcon />
                    </InputAdornment>
                  ),
                }}
              />
              <FormControl
                sx={{
                  width: 200,
                }}
              >
                <InputLabel id="search-method-input-label">
                  {t("search_method")}
                </InputLabel>
                <Select
                  labelId="search-method-select"
                  id="demo-simple-select"
                  value={searchMethod}
                  label={t("search_method")}
                  onChange={handleSearchMethodChange}
                >
                  {pageOptions?.options?.searchMethods?.map((method, index) => {
                    return (
                      <MenuItem key={index} value={method.method}>
                        {method.method}
                      </MenuItem>
                    );
                  })}
                </Select>
              </FormControl>
            </Box>
            <Box
              sx={{
                display: "flex",
                flexGrow: 1,
                height: "calc(100% - 85px - 60px)",
                width: "100%",
                marginBottom: 2,
              }}
            >
              <TextField
                id="outlined-basic"
                variant="outlined"
                value={currentText}
                onChange={(e) => setCurrentText(e.target.value)}
                multiline
                rows={42}
                fullWidth
                error={errorInText}
                helperText={errorInText && t("parms_must_be_json")}
                sx={{
                  backgroundColor: "black",
                }}
              />
            </Box>
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                width: "100%",
                height: "60px",
              }}
            >
              <Box
                sx={{
                  flexGrow: 1,
                }}
              >
                <Stack direction="row" justifyContent="flex-start" gap={1}>
                  <Button
                    onClick={removeQuery}
                    variant="contained"
                    startIcon={<DeleteIcon />}
                    color="error"
                    disabled={!queryData?.[selectedQuery]?.feConfig?.deletable}
                  >
                    {t("delete")}
                  </Button>
                  <Button
                    onClick={saveQuery}
                    variant="contained"
                    startIcon={<SaveIcon />}
                    disabled={
                      !queryData?.[selectedQuery]?.feConfig?.editable ??
                      errorInText
                    }
                  >
                    {t("save")}
                  </Button>
                </Stack>
              </Box>
              <Box
                sx={{
                  flexGrow: 1,
                }}
              >
                <Stack direction="row" justifyContent="flex-end" gap={1}>
                  <Button
                    onClick={() => setOpenExpectedFormatsDialog(true)}
                    variant="contained"
                    startIcon={<LightbulbIcon />}
                    color="info"
                    sx={{
                      marginLeft: 1,
                    }}
                  >
                    {t("expected_formats")}
                  </Button>
                  <Button
                    onClick={runQuery}
                    variant="contained"
                    startIcon={
                      loadingRunQuery ? (
                        <CircularProgress size={20} />
                      ) : (
                        <PlayArrowIcon />
                      )
                    }
                    disabled={
                      errorInText ||
                      collectionName === "" ||
                      searchMethod === "" ||
                      loadingRunQuery
                    }
                    color="success"
                    sx={{
                      marginLeft: 1,
                    }}
                  >
                    {t("run_query")}
                  </Button>
                </Stack>
              </Box>
            </Box>
          </Box>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              flexGrow: 1,
              height: "100%",
              width: "calc(50% - 250px)",
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                width: "100%",
                height: "calc(100%)",
                overflow: "auto",
              }}
            >
              <JsonView src={jsonData} height={"100%"} width={"100%"} />
            </Box>
          </Box>

          <ExpectedFormatsDialog
            open={openExpectedFormatsDialog}
            setOpen={setOpenExpectedFormatsDialog}
            expectedFormats={pageOptions?.options?.expectedValuesFormats ?? []}
          />
          <AddQueryDialog
            open={showAddQueryDialog}
            setOpen={setShowAddQueryDialog}
            pageOptions={pageOptions}
            existingQueries={Object.keys(queryData ?? {})}
          />
        </Box>
      )}
    </PageWrapper>
  );
}
