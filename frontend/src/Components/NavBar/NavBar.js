import { useContext, useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import {
  Layout,
  Menu,
  Dropdown,
  Button,
  Switch,
  Drawer,
  Avatar,
  Typography,
  Space,
  Modal,
} from 'antd';
import {
  GlobalOutlined,
  MenuOutlined,
  CloseOutlined,
  ShoppingCartOutlined,
  UserSwitchOutlined,
  BarChartOutlined,
  AppstoreOutlined,
  CalendarOutlined,
  LogoutOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import YearContext from '../../Context/YearContext';
import CreateYearModal from './CreateYearModal';
import './NavBar.css';
import VeggiesLogo from './VeggiesLogo.svg';

const { Header } = Layout;
const { Text, Title } = Typography;

const NavBar = ({ isAuthenticated, logout, changelanguage, year: yearProp }) => {
  const [isLanguageEnglish, setIsLanguageEnglish] = useState(true);
  // Use year from prop if available, else fallback to context
  const yearFromContext = useContext(YearContext).year;
  const year = yearProp !== undefined ? yearProp : yearFromContext;
  const location = useLocation();
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 900);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [createYearModalVisible, setCreateYearModalVisible] = useState(false);

  // Check if user is admin
  const userName = window.sessionStorage.getItem('userName');
  const isAdmin = userName && userName.toLowerCase() === 'admin';

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 900);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleLogOut = () => {
    logout();
  };

  const handleLanguageChange = checked => {
    setIsLanguageEnglish(checked);
  };

  useEffect(() => {
    changelanguage(isLanguageEnglish);
  }, [isLanguageEnglish]);

  const userMenu = (
    <Menu>
      {isAdmin && (
        <Menu.SubMenu key="adminSettings" title="Admin Settings" icon={<SettingOutlined />}>
          <Menu.Item
            key="createYear"
            icon={<CalendarOutlined />}
            onClick={() => {
              setCreateYearModalVisible(true);
              setDrawerVisible(false); // Close drawer if opened from mobile
            }}
          >
            Create Year
          </Menu.Item>
        </Menu.SubMenu>
      )}
      <Menu.Item key="logout" icon={<LogoutOutlined />} onClick={handleLogOut}>
        <FormattedMessage id="logout" />
      </Menu.Item>
    </Menu>
  );

  const userDropdownButton = (
    <Dropdown overlay={userMenu} trigger={['click']}>
      <Button
        type="text"
        style={{ padding: 0, height: 'auto', background: 'none', boxShadow: 'none' }}
      >
        <Space>
          <Text style={{ color: '#222', fontWeight: 500, fontSize: isMobile ? 14 : 16 }}>
            <FormattedMessage id="hello" />,{' '}
            <span style={{ fontWeight: 700, textTransform: 'capitalize' }}>
              {window.sessionStorage.getItem('userName')}
            </span>
          </Text>
        </Space>
      </Button>
    </Dropdown>
  );

  const navMenu = (
    <Menu
      mode={isMobile ? 'inline' : 'horizontal'}
      selectedKeys={[location.pathname]}
      theme="light"
      style={{
        borderBottom: 'none',
        background: 'transparent',
        fontWeight: 500,
        fontSize: isMobile ? 14 : 14,
        boxShadow: 'none',
        outline: 'none',
        flex: 1,
      }}
      onClick={() => isMobile && setDrawerVisible(false)}
      tabIndex={-1} // Prevent focus outline
    >
      <Menu.Item key="/purchaser" icon={<ShoppingCartOutlined />}>
        <Link to="/purchaser" style={{ textDecoration: 'none', color: 'inherit' }}>
          <FormattedMessage id="purchaser" />
        </Link>
      </Menu.Item>
      <Menu.Item key="/kisan" icon={<UserSwitchOutlined />}>
        <Link to="/kisan" style={{ textDecoration: 'none', color: 'inherit' }}>
          <FormattedMessage id="kisan" />
        </Link>
      </Menu.Item>
      <Menu.Item key="/Report" icon={<BarChartOutlined />}>
        <Link to="/Report" style={{ textDecoration: 'none', color: 'inherit' }}>
          <FormattedMessage id="report" />
        </Link>
      </Menu.Item>
      <Menu.Item key="/inventory" icon={<AppstoreOutlined />}>
        <Link to="/inventory" style={{ textDecoration: 'none', color: 'inherit' }}>
          <FormattedMessage id="inventory" />
        </Link>
      </Menu.Item>
      {isAuthenticated === 'TRUE' && (
        <Menu.Item key="/yearSelector" icon={<CalendarOutlined />}>
          <Link to="/yearSelector" style={{ textDecoration: 'none', color: 'inherit' }}>
            {year ? (
              <span>
                <FormattedMessage id="yearTitle" />-{year}
              </span>
            ) : (
              <span>
                <FormattedMessage id="selectYearTitle" />
              </span>
            )}
          </Link>
        </Menu.Item>
      )}
    </Menu>
  );

  return (
    <Header
      style={{
        background: '#fff',
        padding: 0,
        boxShadow: '0 1px 0 #f0f0f0',
        height: 72,
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <div
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          margin: '0 1.5rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 0, flex: 1 }}>
          <Link
            to="/"
            style={{ display: 'flex', alignItems: 'center', gap: 12, textDecoration: 'none' }}
          >
            <Avatar
              style={{
                background: '#fff',
                fontWeight: 700,
                fontSize: 16,
                cursor: 'pointer',
                boxShadow: '0 2px 8px #e6f4ff',
                border: '2.5px solid #ff9800',
                padding: 0,
              }}
              size={36}
            >
              <img
                src={VeggiesLogo}
                alt="Logo"
                style={{ width: 28, height: 28, display: 'block' }}
              />
            </Avatar>
            <span
              style={{
                fontWeight: 700,
                fontSize: isMobile ? 16 : 18,
                color: '#222',
                whiteSpace: 'nowrap',
                letterSpacing: 0.5,
                cursor: 'pointer',
              }}
            >
              AgriManage
            </span>
          </Link>
          {/* Nav menu immediately next to logo/avatar */}
          {!isMobile && navMenu}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          {isMobile && (
            <Button
              type="text"
              icon={<MenuOutlined style={{ color: '#222', fontSize: 22 }} />}
              onClick={() => setDrawerVisible(true)}
              style={{ marginRight: 8 }}
            />
          )}
          {/* Desktop: show user dropdown and language switch */}
          {!isMobile &&
            (isAuthenticated === 'TRUE' ? (
              userDropdownButton
            ) : (
              <Button type="default" style={{ fontWeight: 500, fontSize: 13 }}>
                <Link to="/Login">Sign In</Link>
              </Button>
            ))}
          {/* Language toggle avatar */}
          {!isMobile && (
            <div style={{ display: 'flex', alignItems: 'center', marginLeft: 8 }}>
              <Avatar
                style={{
                  backgroundColor: isLanguageEnglish ? '#1890ff' : '#ff6b35',
                  color: '#fff',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  fontSize: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                size={32}
                onClick={() => handleLanguageChange(!isLanguageEnglish)}
              >
                {isLanguageEnglish ? 'EN' : 'HI'}
              </Avatar>
            </div>
          )}
        </div>
      </div>
      <Drawer
        title={
          <span style={{ color: '#4e8cff', fontWeight: 700 }}>
            Menu{' '}
            <Button
              type="text"
              icon={<CloseOutlined />}
              onClick={() => setDrawerVisible(false)}
              style={{ float: 'right' }}
            />
          </span>
        }
        placement="right"
        closable={false}
        onClose={() => setDrawerVisible(false)}
        visible={drawerVisible}
        bodyStyle={{ padding: 0 }}
        width={260}
      >
        {isMobile && (
          <div
            style={{
              padding: '16px 24px',
              borderBottom: '1px solid #f0f0f0',
              display: 'flex',
              justifyContent: 'space-between',
              gap: 12,
            }}
          >
            {isAuthenticated === 'TRUE' ? (
              userDropdownButton
            ) : (
              <Button type="default" style={{ fontWeight: 500, width: '100%' }}>
                <Link to="/Login" onClick={() => setDrawerVisible(false)}>
                  Sign In
                </Link>
              </Button>
            )}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              {/* Language toggle avatar in Drawer */}
              <Avatar
                style={{
                  backgroundColor: isLanguageEnglish ? '#1890ff' : '#ff6b35',
                  color: '#fff',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  fontSize: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                size={32}
                onClick={() => handleLanguageChange(!isLanguageEnglish)}
              >
                {isLanguageEnglish ? 'EN' : 'HI'}
              </Avatar>
            </div>
          </div>
        )}
        {navMenu}
      </Drawer>

      {/* Create Year Modal for Admin */}
      <CreateYearModal
        visible={createYearModalVisible}
        onClose={() => setCreateYearModalVisible(false)}
        onYearCreated={() => {
          // Reload the page to refresh year options
          window.location.reload();
        }}
      />
    </Header>
  );
};

export default NavBar;
