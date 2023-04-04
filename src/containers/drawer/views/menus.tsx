import { useContext } from 'react';
import Link from 'next/link';
import { Scrollbar } from 'components/scrollbar';
import ActiveLink from 'components/menues-active-link';
import { DrawerContext } from 'contexts/drawer/drawer.provider';
import CloseIcon from 'assets/icons/close';
import LogoMenu from 'assets/icons/logo-menu';
import {
  Twitter,
  Youtube,
  Linkedin,
} from 'assets/icons/social-icons';

const menus = [
  {
    id: 1,
    pathname: '/',
    title: 'Home',
  }, {
    id: 21,
    pathname: '/sell',
    title: 'Sell NFT'
  },
  {
    id: 2,
    pathname: '/faq',
    title: 'FAQ',
  },
  {
    id: 3,
    pathname: 'https://aldea-dao.org/',
    title: 'ALDEA Website',
  },
  {
    id: 4,
    pathname: 'https://discord.aldea-dao.org/',
    title: 'Discord',
  },
  {
    id: 5,
    pathname: 'https://t.me/elFogonDeALDEA',
    title: 'Telegram: El Fogón de ALDEA',
  },
];


const social = [
  {
    id: 0,
    link: '/',
    icon: <Twitter />,
    className: 'twitter',
    title: 'twitter',
  },
  {
    id: 1,
    link: '/',
    icon: <Youtube />,
    className: 'youtube',
    title: 'youtube',
  },
  {
    id: 2,
    link: '/',
    icon: <Linkedin />,
    className: 'linkedin',
    title: 'linkedin',
  },
];

export default function DrawerMenu() {
  const { dispatch } = useContext(DrawerContext);
  const hideMenu = () => {
    dispatch({
      type: 'OPEN_MENU',
      payload: {
        menu: false,
      },
    });
  };

  return (
    <>
      <div className="flex flex-col w-full h-full">
        <div className="w-full h-90px bg-gray-100 flex justify-start items-center relative px-30px flex-shrink-0">
          <Link href="/">
            <a className="flex" onClick={hideMenu}>              
              <LogoMenu id="medsy-menu-logo" />
            </a>
          </Link>

          <button
            className="w-30px h-30px flex items-center justify-center text-gray-500 absolute right-25px focus:outline-none"
            onClick={hideMenu}
            aria-label="close"
          >
            <CloseIcon />
          </button>
        </div>

        <Scrollbar className="menu-scrollbar flex-grow">
          <div className="flex flex-col py-60px pb-40px lg:pb-60px">
            {menus.map((menu, index) => (
              <ActiveLink
                href={menu.pathname}
                activeClassName="font-semibold active"
                key={index}
              >
                <a
                  className="menu-item relative text-gray-900 pl-30px pr-4 mb-8 transition duration-300 ease-in-out last:mb-0 hover:text-gray-900"
                  onClick={hideMenu}
                >
                  {menu.title}
                </a>
              </ActiveLink>
            ))}
          </div>
        </Scrollbar>

        <div className="flex items-center justify-start border-t border-gray-300 bg-gray-100 h-12 px-30px flex-shrink-0 lg:hidden">
          {social.map((item, index) => (
            <a
              href={item.link}
              className={`social ${item.className}`}
              target="_blank"
              key={index}
            >
              <span className="sr-only">{item.title}</span>
              {item.icon}
            </a>
          ))}
        </div>
      </div>
    </>
  );
}
