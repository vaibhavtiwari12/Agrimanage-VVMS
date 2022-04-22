import React, { Fragment, useEffect } from "react";
import { useRef } from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useReactToPrint } from "react-to-print";
import {
   Breadcrumb,
   BreadcrumbItem,
   Button,
   Form,
   FormFeedback,
   FormGroup,
   Input,
   Label,
   Spinner,
} from "reactstrap";
import {
   convertOnlyDate,
   getOnlyMonth,
   getTransactionsBydate,
   getTransactionsByMonth,
   getTransactionsBetweenDates,
   dateConverter,
   getPurchaserTransactionsBydate
} from "../../Utility/utility";
import Reportprint from "./ReportPrint";
import ReportTab from "./ReportTab";
import Transactionperiodsummary from "./transactionPeriodSummary";
import Transactiontable from "./TransactionTable";

const Report = () => {
   
   return (
      <div className="mt-3">
         <Breadcrumb className="ps-3 mt-2">
            <BreadcrumbItem>
               <Link className="link-no-decoration-black text-primary" to="/">
                  Home
               </Link>
            </BreadcrumbItem>
            <BreadcrumbItem active>Report</BreadcrumbItem>
         </Breadcrumb>
         <h2 className="d-flex justify-content-center mt-2 capitalize text-dark font-14">
            Report
         </h2>
         <ReportTab />
      </div>
   );
};

export default Report;
