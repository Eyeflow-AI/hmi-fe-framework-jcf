// React
import React, { useEffect, useState } from "react";

// Design
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableFooter from '@mui/material/TableFooter';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import LastPageIcon from '@mui/icons-material/LastPage';
import TableHead from '@mui/material/TableHead';
import Checkbox, { checkboxClasses } from "@mui/material/Checkbox";


// Internal
import API from "../../../../api";

// Third-party
import { useTranslation } from "react-i18next";
import { CircularProgress } from "@mui/material";

function TablePaginationActions(props) {
  const { t } = useTranslation();
  const theme = useTheme();
  const { count, page, rowsPerPage, onPageChange } = props;

  const handleFirstPageButtonClick = (event) => {
    onPageChange(event, 0);
  };

  const handleBackButtonClick = (event) => {
    onPageChange(event, page - 1);
  };

  const handleNextButtonClick = (event) => {
    onPageChange(event, page + 1);
  };

  const handleLastPageButtonClick = (event) => {
    onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
  };

  return (
    <Box sx={{ flexShrink: 0, ml: 2.5 }}>
      <IconButton
        onClick={handleFirstPageButtonClick}
        disabled={page === 0}
        aria-label={t("first_page")}
      >
        {theme.direction === 'rtl' ? <LastPageIcon /> : <FirstPageIcon />}
      </IconButton>
      <IconButton
        onClick={handleBackButtonClick}
        disabled={page === 0}
        aria-label={t("previous_page")}
      >
        {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
      </IconButton>
      <IconButton
        onClick={handleNextButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label={t("next_page")}
      >
        {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
      </IconButton>
      <IconButton
        onClick={handleLastPageButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label={t("last_page")}
      >
        {theme.direction === 'rtl' ? <FirstPageIcon /> : <LastPageIcon />}
      </IconButton>
    </Box>
  );
}

export default function FromToDatasetsTable({
  packageData,
  fromToData,
  setFromToData,
}) {

  const { t } = useTranslation();

  const [page, setPage] = useState(0);
  const rowsPerPage = 11;
  const columns = [
    'dataset_name',
    'apply',
  ];
  const [rows, setRows] = useState([]);
  const [loadingActiveDatasetId, setLoadingActiveDatasetId] = useState('');

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleActiveDataset = ({ datasetId, status }) => {
    setLoadingActiveDatasetId(datasetId);
    API.put.activeDataset({
      datasetId, status
    }).then((res) => {
      setFromToData(res);
    }).catch(console.log)
      .finally(() => {
        setLoadingActiveDatasetId('');
      })
  }

  useEffect(() => {
    if (packageData) {
      let rows = [];
      packageData.forEach((dataset) => {
        rows.push({
          datasetName: dataset.name,
          datasetId: dataset.id,
        });
      });
      setRows(rows)
    }
  }, [packageData]);

  return (
    <TableContainer component={Paper}>
      <Table
        sx={{ minWidth: 500 }}
        aria-label="fromTo Table"
      >
        <TableHead>
          <TableRow>
            {columns.map((column) => (
              <TableCell
                key={`${column}-title`}
              >
                {t(column)}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {(rowsPerPage > 0
            ? rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            : rows
          ).map((row) => (
            <TableRow key={`${row.datasetName}-${row.classLabel}`}>
              <TableCell component="th" scope="row">
                {row.datasetName}
              </TableCell>
              <TableCell
                style={{
                  width: 160,
                }}
                align="left"
              >
                {
                  loadingActiveDatasetId === row.datasetId ?
                    <CircularProgress />
                    :
                    <Checkbox
                      sx={{
                        [`&, &.${checkboxClasses.checked}`]: {
                          color: 'white',
                        },
                      }}
                      onChange={(e) => handleActiveDataset({ datasetId: row.datasetId, status: e.target.checked })}
                      checked={fromToData?.activeDatasets?.includes(row.datasetId)}
                    />
                }
              </TableCell>
            </TableRow>
          ))}

          {emptyRows > 0 && (
            <TableRow style={{ height: 53 * emptyRows }}>
              <TableCell colSpan={6} />
            </TableRow>
          )}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TablePagination
              rowsPerPageOptions={[9]}
              count={rows.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              ActionsComponent={TablePaginationActions}
            />
          </TableRow>
        </TableFooter>
      </Table>
    </TableContainer>
  );
}