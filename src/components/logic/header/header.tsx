import React, { FC } from 'react';
import 'antd/dist/antd.css';
import { Menu } from 'antd';

const items = [
  {
    key: 'search',
    label: 'Search',
    href: '/search',
  },
  {
    key: 'rated',
    label: 'Rated',
    href: '/rated',
  },
];

interface HeaderProps {
  onSelect: (key: string) => void;
}

const Header: FC<HeaderProps> = ({ onSelect }) => {
  return (
    <header className="movie-db-app__header">
      <Menu
        onClick={(e) => {
          onSelect(e.key);
        }}
        mode="horizontal"
        theme="light"
        defaultSelectedKeys={['search']}
        items={items}
      />
    </header>
  );
};

export default Header;
