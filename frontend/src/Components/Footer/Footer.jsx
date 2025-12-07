import React from 'react';
import { Layout, Avatar, Space } from 'antd';
import VeggiesLogo from '../NavBar/VeggiesLogo.svg';
import './footer.css';

const { Footer: AntFooter } = Layout;
const Footer = () => {
  return (
    <AntFooter
      className="footer"
      style={{
        backgroundColor: '#001529',
        color: '#fff',
        fontSize: '14px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '16px 24px',
        minHeight: '64px',
        borderTop: '1px solid #434343',
      }}
    >
      <div>
        <a
          href="https://www.vaibhavtiwari.co.in"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            color: '#bfbfbf',
            textDecoration: 'none',
            fontSize: '13px',
          }}
        >
          &copy; Copyright 2021-2022 - Avalons
        </a>
      </div>
      <div>
        <Space align="center" size={12}>
          <Avatar
            style={{
              background: '#fff',
              fontWeight: 700,
              fontSize: 12,
              border: '2px solid #ff9800',
            }}
            size={28}
          >
            <img
              src={VeggiesLogo}
              alt="AgriManage Logo"
              style={{ width: 20, height: 20, display: 'block' }}
            />
          </Avatar>
          <span style={{ fontWeight: 600, fontSize: 14, color: '#fff' }}>AgriManage</span>
        </Space>
      </div>
    </AntFooter>
  );
};

export default Footer;
