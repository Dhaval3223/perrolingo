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
import {
  TableEmptyRows,
  TableHeadCustom,
  TableNoData,
  TableSkeleton,
  emptyRows,
  useTable,
} from 'src/components/table';
import {
  clearCreateCourseData,
  clearDeleteCourseData,
  clearUpdateCourseData,
  deleteCourse,
  getAllCourseWithFlashcard,
} from 'src/store/slices/courseSlice';
import CourseTableRow from 'src/sections/course/CourseTableRow';
import CourseModel from 'src/sections/course/CourseModel';
import { useSnackbar } from '../components/snackbar';
import { useSettingsContext } from '../components/settings';
// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'name', label: 'Name', align: 'left' },
  { id: 'level', label: 'Level', align: 'left' },
  { id: 'language', label: 'Language', align: 'left' },
  { id: 'image', label: 'Image', align: 'left' },
  { id: 'action', label: 'Action', align: 'left' },
];

export default function Course() {
  const { enqueueSnackbar } = useSnackbar();
  const [open, setOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState({});
  const [id, setId] = useState(-1);
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

  const {
    courseWithFlashcardData,
    courseWithFlashcardDataLoading,
    createCourseError,
    createCourseSuccess,
    deleteCourseSuccess,
    deleteCourseError,
    updateCourseError,
    updateCourseSuccess,
  } = useSelector((state: RootState) => state.course);

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getAllCourseWithFlashcard(page + 1, rowsPerPage));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (deleteCourseSuccess) {
      enqueueSnackbar('Course deleted successfully', {
        variant: 'success',
      });
      dispatch(clearDeleteCourseData());
    }
    if (deleteCourseError || updateCourseError || createCourseError) {
      enqueueSnackbar('Something went wrong', {
        variant: 'error',
      });
      if (createCourseError) dispatch(clearCreateCourseData());
      if (deleteCourseError) dispatch(clearDeleteCourseData());
      if (updateCourseError) dispatch(clearUpdateCourseData());
    }
    if (createCourseSuccess) {
      enqueueSnackbar('Course created successfully', {
        variant: 'success',
      });
      dispatch(clearCreateCourseData());
    }
    if (updateCourseSuccess) {
      enqueueSnackbar('Course updated successfully', {
        variant: 'success',
      });
      dispatch(clearUpdateCourseData());
    }
    setPage(0);
    handleClose();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    createCourseSuccess,
    createCourseError,
    deleteCourseError,
    deleteCourseSuccess,
    updateCourseError,
    updateCourseSuccess,
  ]);

  const isNotFound = courseWithFlashcardData?.rows?.length === 0;

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
    dispatch(deleteCourse(rowId));
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
    dispatch(getAllCourseWithFlashcard(newPage + 1, rowsPerPage));
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    dispatch(getAllCourseWithFlashcard(page + 1, parseInt(event.target.value, 10)));
  };

  return (
    <>
      <Helmet>
        <title> Course | Perrolingo Admin Panel</title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : 'xl'}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h3" component="h1" paragraph>
            Course
          </Typography>
          <Button
            variant="outlined"
            onClick={() => {
              handleClickOpen();
            }}
          >
            Add Course
          </Button>
        </Box>

        <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
          <Table size="medium" sx={{ minWidth: 800 }}>
            <TableHeadCustom
              order={order}
              orderBy={orderBy}
              headLabel={TABLE_HEAD}
              rowCount={courseWithFlashcardData?.rows?.length}
              numSelected={selected.length}
              onSort={onSort}
            />

            <TableBody>
              {courseWithFlashcardDataLoading
                ? [...Array(rowsPerPage)]
                    ?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    ?.map((item, index) => <TableSkeleton count={TABLE_HEAD?.length} />)
                : courseWithFlashcardData?.rows?.map((row: any) => (
                    <>
                      <CourseTableRow
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
                        <CourseModel open={open} onClose={() => handleClose()} />
                      )}
                    </>
                  ))}

              <TableEmptyRows
                height={72}
                emptyRows={emptyRows(page, rowsPerPage, courseWithFlashcardData?.rows?.length)}
              />

              {courseWithFlashcardDataLoading === false && <TableNoData isNotFound={isNotFound} />}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          component="div"
          count={courseWithFlashcardData?.count}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[5, 10, 25]}
        />
      </Container>
      {open && (
        <CourseModel
          open={open}
          editId={id}
          selectedRow={selectedRow}
          onClose={() => handleClose()}
        />
      )}
    </>
  );
}
