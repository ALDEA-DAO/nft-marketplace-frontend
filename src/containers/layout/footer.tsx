import {
  Twitter,
  Youtube,
  Linkedin
} from 'assets/icons/social-icons';

const social = [
  {
    id: 0,
    link: 'https://twitter.com/AldeaDao',
    icon: <Twitter />,
    className: 'twitter',
    title: 'twitter',
  },
  {
    id: 1,
    link: 'https://www.youtube.com/channel/UCwyOB8dm8D8jHrmFNvhzEig',
    icon: <Youtube />,
    className: 'youtube',
    title: 'youtube',
  },
  {
    id: 2,
    link: 'https://www.linkedin.com/company/74158784/',
    icon: <Linkedin />,
    className: 'linkedin',
    title: 'linkedin',
  },
];

const Footer = () => (
  <footer className="w-full flex items-center justify-center bg-white shadow-footer px-4 py-30px lg:px-35px lg:justify-between">
    <p className="text-gray-900">
      Copyright &copy; {new Date().getFullYear()}{' '}
      <a
        className="font-semibold transition-colors duration-200 ease-in-out hover:text-red-700"
        href="https://aldea-dao.org/"
      >
        ALDEA</a> & <a
        className="font-semibold transition-colors duration-200 ease-in-out hover:text-red-700"
        href="https://falconstakepool.com/"
      >Falcon Cardano Stakepool
      </a>{' '}
    </p>

    <div className="items-center hidden lg:flex">
      {social.map((item, index) => (
        <a
          href={item.link}
          className={`social ${item.className}`}
          key={index}
          target="_blank"
        >
          <span className="sr-only">{item.title}</span>
          {item.icon}
        </a>
      ))}
    </div>
  </footer>
);

export default Footer;
