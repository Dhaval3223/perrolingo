import { Helmet } from 'react-helmet-async';
// @mui
import { Container, Table, TableBody, TableContainer, Typography } from '@mui/material';
// components
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'src/store/store';
import { useEffect } from 'react';
import { getAllFlashCardForAdmin } from 'src/store/slices/flashCardSlice';
import Scrollbar from 'src/components/scrollbar/Scrollbar';
import {
  TableEmptyRows,
  TableHeadCustom,
  TableNoData,
  emptyRows,
  useTable,
} from 'src/components/table';
import { useSettingsContext } from '../components/settings';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'term', label: 'Term', align: 'left' },
  { id: 'definition', label: 'Definition', align: 'left' },
  { id: 'phrase', label: 'Phrase', align: 'left' },
  { id: 'language', label: 'Language', align: 'left' },
  { id: 'language', label: 'Language', align: 'left' },
  { id: 'audio', label: 'Audio', align: 'left' },
];

export default function PageOne() {
  const {
    dense,
    page,
    order,
    orderBy,
    rowsPerPage,
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

  const { flashCardData, flashCardDataloading } = useSelector((state: RootState) => state.flashCard);

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getAllFlashCardForAdmin(1, 10));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  return (
    <>
      <Helmet>
        <title> Page One | Minimal UI</title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : 'xl'}>
        <Typography variant="h3" component="h1" paragraph>
          Page One
        </Typography>

        {/* <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
          <TableSelectedAction
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
          />

          <Scrollbar>
            <Table size="medium" sx={{ minWidth: 800 }}>
              <TableHeadCustom
                order={order}
                orderBy={orderBy}
                headLabel={TABLE_HEAD}
                rowCount={data?.length}
                numSelected={selected.length}
                onSort={onSort}
                onSelectAllRows={(checked) =>
                  onSelectAllRows(
                    checked,
                    tableData.map((row) => row.id)
                  )
                }
              />

              <TableBody>
                {data.map((row) => (
                  <UserTableRow
                    key={row.id}
                    row={row}
                    selected={selected.includes(row.id)}
                    onSelectRow={() => onSelectRow(row.id)}
                    onDeleteRow={() => handleDeleteRow(row.id)}
                    onEditRow={() => handleEditRow(row.name)}
                  />
                ))}

                <TableEmptyRows
                  height={72}
                  emptyRows={emptyRows(page, rowsPerPage, tableData.length)}
                />

                <TableNoData isNotFound={isNotFound} />
              </TableBody>
            </Table>
          </Scrollbar>
        </TableContainer> */}
      </Container>
    </>
  );
}
