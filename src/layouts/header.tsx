/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @next/next/no-img-element */
/* eslint-disable prefer-const */
'use client';

import { NotificationApi } from '@/api';
import { Alert } from '@/components/common/alert';
import {
  IconLaptop,
  IconMoon,
  IconSearch,
  IconSun,
  IconUser,
} from '@/components/icons';
import IconBellBing from '@/components/icons/icon/icon-bell-bing';
import IconCalendar from '@/components/icons/icon/icon-calendar';
import IconCaretDown from '@/components/icons/icon/icon-caret-down';
import IconHelpCircle from '@/components/icons/icon/icon-help-circle';
import IconInfoCircle from '@/components/icons/icon/icon-info-circle';
import IconLogout from '@/components/icons/icon/icon-logout';
import IconSettings from '@/components/icons/icon/icon-settings';
import IconXCircle from '@/components/icons/icon/icon-x-circle';
import { getTranslation } from '@/i18n';
import { IRootState } from '@/stores';
import {
  toggleRTL,
  toggleSidebar,
  toggleTheme,
} from '@/stores/themeConfigSlice';
import { selectedMenu } from '@/utilities/constants/menus';
import { Can } from '@/utilities/permissions/getAccess';
import { Bars2Icon } from '@heroicons/react/24/outline';
import { useMutation, useQuery } from '@tanstack/react-query';
import { formatDistanceToNow } from 'date-fns';
import { signOut, useSession } from 'next-auth/react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Dropdown from './dropdown';
import Setting from './setting';

const Header = () => {
  const pathname = usePathname();
  const dispatch = useDispatch();
  const router = useRouter();
  const session = useSession();

  const [search, setSearch] = useState(false);

  const [searchQuery, setSearchQuery] = useState('');
  const [filteredMenus, setFilteredMenus] = useState<any[]>([]);

  const { t, i18n } = getTranslation();

  useEffect(() => {
    const selector = document.querySelector(
      'ul.horizontal-menu a[href="' + window.location.pathname + '"]',
    );
    if (selector) {
      const all: any = document.querySelectorAll(
        'ul.horizontal-menu .nav-link.active',
      );
      for (let i = 0; i < all.length; i++) {
        all[0]?.classList.remove('active');
      }

      let allLinks = document.querySelectorAll('ul.horizontal-menu a.active');
      for (let i = 0; i < allLinks.length; i++) {
        const element = allLinks[i];
        element?.classList.remove('active');
      }
      selector?.classList.add('active');

      const ul: any = selector.closest('ul.sub-menu');
      if (ul) {
        let ele: any = ul.closest('li.menu').querySelectorAll('.nav-link');
        if (ele) {
          ele = ele[0];
          setTimeout(() => {
            ele?.classList.add('active');
          });
        }
      }
    }
  }, [pathname]);

  const isRtl =
    useSelector((state: IRootState) => state.themeConfig.rtlClass) === 'rtl';

  const themeConfig = useSelector((state: IRootState) => state.themeConfig);

  const setLocale = (flag: string) => {
    if (flag.toLowerCase() === 'ae') {
      dispatch(toggleRTL('rtl'));
    } else {
      dispatch(toggleRTL('ltr'));
    }
    router.refresh();
  };

  const { mutateAsync: remove } = useMutation({
    mutationFn: NotificationApi.delete,
  });

  const removeNotification = async (id: string) => {
    try {
      await remove(id);
      Alert.success('Notification deleted successfully');
      refetch();
    } catch (error) {
      Alert.toast({ message: 'Something went wrong' });
    }
  };

  const filteredSections = selectedMenu(session?.data?.user?.role)
    .map((section) => {
      if (!section?.menus?.length) return null;
      if (section?.permission) {
        if (!Can.read(section.permission, session?.data?.user)) {
          return null;
        }
      }
      const filteredMenus = section?.menus.map((menu) => {
        const hasPermission =
          menu.permission && session?.data?.user
            ? Can.read(menu.permission, session?.data?.user)
            : true;

        const filteredSubMenu = menu.subMenu?.map((sub) => ({
          ...sub,
          hasPermission:
            sub.permission && session?.data?.user
              ? Can.read(sub.permission, session?.data?.user)
              : true,
        }));

        return {
          ...menu,
          subMenu: filteredSubMenu,
          hasPermission,
        };
      });

      return { ...section, menus: filteredMenus };
    })
    .filter(Boolean);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredMenus([]);
      return;
    }

    const output: any = [];

    filteredSections?.forEach((section) => {
      section?.menus?.forEach((menu) => {
        if (menu?.title?.toLowerCase().includes(searchQuery.toLowerCase())) {
          output.push(menu);
        }
        menu?.subMenu?.forEach((sub) => {
          if (sub?.title?.toLowerCase().includes(searchQuery.toLowerCase())) {
            output.push(sub);
          }
        });
      });
    });

    setFilteredMenus(output);
  }, [searchQuery]);

  const [showSetting, setShowSetting] = useState(false);

  const {
    data: notificationsData,
    isRefetching,
    refetch,
  } = useQuery({
    queryKey: ['notifications'],
    queryFn: NotificationApi.unread,
    refetchInterval: 60000,
  });

  const { mutateAsync: read } = useMutation({
    mutationFn: NotificationApi.read,
  });

  const readNotification = async (id: string, link: string) => {
    try {
      router.push(link);
      await read(id);
      refetch();
    } catch (error) {}
  };

  const notifications = useMemo(() => {
    if (!notificationsData) return [];

    return notificationsData.map((notification: any) => {
      let link = '#';
      if (notification?.data) {
        try {
          const parsedData = JSON.parse(notification.data);
          if (parsedData?.link) {
            link = parsedData.link;
          }
        } catch (error) {
          console.error('Error parsing notification data:', error);
        }
      }

      return {
        id: notification.id,
        link,
        profile: notification.From?.image || '/assets/images/user.webp',
        message: `<strong class="text-sm mr-1">${notification.From?.name}</strong> ${notification.title}`,
        time: formatDistanceToNow(new Date(notification.createdAt), {
          addSuffix: true,
        }),
      };
    });
  }, [notificationsData]);

  return (
    <header
      className={`z-40 ${themeConfig.semidark && themeConfig.menu === 'horizontal' ? 'dark' : ''}`}
    >
      <Setting showSetting={showSetting} setShowSetting={setShowSetting} />
      <div className="shadow-sm">
        <div className="relative flex w-full items-center bg-white px-5 py-1.5 dark:bg-black">
          <div className="horizontal-logo flex items-center justify-between ltr:mr-2 rtl:ml-2 lg:hidden">
            <Link href="/" className="main-logo flex shrink-0 items-center">
              <img
                className="inline w-8 ltr:-ml-1 rtl:-mr-1"
                src="/logo.png"
                alt="logo"
              />
              <span className="hidden align-middle text-2xl  font-bold  transition-all duration-300 ltr:ml-1.5 rtl:mr-1.5 dark:text-white-light md:inline">
                DJATI
              </span>
            </Link>
            <button
              type="button"
              className="collapse-icon flex flex-none rounded-full bg-white-light/40 p-2 hover:bg-white-light/90 hover:text-primary ltr:ml-2 rtl:mr-2 dark:bg-dark/40 dark:text-[#d0d2d6] dark:hover:bg-dark/60 dark:hover:text-primary lg:hidden"
              onClick={() => dispatch(toggleSidebar())}
            >
              <Bars2Icon className="h-5 w-5" />
            </button>
          </div>

          <div className="hidden ltr:mr-2 rtl:ml-2 sm:block">
            <ul className="flex items-center space-x-2 rtl:space-x-reverse dark:text-[#d0d2d6]">
              <li>
                <Link
                  href="/calendar"
                  className="block rounded-full bg-white-light/40 p-2 hover:bg-white-light/90 hover:text-primary dark:bg-dark/40 dark:hover:bg-dark/60"
                >
                  <IconCalendar />
                </Link>
              </li>
              <li>
                <Link
                  href="/user-request"
                  className="block rounded-full bg-white-light/40 p-2 hover:bg-white-light/90 hover:text-primary dark:bg-dark/40 dark:hover:bg-dark/60"
                >
                  <IconHelpCircle />
                </Link>
              </li>
            </ul>
          </div>

          <div className="flex items-center space-x-1.5 ltr:ml-auto rtl:mr-auto rtl:space-x-reverse dark:text-[#d0d2d6] sm:flex-1 ltr:sm:ml-0 sm:rtl:mr-0 lg:space-x-2">
            <div className="sm:ltr:mr-auto sm:rtl:ml-auto">
              <form
                className={`${search && '!block'} absolute inset-x-0 top-1/2 z-10 mx-4 hidden -translate-y-1/2 sm:relative sm:top-0 sm:mx-0 sm:block sm:translate-y-0`}
                onSubmit={() => setSearch(false)}
              >
                <div className="relative">
                  <input
                    type="text"
                    className="peer form-input bg-gray-100 placeholder:tracking-widest ltr:pl-9 ltr:pr-9 rtl:pl-9 rtl:pr-9 sm:bg-transparent ltr:sm:pr-4 rtl:sm:pl-4"
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <button
                    type="button"
                    className="absolute inset-0 h-9 w-9 appearance-none peer-focus:text-primary ltr:right-auto rtl:left-auto"
                  >
                    <IconSearch className="mx-auto" />
                  </button>
                  <button
                    type="button"
                    className="absolute top-1/2 block -translate-y-1/2 hover:opacity-80 ltr:right-2 rtl:left-2 sm:hidden"
                    onClick={() => {
                      setSearch(false);
                      setSearchQuery('');
                    }}
                  >
                    <IconXCircle />
                  </button>
                </div>
              </form>
              <button
                type="button"
                onClick={() => {
                  setSearch(!search);
                  setSearchQuery('');
                }}
                className="search_btn rounded-full bg-white-light/40 p-2 hover:bg-white-light/90 dark:bg-dark/40 dark:hover:bg-dark/60 sm:hidden"
              >
                <IconSearch className="mx-auto h-4.5 w-4.5 dark:text-[#d0d2d6]" />
              </button>
            </div>

            {searchQuery && (
              <div className="absolute flex left-3 top-full mt-2 z-50">
                <ul className="w-[350px] divide-y bg-white dark:bg-black !py-0 text-dark dark:divide-white/10 dark:text-white-dark sm:w-[350px] ">
                  <li onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center justify-between px-4 py-2 ">
                      <h4 className="">{t('LOOKING_FOR')}</h4>
                      {searchQuery}
                    </div>
                  </li>
                  {filteredMenus && filteredMenus?.length > 0 ? (
                    filteredMenus.map((menu: any, index: number) => (
                      <li key={index} className="dark:text-white-light/90">
                        <Link href={`${menu?.path}`}>
                          <div className="group flex items-center px-4 py-2 gap-4">
                            <div className="h-5 w-5">{menu.icon}</div>
                            <h4 className="font-semibold">{t(menu?.title)}</h4>
                          </div>
                        </Link>
                      </li>
                    ))
                  ) : (
                    <li className="w-full flex justify-center items-center min-h-[200px]">
                      <button
                        type="button"
                        className="!grid min-h-[200px] place-content-center text-lg hover:!bg-transparent"
                      >
                        <div className="mx-auto mb-4 rounded-full ring-4 ring-primary/30">
                          <IconInfoCircle
                            fill={true}
                            className="h-10 w-10 text-primary"
                          />
                        </div>
                        {t('NOT_FOUND')}.
                      </button>
                    </li>
                  )}
                </ul>
              </div>
            )}

            <div>
              {themeConfig.theme === 'light' ? (
                <button
                  className={`${
                    themeConfig.theme === 'light' &&
                    'flex items-center rounded-full bg-white-light/40 p-2 hover:bg-white-light/90 hover:text-primary dark:bg-dark/40 dark:hover:bg-dark/60'
                  }`}
                  onClick={() => dispatch(toggleTheme('dark'))}
                >
                  <IconSun />
                </button>
              ) : (
                ''
              )}
              {themeConfig.theme === 'dark' && (
                <button
                  className={`${
                    themeConfig.theme === 'dark' &&
                    'flex items-center rounded-full bg-white-light/40 p-2 hover:bg-white-light/90 hover:text-primary dark:bg-dark/40 dark:hover:bg-dark/60'
                  }`}
                  onClick={() => dispatch(toggleTheme('system'))}
                >
                  <IconMoon />
                </button>
              )}
              {themeConfig.theme === 'system' && (
                <button
                  className={`${
                    themeConfig.theme === 'system' &&
                    'flex items-center rounded-full bg-white-light/40 p-2 hover:bg-white-light/90 hover:text-primary dark:bg-dark/40 dark:hover:bg-dark/60'
                  }`}
                  onClick={() => dispatch(toggleTheme('light'))}
                >
                  <IconLaptop />
                </button>
              )}
            </div>

            <div className="dropdown shrink-0">
              <Dropdown
                offset={[0, 8]}
                placement={`${isRtl ? 'bottom-start' : 'bottom-end'}`}
                btnClassName="block p-2 rounded-full bg-white-light/40 dark:bg-dark/40 hover:text-primary hover:bg-white-light/90 dark:hover:bg-dark/60"
                button={
                  i18n.language && (
                    <img
                      className="h-5 w-5 rounded-full object-cover"
                      src={`/assets/images/flags/${i18n.language.toUpperCase()}.svg`}
                      alt="flag"
                    />
                  )
                }
              >
                <ul className="grid w-[280px] grid-cols-2 gap-2 !px-2 font-semibold text-dark dark:text-white-dark dark:text-white-light/90">
                  {themeConfig.languageList.map((item: any) => {
                    return (
                      <li key={item.code}>
                        <button
                          type="button"
                          className={`flex w-full hover:text-primary ${i18n.language === item.code ? 'bg-primary/10 text-primary' : ''}`}
                          onClick={() => {
                            i18n.changeLanguage(item.code);
                            setLocale(item.code);
                          }}
                        >
                          <img
                            src={`/assets/images/flags/${item.code.toUpperCase()}.svg`}
                            alt="flag"
                            className="h-5 w-5 rounded-full object-cover"
                          />
                          <span className="ltr:ml-3 rtl:mr-3">{item.name}</span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </Dropdown>
            </div>

            <div className="dropdown shrink-0">
              <button
                type="button"
                onClick={() => setShowSetting(!showSetting)}
                className="flex items-center rounded-full bg-white-light/40 p-2 hover:bg-white-light/90 hover:text-primary dark:bg-dark/40 dark:hover:bg-dark/60"
              >
                <IconSettings className="h-5 w-5 animate-[spin_3s_linear_infinite]" />
              </button>
            </div>
            <div className="dropdown shrink-0">
              <Dropdown
                offset={[0, 8]}
                placement={`${isRtl ? 'bottom-start' : 'bottom-end'}`}
                btnClassName="relative block p-2 rounded-full bg-white-light/40 dark:bg-dark/40 hover:text-primary hover:bg-white-light/90 dark:hover:bg-dark/60"
                button={
                  <span>
                    <IconBellBing />
                    {notifications?.length > 0 && (
                      <span className="absolute top-0 flex h-3 w-3 ltr:right-0 rtl:left-0">
                        <span className="absolute -top-[3px] inline-flex h-full w-full animate-ping rounded-full bg-success/50 opacity-75 ltr:-left-[3px] rtl:-right-[3px]"></span>
                        <span className="relative inline-flex h-[6px] w-[6px] rounded-full bg-success"></span>
                      </span>
                    )}
                  </span>
                }
              >
                <ul className="w-[300px] divide-y !py-0 text-dark dark:divide-white/10 dark:text-white-dark sm:w-[350px]">
                  <li onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center justify-between px-4 py-2 font-semibold">
                      <h4 className="text-lg">Notification</h4>
                      {notifications?.length ? (
                        <span className="badge bg-primary/80">
                          {notifications?.length} New
                        </span>
                      ) : (
                        ''
                      )}
                    </div>
                  </li>
                  {notifications.length > 0 ? (
                    <>
                      {notifications.map((notification: any) => {
                        return (
                          <li
                            key={notification.id}
                            className="dark:text-white-light/90"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <div className="group flex items-center px-4 py-2">
                              <div className="grid place-content-center rounded">
                                <div className="relative h-12 w-12">
                                  <img
                                    className="h-12 w-12 rounded-full object-cover"
                                    alt="profile"
                                    src={`${notification.profile}`}
                                  />
                                  <span className="absolute bottom-0 right-[6px] block h-2 w-2 rounded-full bg-success"></span>
                                </div>
                              </div>
                              <div className="flex flex-auto pl-2">
                                <div
                                  className="pr-1 cursor-pointer hover:text-primary dark:hover:text-primary-light"
                                  onClick={() =>
                                    readNotification(
                                      notification.id,
                                      notification.link,
                                    )
                                  }
                                >
                                  <h6
                                    dangerouslySetInnerHTML={{
                                      __html: notification.message,
                                    }}
                                  ></h6>
                                  <span className="block text-xs font-normal dark:text-gray-500">
                                    {notification.time}
                                  </span>
                                </div>
                                <button
                                  type="button"
                                  className="text-neutral-300 opacity-0 hover:text-danger group-hover:opacity-100 ltr:ml-auto rtl:mr-auto"
                                  onClick={() =>
                                    removeNotification(notification.id)
                                  }
                                >
                                  <IconXCircle />
                                </button>
                              </div>
                            </div>
                          </li>
                        );
                      })}
                      <li onClick={() => router.push('/notification')}>
                        <div className="p-4">
                          <button className="btn btn-primary btn-small block w-full">
                            {t('READ_ALL_NOTIFICATIONS')}
                          </button>
                        </div>
                      </li>
                    </>
                  ) : (
                    <li onClick={(e) => e.stopPropagation()}>
                      <button
                        type="button"
                        className="!grid min-h-[200px] place-content-center text-lg hover:!bg-transparent"
                      >
                        <div className="mx-auto mb-4 rounded-full ring-4 ring-primary/30">
                          <IconInfoCircle
                            fill={true}
                            className="h-10 w-10 text-primary"
                          />
                        </div>
                        {t('NO_DATA_AVAILABLE')}
                      </button>
                    </li>
                  )}
                </ul>
              </Dropdown>
            </div>
            <div className="dropdown flex shrink-0">
              <Dropdown
                offset={[0, 8]}
                placement={`${isRtl ? 'bottom-start' : 'bottom-end'}`}
                btnClassName="relative group block"
                button={
                  <img
                    className="h-9 w-9 rounded-full object-cover saturate-50 group-hover:saturate-100"
                    src={
                      session?.data?.user?.image &&
                      session?.data?.user?.image !== 'null'
                        ? session?.data?.user?.image
                        : '/assets/images/user.webp'
                    }
                    alt="userProfile"
                  />
                }
              >
                <ul className="w-[230px] !py-0 font-semibold text-dark dark:text-white-dark dark:text-white-light/90">
                  <li>
                    <div className="flex items-center px-4 py-4">
                      <img
                        className="h-10 w-10 rounded-md object-cover"
                        src={
                          session?.data?.user?.image &&
                          session?.data?.user?.image !== 'null'
                            ? session?.data?.user?.image
                            : '/assets/images/user.webp'
                        }
                        alt="userProfile"
                      />
                      <div className="truncate ltr:pl-4 rtl:pr-4">
                        <h4 className="text-base">
                          {session?.data?.user?.name}
                        </h4>
                        <button
                          type="button"
                          className="text-black/60 hover:text-primary dark:text-dark-light/60 dark:hover:text-white"
                        >
                          {session?.data?.user?.email}
                        </button>
                      </div>
                    </div>
                  </li>
                  <li>
                    <Link href="/profile" className="dark:hover:text-white">
                      <IconUser className="h-4.5 w-4.5 shrink-0 ltr:mr-2 rtl:ml-2" />
                      {t('PROFILE')}
                    </Link>
                  </li>

                  <li>
                    <Link href="/setting" className="dark:hover:text-white">
                      <IconSettings className="h-4.5 w-4.5 shrink-0 ltr:mr-2 rtl:ml-2" />
                      {t('SETTINGS')}
                    </Link>
                  </li>

                  <li className="border-t border-white-light dark:border-white-light/10">
                    <button
                      onClick={() => signOut()}
                      type="button"
                      className="!py-3 text-danger"
                    >
                      <IconLogout className="h-4.5 w-4.5 shrink-0 rotate-90 ltr:mr-2 rtl:ml-2" />
                      {t('LOG_OUT')}
                    </button>
                  </li>
                </ul>
              </Dropdown>
            </div>
          </div>
        </div>

        <ul className="horizontal-menu hidden border-t border-[#ebedf2] bg-white px-6 py-1.5 font-semibold text-black rtl:space-x-reverse dark:border-[#191e3a] dark:bg-black dark:text-white-dark lg:space-x-1.5 xl:space-x-8">
          {filteredSections.map((section, index: number) => (
            <li className="menu nav-item relative" key={index}>
              <button type="button" className="nav-link">
                <div className="flex items-center">
                  {section?.icon}
                  <span className="px-1 uppercase">
                    {t(section?.section as any)}
                  </span>
                </div>
                <div className="right_arrow">
                  <IconCaretDown />
                </div>
              </button>
              <ul className="sub-menu">
                {section?.menus?.map((menu, i: number) => (
                  <li key={i} className={menu?.subMenu ? 'relative' : ''}>
                    {menu?.subMenu ? (
                      <>
                        <button type="button">
                          {t(menu.title)}
                          <div className="-rotate-90 ltr:ml-auto rtl:mr-auto rtl:rotate-90">
                            <IconCaretDown />
                          </div>
                        </button>

                        <ul className="absolute top-0 z-[10] hidden min-w-[180px] rounded bg-white p-0 py-2 text-dark shadow ltr:left-[95%] rtl:right-[95%] dark:bg-[#1b2e4b] dark:text-white-dark">
                          {menu.subMenu?.map((subMenu, n: number) => (
                            <li key={n}>
                              <Link href={subMenu.path}>
                                {t(subMenu.title)}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </>
                    ) : (
                      <Link href={menu?.path as string}>{t(menu?.title)}</Link>
                    )}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </div>
    </header>
  );
};

export default Header;
