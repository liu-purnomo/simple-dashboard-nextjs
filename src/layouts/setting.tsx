'use client';
import IconLaptop from '@/components/icons/icon/icon-laptop';
import IconMoon from '@/components/icons/icon/icon-moon';
import IconSun from '@/components/icons/icon/icon-sun';
import IconX from '@/components/icons/icon/icon-x';
import { getTranslation } from '@/i18n';
import { IRootState } from '@/stores';
import {
  resetToggleSidebar,
  toggleAnimation,
  toggleLayout,
  toggleMenu,
  toggleNavbar,
  toggleSemidark,
  toggleTheme,
} from '@/stores/themeConfigSlice';
import { useDispatch, useSelector } from 'react-redux';

const Setting = ({
  showSetting,
  setShowSetting,
}: {
  showSetting: boolean;
  setShowSetting: (arg: boolean) => void;
}) => {
  const themeConfig = useSelector((state: IRootState) => state.themeConfig);
  const dispatch = useDispatch();
  const { t, i18n } = getTranslation();

  return (
    <div>
      <div
        className={`${(showSetting && '!block') || ''} fixed inset-0 z-[51] hidden bg-[black]/60 px-4 transition-[display]`}
        onClick={() => setShowSetting(false)}
      ></div>

      <nav
        className={`${
          (showSetting && 'ltr:!right-0 rtl:!left-0') || ''
        } fixed bottom-0 top-0 z-[51] w-full max-w-[400px] bg-white p-4 shadow-[5px_0_25px_0_rgba(94,92,154,0.1)] transition-[right] duration-300 ltr:-right-[400px] rtl:-left-[400px] dark:bg-black`}
      >
        <div className="perfect-scrollbar h-full overflow-y-auto overflow-x-hidden">
          <div className="relative pb-5 text-center">
            <button
              type="button"
              className="absolute top-0 opacity-30 hover:opacity-100 ltr:right-0 rtl:left-0 dark:text-white"
              onClick={() => setShowSetting(false)}
            >
              <IconX className="h-5 w-5" />
            </button>

            <h4 className="mb-1 uppercase dark:text-white">
              {t('USER_PREFERENCES')}
            </h4>
            <p className="text-white-dark">{t('USER_PREFERENCES_DESC')}</p>
          </div>

          <div className="mb-3 rounded-md border border-dashed border-white-light p-3 dark:border-[#1b2e4b]">
            <h5 className="mb-1 text-base leading-none dark:text-white">
              {t('COLOR_SCHEME')}
            </h5>
            <p className="text-xs text-white-dark">
              {t('OVERALL_LIGHT_OR_DARK_PRESENTATION')}
            </p>
            <div className="mt-3 grid grid-cols-3 gap-2">
              <button
                type="button"
                className={`${themeConfig.theme === 'light' ? 'btn-primary' : 'btn-outline-primary'} btn`}
                onClick={() => dispatch(toggleTheme('light'))}
              >
                <IconSun className="h-5 w-5 shrink-0 ltr:mr-2 rtl:ml-2" />
                {t('LIGHT')}
              </button>

              <button
                type="button"
                className={`${themeConfig.theme === 'dark' ? 'btn-primary' : 'btn-outline-primary'} btn`}
                onClick={() => dispatch(toggleTheme('dark'))}
              >
                <IconMoon className="h-5 w-5 shrink-0 ltr:mr-2 rtl:ml-2" />
                {t('DARK')}
              </button>

              <button
                type="button"
                className={`${themeConfig.theme === 'system' ? 'btn-primary' : 'btn-outline-primary'} btn`}
                onClick={() => dispatch(toggleTheme('system'))}
              >
                <IconLaptop className="h-5 w-5 shrink-0 ltr:mr-2 rtl:ml-2" />
                {t('SYSTEM')}
              </button>
            </div>
          </div>

          <div className="mb-3 rounded-md border border-dashed border-white-light p-3 dark:border-[#1b2e4b]">
            <h5 className="mb-1 text-base leading-none dark:text-white">
              {t('NAVIGATION_POSITION')}
            </h5>
            <p className="text-xs text-white-dark">
              {t('SELECT_THE_PRIMARY_NAVIGATION_PARADIGM_FOR_YOUR_APP')}
            </p>
            <div className="mt-3 grid grid-cols-3 gap-2">
              <button
                type="button"
                className={`${themeConfig.menu === 'horizontal' ? 'btn-primary' : 'btn-outline-primary'} btn`}
                onClick={() => {
                  dispatch(toggleMenu('horizontal'));
                  dispatch(resetToggleSidebar());
                }}
              >
                {t('HORIZONTAL')}
              </button>

              <button
                type="button"
                className={`${themeConfig.menu === 'vertical' ? 'btn-primary' : 'btn-outline-primary'} btn`}
                onClick={() => {
                  dispatch(toggleMenu('vertical'));
                  dispatch(resetToggleSidebar());
                }}
              >
                {t('VERTICAL')}
              </button>

              <button
                type="button"
                className={`${themeConfig.menu === 'collapsible-vertical' ? 'btn-primary' : 'btn-outline-primary'} btn`}
                onClick={() => {
                  dispatch(toggleMenu('collapsible-vertical'));
                  dispatch(resetToggleSidebar());
                }}
              >
                {t('COLLAPSIBLE')}
              </button>
            </div>
            <div className="mt-5 text-primary">
              <label className="mb-0 inline-flex">
                <input
                  type="checkbox"
                  className="form-checkbox"
                  checked={themeConfig.semidark}
                  onChange={(e) => dispatch(toggleSemidark(e.target.checked))}
                />
                <span>{t('SEMI_DARK_SIDEBAR_AND_HEADER')}</span>
              </label>
            </div>
          </div>

          <div className="mb-3 rounded-md border border-dashed border-white-light p-3 dark:border-[#1b2e4b]">
            <h5 className="mb-1 text-base leading-none dark:text-white">
              {t('LAYOUT_STYLE')}
            </h5>
            <p className="text-xs text-white-dark">
              {t('SELECT_THE_PRIMARY_LAYOUT_STYLE_FOR_YOUR_APP')}
            </p>
            <div className="mt-3 flex gap-2">
              <button
                type="button"
                className={`${themeConfig.layout === 'boxed-layout' ? 'btn-primary' : 'btn-outline-primary'} btn flex-auto`}
                onClick={() => dispatch(toggleLayout('boxed-layout'))}
              >
                {t('BOX')}
              </button>

              <button
                type="button"
                className={`${themeConfig.layout === 'full' ? 'btn-primary' : 'btn-outline-primary'} btn flex-auto`}
                onClick={() => dispatch(toggleLayout('full'))}
              >
                {t('FULL')}
              </button>
            </div>
          </div>

          <div className="mb-3 rounded-md border border-dashed border-white-light p-3 dark:border-[#1b2e4b]">
            <h5 className="mb-1 text-base leading-none dark:text-white">
              {t('NAVBAR_TYPE')}
            </h5>
            <p className="text-xs text-white-dark">{t('STICKY_OR_FLOATING')}</p>
            <div className="mt-3 flex items-center gap-3 text-primary">
              <label className="mb-0 inline-flex">
                <input
                  type="radio"
                  checked={themeConfig.navbar === 'navbar-sticky'}
                  value="navbar-sticky"
                  className="form-radio"
                  onChange={() => dispatch(toggleNavbar('navbar-sticky'))}
                />
                <span>{t('STICKY')}</span>
              </label>
              <label className="mb-0 inline-flex">
                <input
                  type="radio"
                  checked={themeConfig.navbar === 'navbar-floating'}
                  value="navbar-floating"
                  className="form-radio"
                  onChange={() => dispatch(toggleNavbar('navbar-floating'))}
                />
                <span>{t('FLOATING')}</span>
              </label>
              <label className="mb-0 inline-flex">
                <input
                  type="radio"
                  checked={themeConfig.navbar === 'navbar-static'}
                  value="navbar-static"
                  className="form-radio"
                  onChange={() => dispatch(toggleNavbar('navbar-static'))}
                />
                <span>{t('STATIC')}</span>
              </label>
            </div>
          </div>

          <div className="mb-3 rounded-md border border-dashed border-white-light p-3 dark:border-[#1b2e4b]">
            <h5 className="mb-1 text-base leading-none dark:text-white">
              {t('ROUTER_TRANSITION')}
            </h5>
            <p className="text-xs text-white-dark">
              {t('ANIMATION_OF_MAIN_CONTENT')}
            </p>
            <div className="mt-3">
              <select
                className="form-select border-primary text-primary"
                value={themeConfig.animation}
                onChange={(e) => dispatch(toggleAnimation(e.target.value))}
              >
                <option value=" ">{t('NONE')}</option>
                <option value="animate__fadeIn">{t('FADE')}</option>
                <option value="animate__fadeInDown">{t('FADE_DOWN')}</option>
                <option value="animate__fadeInUp">{t('FADE_UP')}</option>
                <option value="animate__fadeInLeft">{t('FADE_LEFT')}</option>
                <option value="animate__fadeInRight">{t('FADE_RIGHT')}</option>
                <option value="animate__slideInDown">{t('SLIDE_DOWN')}</option>
                <option value="animate__slideInLeft">{t('SLIDE_LEFT')}</option>
                <option value="animate__slideInRight">
                  {t('SLIDE_RIGHT')}
                </option>
                <option value="animate__zoomIn">{t('ZOOM_IN')}</option>
              </select>
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Setting;
