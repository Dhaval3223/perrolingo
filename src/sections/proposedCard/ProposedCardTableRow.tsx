/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable react/button-has-type */
// @mui
import { TableRow, TableCell, IconButton, Box, Tooltip } from '@mui/material';
import Iconify from 'src/components/iconify/Iconify';

export default function ProposedCardTableRow({ row, selected, onStatusChange }: any) {
  return (
    <>
      <TableRow hover selected={selected} sx={{ height: 92 }}>
        <TableCell>{row?.word || ''}</TableCell>

        <TableCell align="left">{row?.definition || ''}</TableCell>

        <TableCell>{row?.phrase || '-'}</TableCell>

        <TableCell align="left" sx={{ textTransform: 'capitalize' }}>
          <Box
            sx={{
              height: 24,
              minWidth: 22,
              borderRadius: 1,
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 16,
              fontWeight: 600,
              textTransform: 'capitalize',
              /* eslint-disable no-nested-ternary */
              backgroundColor:
                row?.status === 'Pending'
                  ? 'rgba(255, 171, 0, 0.16)'
                  : row?.status === 'Approved'
                  ? 'rgba(54, 179, 126, 0.16)'
                  : 'rgba(255, 86, 48, 0.16)',
              /* eslint-disable no-nested-ternary */
              color:
                row?.status === 'Pending'
                  ? '#B76E00'
                  : row?.status === 'Approved'
                  ? '#1B806A'
                  : '#B71D18',
              padding: 2,
            }}
          >
            {row?.status}
          </Box>
        </TableCell>

        <TableCell align="left">
          <Box display="flex" flexDirection="row" alignItems="center" gap={1}>
            <Tooltip title="Approved">
              <IconButton
                sx={{
                  backgroundColor: 'green',
                  color: 'white',
                  borderRadius: '50%',
                  padding: '6px',
                  fontSize: '24px',
                  ':hover': {
                    backgroundColor: 'green',
                  },
                }}
                onClick={() => onStatusChange('Approved')}
              >
                <Iconify icon="eva:checkmark-fill" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Denied">
              <IconButton
                sx={{
                  backgroundColor: 'red',
                  color: 'white',
                  borderRadius: '50%',
                  padding: '6px',
                  fontSize: '24px',
                  ':hover': {
                    backgroundColor: 'red',
                  },
                }}
                onClick={() => onStatusChange('Denied')}
              >
                <Iconify icon="eva:close-fill" />
              </IconButton>
            </Tooltip>
          </Box>
        </TableCell>
      </TableRow>
    </>
  );
}
