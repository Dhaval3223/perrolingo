/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable react/button-has-type */
import { useState } from 'react';
// @mui
import {
  Stack,
  Avatar,
  Button,
  Checkbox,
  TableRow,
  MenuItem,
  TableCell,
  IconButton,
  Typography,
  Tooltip,
} from '@mui/material';
import useAudio from 'src/hooks/useAudio';
import useSound from 'use-sound';
import Iconify from 'src/components/iconify/Iconify';
import MenuPopover from 'src/components/menu-popover/MenuPopover';

// @types
// import { IUserAccountGeneral } from '../../../../@types/user';
// components
// import Label from '../../../../components/label';
// import Iconify from '../../../../components/iconify';
// import MenuPopover from '../../../../components/menu-popover';
// import ConfirmDialog from '../../../../components/confirm-dialog';

export default function FlashCardTableRow({
  row,
  selected,
  onEditRow,
  onSelectRow,
  onDeleteRow,
}: any) {
  const { term, definition, phrase, language, audio, image } = row || {};
  const [isPlaying, setIsPlaying] = useState(false);
  const [playSound, { stop }] = useSound(audio);
  const [openConfirm, setOpenConfirm] = useState(false);
  const [openPopover, setOpenPopover] = useState<HTMLElement | null>(null);
  console.log('row', row);

  const handlePlay = () => {
    setIsPlaying(true);
    playSound();
  };

  const stopSound = () => {
    setIsPlaying(false);
    stop();
  };

  const handleOpenConfirm = () => {
    setOpenConfirm(true);
  };

  const handleCloseConfirm = () => {
    setOpenConfirm(false);
  };

  const handleOpenPopover = (event: React.MouseEvent<HTMLElement>) => {
    setOpenPopover(event.currentTarget);
  };

  const handleClosePopover = () => {
    setOpenPopover(null);
  };

  return (
    <>
      <TableRow hover selected={selected} sx={{ height: 92 }}>
        <TableCell>{term}</TableCell>

        <TableCell align="left">{definition}</TableCell>

        <TableCell>{phrase}</TableCell>

        <TableCell align="left" sx={{ textTransform: 'capitalize' }}>
          {language}
        </TableCell>

        <TableCell align="left">
          {image ? (
            <Tooltip title={<img src={image} alt="" />} sx={{ p: 0 }}>
              <img src={image} alt="" width={60} height={60} />
            </Tooltip>
          ) : (
            'Not found'
          )}
        </TableCell>

        <TableCell align="left">
          {audio ? (
            <Button variant="soft" onClick={() => (isPlaying ? stopSound() : handlePlay())}>
              {isPlaying ? 'Pause' : 'Play'}
            </Button>
          ) : (
            'Not found'
          )}
        </TableCell>

        {/* <TableCell align="left">
          <Button variant="outlined" onClick={() => {}}>
            Edit
          </Button>
          <Button sx={{ ml: 1 }} variant="outlined" onClick={() => {}}>
            Delete
          </Button>
        </TableCell>
 */}
        <TableCell align="left">
          <IconButton color={openPopover ? 'inherit' : 'default'} onClick={handleOpenPopover}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </TableCell>
      </TableRow>

      <MenuPopover
        open={openPopover}
        onClose={handleClosePopover}
        arrow="right-top"
        sx={{ width: 140 }}
      >
        <MenuItem
          onClick={() => {
            onEditRow();
            handleClosePopover();
          }}
        >
          <Iconify icon="eva:edit-fill" />
          Edit
        </MenuItem>
        <MenuItem
          onClick={() => {
            onDeleteRow();
            // handleOpenConfirm();
            // handleClosePopover();
          }}
          sx={{ color: 'error.main' }}
        >
          <Iconify icon="eva:trash-2-outline" />
          Delete
        </MenuItem>
      </MenuPopover>

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
