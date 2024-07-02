/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable react/button-has-type */
import { TableRow, TableCell, IconButton, Box, Avatar, Typography } from '@mui/material';
import Iconify from 'src/components/iconify/Iconify';

export default function UserTableRow({ row, selected, onDeleteRow }: any) {
  const { name, profile_image, email, role, language, phone } = row || {};

  return (
    <>
      <TableRow hover selected={selected} sx={{ height: 92 }}>
        <TableCell>
          {row?.name ? (
            <Box display="flex" flexDirection="row" gap={1} alignItems="center">
              <Avatar src={row?.profile_image} />
              <Typography variant="body2">{row?.name}</Typography>
            </Box>
          ) : (
            '-'
          )}
        </TableCell>

        <TableCell align="left">{row?.email || '-'}</TableCell>
        <TableCell align="left" sx={{ textTransform: 'capitalize' }}>
          {row?.role || '-'}
        </TableCell>
        <TableCell align="left" sx={{ textTransform: 'capitalize' }}>
          {row?.language || '-'}
        </TableCell>
        <TableCell align="left" sx={{ textTransform: 'capitalize' }}>
          {row?.phone || '-'}
        </TableCell>
        <TableCell align="left">
          <IconButton
            onClick={() => {
              onDeleteRow();
            }}
            sx={{ color: 'error.main' }}
          >
            <Iconify icon="eva:trash-2-outline" />
          </IconButton>
        </TableCell>
      </TableRow>

      {/* <ConfirmDialog
        open={openConfirm}
        onClose={handleCloseConfirm}
        title="Delete"
        content="Are you sure want to delete?"
        action={
          <Button variant="contained" color="error" onClick={onDeleteRow}>
            Delete
          </Button>
        }
      /> */}
    </>
  );
}
