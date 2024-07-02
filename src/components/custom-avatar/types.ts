// @mui
import { BadgeProps, AvatarProps } from '@mui/material';

// ----------------------------------------------------------------------

export interface CustomAvatarProps extends AvatarProps {
  color?: 'default' | 'primary' | 'secondary' | 'info' | 'success' | 'warning' | 'error';
  name?: string;
  BadgeProps?: BadgeProps;
}
