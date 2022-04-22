import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FormattedMessage } from "react-intl";
import {
  ButtonDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";
import {
  Navbar,
  NavbarBrand,
  NavbarToggler,
  Collapse,
  Nav,
  NavItem,
  NavLink,
} from "reactstrap";
import logo from "./particleBG.svg";
const NavBar = ({ isAuthenticated, logout, changelanguage }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isLanguageEnglish, setIsLanguageEnglish] = useState(true);
  const [collapsed, setCollapsed] = useState(true);
  const toggleNavbar = () => {
    setCollapsed(!collapsed);
  };
  const handleLogOut = () => {
    logout();
  };

  const toggelDropDown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleLanguageChange = () => {
    setIsLanguageEnglish((isLanguageEnglish) => !isLanguageEnglish);
  };
  const collapse = () => {
    setCollapsed(true)
  }
  useEffect(() => {
    console.log("Language Change ", isLanguageEnglish);
    changelanguage(isLanguageEnglish);
  }, [isLanguageEnglish]);

  return (
    <div>
      <Navbar color="primary" dark expand="md" light className="p-3">
        <Link className="nav-brand link-no-decoration text-white custom-logo-design" to="/">
          <img className="logo" src={logo} alt="MahrajVegetables" />
        </Link>
        <NavbarToggler onClick={toggleNavbar} className="mr-2" />
        <Collapse isOpen={!collapsed} navbar>
          <Nav className="" navbar>
            <Link
              className="nav-item ps-3 link-no-decoration text-white"
              onClick={collapse} to="/purchaser"
            >
              <FormattedMessage id="purchaser" />
            </Link>
            <Link
              className="nav-item ps-3 link-no-decoration text-white"
              onClick={collapse} to="/kisan"
            >
              <FormattedMessage id="kisan" />
            </Link>
            <Link
              className="nav-item ps-3 link-no-decoration text-white"
              onClick={collapse} to="/Report"
            >
              <FormattedMessage id="report" />
            </Link>
            <Link
              className="nav-item ps-3 link-no-decoration text-white"
              onClick={collapse} to="/inventory"
            >
              <FormattedMessage id="inventory" />
            </Link>
          </Nav>
          <Nav className="d-flex justify-content-end flex-fill" navbar>
            {isAuthenticated === "TRUE" ? (
              <div className="text-white greeting-container font-10">
                <ButtonDropdown
                  color="primary"
                  isOpen={dropdownOpen}
                  toggle={toggelDropDown}
                >
                  <DropdownToggle color="primary" caret>
                    <span className="capitalize">
                      <FormattedMessage id="hello" />{" "}
                      {window.sessionStorage.getItem("userName")}
                    </span>
                  </DropdownToggle>
                  <DropdownMenu>
                    <DropdownItem onClick={handleLogOut}>
                      <FormattedMessage id="logout" />
                    </DropdownItem>
                  </DropdownMenu>
                </ButtonDropdown>
              </div>
            ) : (
              <Link
                className="signin-nav ps-3 link-no-decoration text-white font-10"
                to="/Login"
              >
                Sign In
              </Link>
            )}
            <div className="switch-container">
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  name="toggleSwitch"
                  className="toggle-switch__checkbox"
                  id="myToggleSwitch"
                  onChange={handleLanguageChange}
                  checked={isLanguageEnglish}
                />
                <span className="toggle-switch__label">
                  <span className="toggle-switch__inner"></span>
                </span>
              </label>
            </div>
          </Nav>
        </Collapse>
      </Navbar>
    </div>
  );
};

export default NavBar;
