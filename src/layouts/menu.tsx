import {
  BriefcaseIcon,
  BugAntIcon,
  ChartPieIcon,
  HomeIcon,
  LockClosedIcon,
  ShieldCheckIcon,
  Squares2X2Icon,
  TruckIcon,
  UserIcon,
} from '@heroicons/react/24/outline';
import { BsTools } from 'react-icons/bs';
import { FaUmbrellaBeach } from 'react-icons/fa';
import { PiDatabaseLight, PiPresentationChartBold } from 'react-icons/pi';
import { TbBuildingBank } from 'react-icons/tb';

interface MenuItem {
  title: string;
  path: string;
  icon: JSX.Element;
  permission: string;
  subMenu?: MenuItem[];
}

interface MenuSection {
  section: string;
  icon: JSX.Element;
  menus: MenuItem[];
}

export const MenuItem: MenuSection[] = [
  {
    section: 'DASHBOARD',
    icon: <Squares2X2Icon className="shrink-0" />,
    menus: [
      {
        title: 'Production',
        path: '/',
        icon: <HomeIcon className="shrink-0 group-hover:!text-primary" />,
        permission: 'DASHBOARD_MENU',
      },
      {
        title: 'Asset',
        path: '/assets',
        icon: <BriefcaseIcon className="shrink-0 group-hover:!text-primary" />,
        permission: 'DASHBOARD_MENU',
      },
      {
        title: 'Plant',
        path: '/plant',
        icon: <BsTools className="shrink-0 group-hover:!text-primary" />,
        permission: 'DASHBOARD_MENU',
      },
    ],
  },
  {
    section: 'HR',
    icon: <UserIcon className="shrink-0" />,
    menus: [
      {
        title: 'HR Dashboard',
        path: '/hr/dashboard',
        icon: <ChartPieIcon className="shrink-0 group-hover:!text-primary" />,
        permission: 'HR_DASHBOARD',
      },
      {
        title: 'Employee',
        path: '/hr/employee',
        icon: <UserIcon className="shrink-0 group-hover:!text-primary" />,
        permission: 'HR_EMPLOYEE',
      },
      {
        title: 'Leave',
        path: '/hr/leave',
        icon: (
          <FaUmbrellaBeach className="shrink-0 group-hover:!text-primary" />
        ),
        permission: 'HR_EMPLOYEE_LEAVE',
      },
      {
        title: 'Attendance',
        path: '/hr/attendance',
        icon: (
          <PiPresentationChartBold className="shrink-0 group-hover:!text-primary" />
        ),
        permission: 'HR_EMPLOYEE_ATTENDANCE',
      },
    ],
  },
  {
    section: 'MASTER DATA',
    icon: <PiDatabaseLight className="shrink-0" />,
    menus: [
      {
        title: 'Company',
        path: '/master-data/company',
        icon: <TbBuildingBank className="shrink-0 group-hover:!text-primary" />,
        permission: 'MASTER_DATA_COMPANY',
      },
      {
        title: 'Project',
        path: '/master-data/project',
        icon: <BriefcaseIcon className="shrink-0 group-hover:!text-primary" />,
        permission: 'MASTER_DATA_PROJECT',
      },
      {
        title: 'Asset',
        path: '/master-data/assets/asset',
        icon: <TruckIcon className="shrink-0 group-hover:!text-primary" />,
        permission: 'MASTER_DATA_ASSET',
        subMenu: [
          {
            title: 'Asset',
            path: '/master-data/assets/asset',
            icon: <TruckIcon className="shrink-0 group-hover:!text-primary" />,
            permission: 'MASTER_DATA_ASSET',
          },
          {
            title: 'Model',
            path: '/master-data/assets/asset-model',
            icon: <BugAntIcon className="shrink-0 group-hover:!text-primary" />,
            permission: 'MASTER_DATA_ASSET',
          },
        ],
      },
      {
        title: 'User',
        path: '/master-data/user',
        icon: <UserIcon className="shrink-0 group-hover:!text-primary" />,
        permission: 'MASTER_DATA_USER',
      },
    ],
  },
  {
    section: 'ADMIN',
    icon: <UserIcon className="shrink-0" />,
    menus: [
      {
        title: 'Admin Company',
        path: '/admin/companies/company',
        icon: <HomeIcon className="shrink-0 group-hover:!text-primary" />,
        permission: 'COMPANY_MENU',
        subMenu: [
          {
            title: 'Admin Company',
            path: '/admin/companies/company',
            icon: <HomeIcon className="shrink-0 group-hover:!text-primary" />,
            permission: 'COMPANY_MENU',
          },
          {
            title: 'Admin Project',
            path: '/admin/companies/project',
            icon: (
              <ChartPieIcon className="shrink-0 group-hover:!text-primary" />
            ),
            permission: 'COMPANY_PROJECT_MENU',
          },
          {
            title: 'Admin Department',
            path: '/admin/companies/department',
            icon: (
              <ShieldCheckIcon className="shrink-0 group-hover:!text-primary" />
            ),
            permission: 'COMPANY_DEPARTMENT_MENU',
          },
        ],
      },
      {
        title: 'Admin Asset',
        path: '/admin/assets/asset',
        icon: <TruckIcon className="shrink-0 group-hover:!text-primary" />,
        permission: 'COMPANY_ASSET_MENU',
        subMenu: [
          {
            title: 'Admin Asset',
            path: '/admin/assets/asset',
            icon: <TruckIcon className="shrink-0 group-hover:!text-primary" />,
            permission: 'COMPANY_ASSET_MENU',
          },
          {
            title: 'Admin Asset Model',
            path: '/admin/assets/asset-model',
            icon: <BugAntIcon className="shrink-0 group-hover:!text-primary" />,
            permission: 'COMPANY_ASSET_MENU',
          },
          {
            title: 'Admin Asset Classification',
            path: '/admin/assets/asset-classification',
            icon: <BugAntIcon className="shrink-0 group-hover:!text-primary" />,
            permission: 'COMPANY_ASSET_MENU',
          },
        ],
      },
      {
        title: 'User',
        path: '/admin/users/user',
        icon: <UserIcon className="shrink-0" />,
        permission: 'ADMIN_MENU',
      },
      {
        title: 'Role',
        path: '/admin/users/role',
        icon: <LockClosedIcon className="shrink-0" />,
        permission: 'ADMIN_MENU',
      },
    ],
  },
];
