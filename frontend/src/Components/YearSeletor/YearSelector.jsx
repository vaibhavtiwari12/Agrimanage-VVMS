import axios from "axios";
import React, { Fragment, useContext, useEffect, useState } from "react";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import { Dropdown, DropdownItem, DropdownMenu, DropdownToggle } from "reactstrap";
import { FormattedMessage } from "react-intl";
import YearContext from "../../Context/YearContext.js";

const YearSelector = () => {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const history = useHistory();
    const yearCtx = useContext(YearContext)
    const toggle = () => {
        setDropdownOpen((prev) => !prev)
      }
    
    const onClickYearHandler = async (changedYear) => {
        await axios.post('/yearChange',{
            year: changedYear
        })
        yearCtx.onSetYear(changedYear)
        sessionStorage.setItem("Year",changedYear)
        console.log("Year Context ", yearCtx)
        history.push('/')
    }
   return (
    <Fragment>
        <div className="mt-5 text-center">
            <h5> <FormattedMessage id="selectYearTitle" /></h5>
        </div>
      <div className="d-flex justify-content-center mt-5">
         <Dropdown isOpen={dropdownOpen} toggle={toggle} >
            <DropdownToggle color="primary" caret>{yearCtx.year ? yearCtx.year === 2022 ? '2022-23' : '2023-24' : "Select Year"}</DropdownToggle>
            <DropdownMenu>
               <DropdownItem active={yearCtx.year === 2023} onClick={() =>onClickYearHandler(2023)}>2023-24</DropdownItem>
               <DropdownItem active={yearCtx.year === 2022} onClick={() =>onClickYearHandler(2022)}>2022-23</DropdownItem>
            </DropdownMenu>
         </Dropdown>
      </div>
    </Fragment>
   );
};

export default YearSelector;
