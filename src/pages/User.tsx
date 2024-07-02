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
import {
  TableEmptyRows,
  TableHeadCustom,
  TableNoData,
  TableSkeleton,
  emptyRows,
  useTable,
} from 'src/components/table';
import UserTableRow from 'src/sections/user/UserTableRow';
import { clearDeleteUserData, deleteUser, getAllUsers } from 'src/store/slices/userSlice';
import { useSnackbar } from '../components/snackbar';
import { useSettingsContext } from '../components/settings';
// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'name', label: 'Name', align: 'left' },
  { id: 'email', label: 'Email', align: 'left' },
  { id: 'role', label: 'Role', align: 'left' },
  { id: 'language', label: 'Language', align: 'left' },
  { id: 'phone', label: 'Phone', align: 'left' },
  { id: 'action', label: 'Action', align: 'left' },
];

export default function Course() {
  const { enqueueSnackbar } = useSnackbar();
  const {
    page,
    order,
    orderBy,
    rowsPerPage,
    setRowsPerPage,
    setPage,
    selected,
    onSort,
    onSelectRow,
  } = useTable();

  const { themeStretch } = useSettingsContext();

  const { usersData, usersDataloading, deleteFlashCardSuccess, deleteFlashCardError } = useSelector(
    (state: RootState) => state.user
  );

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAllUsers(page + 1, rowsPerPage));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch]);

  useEffect(() => {
    if (deleteFlashCardSuccess)
      enqueueSnackbar('User deleted successfully', { variant: 'success' });
    if (deleteFlashCardError) enqueueSnackbar('Something went wrong!', { variant: 'error' });
    dispatch(clearDeleteUserData());
    setPage(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deleteFlashCardSuccess, deleteFlashCardError]);

  const isNotFound = usersData?.rows?.length === 0;

  const onDeleteRow = (rowId: number) => {
    dispatch(deleteUser(rowId));
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
    dispatch(getAllUsers(newPage + 1, rowsPerPage));
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    dispatch(getAllUsers(page + 1, parseInt(event.target.value, 10)));
  };

  return (
    <>
      <Helmet>
        <title> Users | Perrolingo Admin Panel</title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : 'xl'}>
        <Typography variant="h3" component="h1" paragraph>
          Users
        </Typography>

        <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
          <Table size="medium" sx={{ minWidth: 800 }}>
            <TableHeadCustom
              order={order}
              orderBy={orderBy}
              headLabel={TABLE_HEAD}
              rowCount={usersData?.rows?.length}
              numSelected={selected.length}
              onSort={onSort}
            />

            <TableBody>
              {usersDataloading
                ? [...Array(rowsPerPage)]
                    ?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    ?.map((item, index) => <TableSkeleton count={TABLE_HEAD?.length} />)
                : usersData?.rows?.map((row: any) => (
                    <UserTableRow
                      key={row.id}
                      row={row}
                      selected={selected?.includes(row.id)}
                      onSelectRow={() => onSelectRow(row.id)}
                      onEditRow={() => {}}
                      onDeleteRow={() => {
                        onDeleteRow(row?.id);
                      }}
                    />
                  ))}

              <TableEmptyRows
                height={72}
                emptyRows={emptyRows(page, rowsPerPage, usersData?.rows?.length)}
              />

              {usersDataloading === false && <TableNoData isNotFound={isNotFound} />}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          component="div"
          count={usersData?.count}
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
