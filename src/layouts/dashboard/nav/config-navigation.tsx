// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
// components
import SvgColor from '../../../components/svg-color';

// ----------------------------------------------------------------------

const icon = (name: string) => (
  <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />
);

const ICONS = {
  user: icon('ic_user'),
  flashCard: icon('ic_menu_item'),
  course: icon('ic_booking'),
  proposed: icon('ic_file'),
};

const navConfig = [
  // GENERAL
  // ----------------------------------------------------------------------
  {
    subheader: 'general',
    items: [
      { title: 'Flash card', path: PATH_DASHBOARD.flashCard, icon: ICONS.flashCard },
      { title: 'Users', path: PATH_DASHBOARD.users, icon: ICONS.user },
      { title: 'Course', path: PATH_DASHBOARD.course, icon: ICONS.course },
      { title: 'Proposed card', path: PATH_DASHBOARD.proposedCard, icon: ICONS.proposed },
    ],
  },
];

export default navConfig;
