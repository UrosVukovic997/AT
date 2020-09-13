import { NbMenuItem } from '@nebular/theme';

export const MENU_ITEMS: NbMenuItem[] = [
  {
    title: 'Home',
    icon: 'home-outline',
    link: '/agent/dashboard',
    home: true,
  },
  {
    title: 'ADS',
    group: true,
  },
  {
    title: 'My ads',
    icon: 'pricetags',
    link: '/agent/dashboard/my-ads',
    home: false,
  },
  {
    title: 'New agent',
    icon: 'plus-circle',
    link: '/agent/dashboard/new',
    home: false,
  },
  {
    title: 'Other ads',
    icon: 'file-text',
    link: '/agent/dashboard/other-ads',
    home: false,
  },
  {
    title: 'Reservation',
    group: true,
  },
  {
    title: 'Waiting Reservations',
    icon: 'pricetags',
    link: '/agent/dashboard/reservations',
    home: false,
  },
  {
    title: 'Reserve',
    icon: 'plus-circle',
    link: '/agent/dashboard/reserve',
    home: false,
  },
  {
    title: 'Vehicles',
    group: true,
  },
  {
    title: 'Add vehicle',
    icon: 'car',
    link: '/agent/dashboard/new-vehicle',
    home: false,
  },
  {
    title: 'My vehicle',
    icon: 'car',
    link: '/agent/dashboard/vehicles',
    home: false,
  },
  {
    title: 'Discounts',
    icon: 'thermometer-plus',
    link: '/agent/dashboard/discounts',
    home: false,
  },

];
