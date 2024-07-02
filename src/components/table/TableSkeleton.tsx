// @mui
import { TableRow, TableCell, Skeleton, Stack, TableRowProps } from '@mui/material';

// ----------------------------------------------------------------------

export default function TableSkeleton({ count, ...other }: { count: number } & TableRowProps) {
  return (
    <TableRow {...other}>
      <TableCell colSpan={12}>
        <Stack spacing={3} direction="row" alignItems="center">
          {Array.from({ length: count }).map((_, index) => (
            <Skeleton variant="text" width="100%" height={20} />
          ))}
        </Stack>
      </TableCell>
    </TableRow>
  );
}
