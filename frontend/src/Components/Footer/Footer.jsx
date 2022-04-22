import React from "react";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { solid, regular, brands } from '@fortawesome/fontawesome-svg-core/import.macro'

import "./footer.css";
const Footer = () => {
  return (
    <div>
      <footer className="bg-primary text-white font-10">
          <div className="d-flex align-items-center h-100">
            <div className="ps-3">
                <a className="link-no-decoration" href="https://www.vaibhavtiwari.co.in" target="_blank">&copy; Copyright 2021-2022 - Avalons</a>
            </div>
            <div className="ps-3 flex-fill d-flex justify-content-end pe-3">
              <FontAwesomeIcon  icon={brands('facebook')} className="text-white"/>
            </div>
          </div>
      </footer>
    </div>
  );
};

export default Footer;
