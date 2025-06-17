/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @next/next/no-img-element */
'use client';

import { IconCaretDown, IconCaretsDown } from '@/components/icons';
import { IRootState } from '@/stores';
import { toggleSidebar } from '@/stores/themeConfigSlice';
import { Can } from '@/utilities/permissions/getAccess';

import { useSession } from 'next-auth/react';

import { getTranslation } from '@/i18n';
import { selectedMenu } from '@/utilities/constants/menus';
import { MinusIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import AnimateHeight from 'react-animate-height';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { useDispatch, useSelector } from 'react-redux';

const Sidebar = () => {
  const dispatch = useDispatch();
  const session = useSession();
  const pathname = usePathname();
  const [currentMenu, setCurrentMenu] = useState<string>('');
  const themeConfig = useSelector((state: IRootState) => state.themeConfig);

  const { t } = getTranslation();
  const semidark = useSelector(
    (state: IRootState) => state.themeConfig.semidark,
  );

  useEffect(() => {
    const selector = document.querySelector(
      '.sidebar ul a[href="' + window.location.pathname + '"]',
    );

    if (selector) {
      selector.classList.add('active');
      const ul: any = selector.closest('ul.sub-menu');
      if (ul) {
        let ele: any =
          ul.closest('li.menu').querySelectorAll('.nav-link') || [];
        if (ele.length) {
          ele = ele[0];
          setTimeout(() => {
            ele.click();
          });
        }
      }
    }
  }, []);

  useEffect(() => {
    setActiveRoute();
    if (window.innerWidth < 1024 && themeConfig.sidebar) {
      dispatch(toggleSidebar());
    }
  }, [pathname]);

  const setActiveRoute = () => {
    // eslint-disable-next-line prefer-const
    let allLinks = document.querySelectorAll('.sidebar ul a.active');
    for (let i = 0; i < allLinks.length; i++) {
      const element = allLinks[i];
      element?.classList.remove('active');
    }
    const selector = document.querySelector(
      '.sidebar ul a[href="' + window.location.pathname + '"]',
    );
    selector?.classList.add('active');
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

  const toggleMenu = (value: string) => {
    setCurrentMenu((oldValue) => {
      return oldValue === value ? '' : value;
    });
  };

  return (
    <div className={semidark ? 'dark' : ''}>
      <nav
        className={`sidebar fixed bottom-0 top-0 z-50 h-full min-h-screen w-[260px] shadow-[5px_0_25px_0_rgba(94,92,154,0.1)] transition-all duration-300 ${semidark ? 'text-white-dark' : ''}`}
      >
        <div className="h-full bg-white dark:bg-black">
          <div className="flex items-center justify-between px-4 py-3">
            <Link href="/" className="main-logo flex shrink-0 items-center">
              <img
                className="ml-[5px] w-8 flex-none"
                src="/logo.png"
                alt="logo"
              />
              <span className="align-middle text-2xl font-semibold ltr:ml-1.5 rtl:mr-1.5 dark:text-white-light lg:inline">
                DJATI
              </span>
            </Link>

            <button
              type="button"
              className="collapse-icon flex h-8 w-8 items-center rounded-full transition duration-300 hover:bg-gray-500/10 rtl:rotate-180 dark:text-white-light dark:hover:bg-dark-light/10"
              onClick={() => dispatch(toggleSidebar())}
            >
              <IconCaretsDown className="m-auto rotate-90" />
            </button>
          </div>
          <PerfectScrollbar className="relative h-[calc(100vh-80px)]">
            <ul className="relative space-y-0.5 p-4 py-0 font-semibold">
              {filteredSections.map((section, index: number) => (
                <React.Fragment key={index}>
                  {section?.section && section?.section !== 'HOME' && (
                    <h2 className="-mx-4 mb-2 mt-4 flex items-center bg-white-light/30 px-7 py-3 font-extrabold uppercase dark:bg-dark dark:bg-opacity-[0.08]">
                      <MinusIcon className="hidden h-5 w-4 flex-none" />
                      <span>{t(section.section)}</span>
                    </h2>
                  )}

                  {section?.section === 'HOME' && <div className="mt-8"></div>}

                  {section?.menus?.map((menu, i: number) => (
                    <li className="nav-item" key={i}>
                      <ul>
                        {menu?.subMenu ? (
                          <li className="menu nav-item">
                            <button
                              type="button"
                              className={`${currentMenu === menu.title ? 'active' : ''} nav-link group w-full`}
                              onClick={() => toggleMenu(menu.title)}
                            >
                              <div className="flex items-center">
                                {menu.icon}
                                <span className="text-black ltr:pl-3 rtl:pr-3 dark:text-[#506690] dark:group-hover:text-white-dark">
                                  {t(menu.title)}
                                </span>
                              </div>

                              <div
                                className={
                                  currentMenu !== menu.title
                                    ? '-rotate-90 rtl:rotate-90'
                                    : ''
                                }
                              >
                                <IconCaretDown />
                              </div>
                            </button>

                            <AnimateHeight
                              duration={300}
                              height={currentMenu === menu.title ? 'auto' : 0}
                            >
                              <ul className="sub-menu text-gray-500">
                                {menu.subMenu?.map((subMenu, n: number) => (
                                  <li key={n}>
                                    <Link href={subMenu.path} className="ps-2">
                                      {t(subMenu.title)}
                                    </Link>
                                  </li>
                                ))}
                              </ul>
                            </AnimateHeight>
                          </li>
                        ) : (
                          <li className="nav-item">
                            <Link href={menu?.path as string} className="group">
                              <div className="flex items-center">
                                {menu?.icon}
                                <span className="text-black ltr:pl-3 rtl:pr-3 dark:text-[#506690] dark:group-hover:text-white-dark">
                                  {t(menu?.title)}
                                </span>
                              </div>
                            </Link>
                          </li>
                        )}
                      </ul>
                    </li>
                  ))}
                </React.Fragment>
              ))}
            </ul>
          </PerfectScrollbar>
        </div>
      </nav>
    </div>
  );
};

export default Sidebar;
