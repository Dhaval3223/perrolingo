import { Helmet } from 'react-helmet-async';
// @mui
import {
  Box,
  Button,
  Container,
  Table,
  TableBody,
  TableContainer,
  TablePagination,
  Typography,
} from '@mui/material';
// components
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'src/store/store';
import { useEffect, useState } from 'react';
import { deleteFlashCardForAdmin, getAllFlashCardForAdmin } from 'src/store/slices/flashCardSlice';
import Scrollbar from 'src/components/scrollbar/Scrollbar';
import {
  TableEmptyRows,
  TableHeadCustom,
  TableNoData,
  emptyRows,
  useTable,
} from 'src/components/table';
import FlashCardTableRow from 'src/sections/flashcard/FlashcardTableRow';
import CreateFlashCardModel from 'src/sections/flashcard/CreateFlashCardModel';
import { useSettingsContext } from '../components/settings';
import { useSnackbar } from '../components/snackbar';
// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'term', label: 'Term', align: 'left' },
  { id: 'definition', label: 'Definition', align: 'left' },
  { id: 'phrase', label: 'Phrase', align: 'left' },
  { id: 'language', label: 'Language', align: 'left' },
  { id: 'image', label: 'Image', align: 'left' },
  { id: 'audio', label: 'Audio', align: 'left' },
  { id: 'action', label: 'Action', align: 'left' },
];

export default function FlashCard() {
  const { enqueueSnackbar } = useSnackbar();
  const [open, setOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState({});
  const [id, setId] = useState(-1);
  const {
    dense,
    page,
    order,
    orderBy,
    rowsPerPage,
    setRowsPerPage,
    setPage,
    //
    selected,
    setSelected,
    onSelectRow,
    onSelectAllRows,
    //
    onSort,
    onChangeDense,
    onChangePage,
    onChangeRowsPerPage,
  } = useTable();

  const { themeStretch } = useSettingsContext();

  const { flashCardData, flashCardDataloading } = useSelector(
    (state: RootState) => state.flashCard
  );

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getAllFlashCardForAdmin(page + 1, rowsPerPage));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const isNotFound = flashCardData?.rows?.length === 0;

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setId(-1);
    setSelectedRow({});
    setOpen(false);
  };

  const onEditRow = (rowId: number) => {
    setId(rowId);
    handleClickOpen();
  };
  const onDeleteRow = (rowId: number) => {
    dispatch(deleteFlashCardForAdmin(rowId));
    enqueueSnackbar('Flashcard deleted successfully');
    console.log(id);
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
    dispatch(getAllFlashCardForAdmin(newPage + 1, rowsPerPage));
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    dispatch(getAllFlashCardForAdmin(page + 1, parseInt(event.target.value, 10)));
  };

  return (
    <>
      <Helmet>
        <title> Flash card | Perrolingo Admin Panel</title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : 'xl'}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h3" component="h1" paragraph>
            Flash card
          </Typography>
          <Button
            variant="outlined"
            onClick={() => {
              handleClickOpen();
            }}
          >
            Add Flash Card
          </Button>
        </Box>

        <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
          {/* <TableSelectedAction
            dense={dense}
            numSelected={selected.length}
            rowCount={tableData.length}
            onSelectAllRows={(checked) =>
              onSelectAllRows(
                checked,
                tableData.map((row) => row.id)
              )
            }
            action={
              <Tooltip title="Delete">
                <IconButton color="primary" onClick={handleOpenConfirm}>
                  <Iconify icon="eva:trash-2-outline" />
                </IconButton>
              </Tooltip>
            }
          /> */}

          <Scrollbar
            sx={{
              maxHeight: 550,
            }}
          >
            <Table size="medium" sx={{ minWidth: 800 }}>
              <TableHeadCustom
                order={order}
                orderBy={orderBy}
                headLabel={TABLE_HEAD}
                rowCount={flashCardData?.rows?.length}
                numSelected={selected.length}
                onSort={onSort}
                // onSelectAllRows={(checked) =>
                //   onSelectAllRows(
                //     checked,
                //     tableData.map((row) => row.id)
                //   )
                // }
              />

              <TableBody>
                {flashCardData?.rows?.map((row: any) => (
                  <>
                    <FlashCardTableRow
                      key={row.id}
                      row={row}
                      selected={selected?.includes(row.id)}
                      onSelectRow={() => onSelectRow(row.id)}
                      onEditRow={() => {
                        setSelectedRow(row);
                        onEditRow(row?.id);
                      }}
                      onDeleteRow={() => {
                        onDeleteRow(row?.id);
                      }}
                    />
                    {id === row?.id && open && (
                      <CreateFlashCardModel open={open} onClose={() => handleClose()} />
                    )}
                  </>
                ))}

                <TableEmptyRows
                  height={72}
                  emptyRows={emptyRows(page, rowsPerPage, flashCardData?.rows?.length)}
                />

                <TableNoData isNotFound={isNotFound} />
              </TableBody>
            </Table>
          </Scrollbar>
        </TableContainer>
        <TablePagination
          component="div"
          count={flashCardData?.count}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[5, 10, 25]}
        />
      </Container>
      {open && (
        <CreateFlashCardModel
          open={open}
          editId={id}
          selectedRow={selectedRow}
          onClose={() => handleClose()}
        />
      )}
    </>
  );
}
