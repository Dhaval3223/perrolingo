import { Helmet } from 'react-helmet-async';
// @mui
import {
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
import { useEffect } from 'react';
import { getAllFlashCardForAdmin } from 'src/store/slices/flashCardSlice';
import {
  TableEmptyRows,
  TableHeadCustom,
  TableNoData,
  TableSkeleton,
  emptyRows,
  useTable,
} from 'src/components/table';
import ProposedCardTableRow from 'src/sections/proposedCard/ProposedCardTableRow';
import {
  changeProposedCardStatus,
  clearStatusData,
  getAllProposedCard,
} from 'src/store/slices/proposedCardSlice';
import { useSettingsContext } from '../components/settings';
import { useSnackbar } from '../components/snackbar';
// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'word', label: 'Word', align: 'left' },
  { id: 'definition', label: 'Definition', align: 'left' },
  { id: 'phrase', label: 'Phrase', align: 'left' },
  { id: 'status', label: 'Status', align: 'left' },
  { id: 'action', label: 'Action', align: 'left' },
];

export default function ProposedCard() {
  const { enqueueSnackbar } = useSnackbar();
  const {
    page,
    order,
    orderBy,
    rowsPerPage,
    setRowsPerPage,
    setPage,
    selected,
    onSelectRow,
    onSort,
  } = useTable();

  const { themeStretch } = useSettingsContext();

  const {
    proposedCardData,
    proposedCardDataLoading,
    proposedCardStatusError,
    proposedCardStatusSuccess,
  } = useSelector((state: RootState) => state.proposedCard);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getAllProposedCard(page + 1, rowsPerPage));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (proposedCardStatusSuccess)
      enqueueSnackbar('Status changes Suucessfully', { variant: 'success' });
    if (proposedCardStatusError) enqueueSnackbar('Something went wrong', { variant: 'error' });
    dispatch(clearStatusData());
    setPage(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [proposedCardStatusError, proposedCardStatusSuccess]);

  const isNotFound = proposedCardData?.rows?.length === 0;

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
    dispatch(getAllFlashCardForAdmin(newPage + 1, rowsPerPage));
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    dispatch(getAllFlashCardForAdmin(page + 1, parseInt(event.target.value, 10)));
  };

  const onStatusChange = (rowId: number, status: string) => {
    dispatch(
      changeProposedCardStatus(rowId, {
        status,
      })
    );
  };

  return (
    <>
      <Helmet>
        <title> Proposed card | Perrolingo Admin Panel</title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : 'xl'}>
        <Typography variant="h3" component="h1" paragraph>
          Proposed card
        </Typography>

        <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
          <Table size="medium" sx={{ minWidth: 800 }}>
            <TableHeadCustom
              order={order}
              orderBy={orderBy}
              headLabel={TABLE_HEAD}
              rowCount={proposedCardData?.rows?.length}
              numSelected={selected.length}
              onSort={onSort}
            />

            <TableBody>
              {proposedCardDataLoading
                ? [...Array(rowsPerPage)]
                    ?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    ?.map((item, index) => <TableSkeleton count={TABLE_HEAD?.length} />)
                : proposedCardData?.rows?.map((row: any) => (
                    <ProposedCardTableRow
                      key={row.id}
                      row={row}
                      selected={selected?.includes(row.id)}
                      onSelectRow={() => onSelectRow(row.id)}
                      onEditRow={() => {}}
                      onDeleteRow={() => {}}
                      onStatusChange={(status: string) => {
                        onStatusChange(row?.id, status);
                      }}
                    />
                  ))}

              <TableEmptyRows
                height={72}
                emptyRows={emptyRows(page, rowsPerPage, proposedCardData?.count)}
              />
              {proposedCardDataLoading === false && <TableNoData isNotFound={isNotFound} />}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          component="div"
          count={proposedCardData?.count}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[5, 10, 25]}
        />
      </Container>
    </>
  );
}
