// ----------------------------------------------------------------------

function path(root: string, sublink: string) {
  return `${root}${sublink}`;
}

const ROOTS_DASHBOARD = '/dashboard';

// ----------------------------------------------------------------------

export const PATH_AUTH = {
  login: '/login',
};

export const PATH_DASHBOARD = {
  root: ROOTS_DASHBOARD,
  flashCard: path(ROOTS_DASHBOARD, '/flash-card'),
  course: path(ROOTS_DASHBOARD, '/course'),
  users: path(ROOTS_DASHBOARD, '/users'),
  proposedCard: path(ROOTS_DASHBOARD, '/proposed-card'),
};
