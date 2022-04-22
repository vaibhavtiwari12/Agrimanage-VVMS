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
} from "../../Utility/utility";
import Reportprint from "./ReportPrint";
import Transactionperiodsummary from "./transactionPeriodSummary";
import Transactiontable from "./TransactionTable";


const Kisanreport = () => {
    
   const componentRef = useRef();
   const [transactions, setTransactions] = useState();
   const [startDate, setStartDate] = useState(convertOnlyDate(new Date()));
   const [endDate, setEndDate] = useState(convertOnlyDate(new Date()));
   const [isInit, setIsInit] = useState(true);
   const [radioSelection, setRadioSelection] = useState("bydate");
   const [date, setDate] = useState(convertOnlyDate(new Date()));
   const [month, setMonth] = useState(getOnlyMonth(new Date()));
   const [isLoading, setIsLoading] = useState(true);
   useEffect(() => {
      try {
         const fetchData = async () => {
            //setTransactions(await getTransactionsBydate(convertOnlyDate(new Date()))
            setTransactions([
               ...(await getTransactionsBydate(convertOnlyDate(new Date()))),
            ]);
            setIsLoading(false);
         };
         fetchData();
      } catch (e) {
         throw new Error("Something Went Wrong ", e);
      }
   }, []);
   useEffect(() => {
      console.log("transactions ", transactions);
      document.title = "VVMS - Report ";
   }, [transactions]);

   const dateChange = async (e) => {
      setIsLoading(true);
      console.log("Date ==", e.target.value);
      setDate(e.target.value);
      setTransactions([...(await getTransactionsBydate(e.target.value))]);
      setIsLoading(false);
   };
   const monthChange = async (e) => {
      setIsLoading(true);
      console.log("Month ==", e.target.value);
      setMonth(e.target.value);
      setTransactions([...(await getTransactionsByMonth(e.target.value))]);
      setIsLoading(false);
   };
   const submit = () => {};
   const handleRadioChange = async (e) => {
      setIsLoading(true);
      console.log("RADIOSS ", e.target.name);
      setRadioSelection(e.target.name);
      if (e.target.name === "bydate") {
         setDate(convertOnlyDate(new Date()));
         setTransactions([
            ...(await getTransactionsBydate(convertOnlyDate(new Date()))),
         ]);
         setIsLoading(false);
      } else if (e.target.name === "bymonth") {
         setMonth(getOnlyMonth(new Date()));
         setTransactions([
            ...(await getTransactionsByMonth(getOnlyMonth(new Date()))),
         ]);
         setIsLoading(false);
      } else if (e.target.name === "betweenDates") {
        setStartDate(convertOnlyDate(new Date()));  
        let ed = new Date();
        ed = new Date(ed.setDate(ed.getDate() + 1));
        setEndDate(convertOnlyDate(new Date()));  
        setTransactions([
            ...(await getTransactionsBetweenDates(convertOnlyDate(new Date()), convertOnlyDate(ed)))
         ]);
         setIsLoading(false);
      }
   };
   const handlePrint = useReactToPrint({
      content: () => componentRef.current,
   });
   const handleStartDateChange = async (e) => {
      setStartDate(e.target.value);
      setIsInit(false);
   };
   const handleEndDateChange = async (e) => {
      setEndDate(e.target.value);
      setIsInit(false);
   };
   useEffect(() => {
      setIsLoading(true);
      const fetchData = async () => {
         if (new Date(startDate) <= new Date(endDate) && !isInit) {
            console.log("is Here");
            let ed = new Date(endDate);
            ed = new Date(ed.setDate(ed.getDate() + 1));
            setTransactions([
               ...(await getTransactionsBetweenDates(startDate, ed)),
            ]);
            setIsLoading(false);
         }
      };
      fetchData();
   }, [startDate, endDate]);
    return (
        <div>
         <Form onSubmit={(e) => submit(e)} className="m-3 p-3 shadow font-10">
            {/*  <h6>Please Change the date to generate report of different Date</h6> */}
            <FormGroup tag="fieldset" className="">
               <legend>
                  <span className="font-10">
                     <b>Select Filter</b>
                  </span>
               </legend>
               <FormGroup check>
                  <Label check>
                     <Input
                        type="radio"
                        name="bydate"
                        value={radioSelection}
                        checked={radioSelection === "bydate"}
                        onChange={(e) => handleRadioChange(e)}
                     />{" "}
                     By Day
                  </Label>
               </FormGroup>
               <FormGroup check>
                  <Label check>
                     <Input
                        type="radio"
                        name="bymonth"
                        value={radioSelection}
                        checked={radioSelection === "bymonth"}
                        onChange={(e) => handleRadioChange(e)}
                     />{" "}
                     Monthly
                  </Label>
               </FormGroup>
               <FormGroup check>
                  <Label check>
                     <Input
                        type="radio"
                        name="betweenDates"
                        value={radioSelection}
                        checked={radioSelection === "betweenDates"}
                        onChange={(e) => handleRadioChange(e)}
                     />{" "}
                     Between Dates
                  </Label>
               </FormGroup>
            </FormGroup>
            {/* for DATE */}
            {radioSelection === "bydate" ? (
               <FormGroup className="mt-3 mb-2">
                  <Label for="date"><b> Select date to generate report </b></Label>
                  <Input
                     name="date"
                     type="date"
                     value={date.toLocaleString()}
                     onWheel={(e) => e.target.blur()}
                     onChange={(e) => dateChange(e)}
                  />
                  <FormFeedback> date should be greater than 0</FormFeedback>
               </FormGroup>
            ) : (
               ""
            )}
            {/* FOR MONTH */}
            {radioSelection === "bymonth" ? (
               <FormGroup className="mt-3">
                  <Label for="month"> <b>Select Month to generate report </b></Label>
                  <Input
                     name="month"
                     type="month"
                     value={month.toLocaleString()}
                     onWheel={(e) => e.target.blur()}
                     onChange={(e) => monthChange(e)}
                     max={getOnlyMonth(new Date())}
                  />
                  <FormFeedback> Month should be greater than 0</FormFeedback>
               </FormGroup>
            ) : (
               ""
            )}
            {/* FOR BETWEENDATES */}
            {radioSelection === "betweenDates" ? (
               <Fragment>
                  <FormGroup className="mt-3">
                     <Label for="startDate"> <b>From</b></Label>
                     <Input
                        invalid={new Date(endDate) < new Date(startDate)}
                        name="startDate"
                        type="date"
                        value={startDate.toLocaleString()}
                        onWheel={(e) => e.target.blur()}
                        onChange={(e) => handleStartDateChange(e)}
                        max={convertOnlyDate(new Date())}
                     />
                     <FormFeedback>
                        {" "}
                        Start Date cannot be greater than End Date
                     </FormFeedback>
                  </FormGroup>
                  <FormGroup className="mt-2">
                     <Label for="endDate"><b>To</b></Label>
                     <Input
                        invalid={new Date(endDate) < new Date(startDate)}
                        name="endDate"
                        type="date"
                        value={endDate.toLocaleString()}
                        onWheel={(e) => e.target.blur()}
                        onChange={(e) => handleEndDateChange(e)}
                        max={convertOnlyDate(new Date())}
                     />
                     <FormFeedback>
                        {" "}
                        End Date cannot be Greater than Start Date
                     </FormFeedback>
                  </FormGroup>
               </Fragment>
            ) : (
               ""
            )}
         </Form>
         {isLoading ? (
            <div className="text-center mt-5 text-primary">
               <Spinner/>
            </div>
         ) : transactions && transactions.length > 0 ? (
            <div>
               <div className="d-flex justify-content-center">
                  <Button
                     onClick={handlePrint}
                     color="primary"
                     className="ps-4 pe-4"
                  >
                     Print
                  </Button>
               </div>

               <Transactionperiodsummary
                  transactionSummary={transactions}
                  date={
                     radioSelection === "bydate"
                        ? dateConverter(date)
                        : radioSelection === "bymonth"
                        ? getOnlyMonth(month)
                        : `${dateConverter(startDate)} to ${dateConverter(
                             endDate
                          )}`
                  }
               />
               <Transactiontable transactionSummary={transactions} isPrint={false} />
            </div>
         ) : (
            <div className="text-center pt-3">
               {date === convertOnlyDate(new Date()) ? (
                  <h3 className="text-muted font-14">
                     No Transactions were done Today.
                  </h3>
               ) : (
                  <h3 className="text-muted font-14">
                     No Transactions were done on this Date.
                  </h3>
               )}

               <h6 className="text-danger font-10">
                  Please try a different date to see the transactions
               </h6>
            </div>
         )}

         <div className="hide-till-print">
            <Reportprint
               transactionSummary={transactions}
               date={
                  radioSelection === "bydate"
                     ? dateConverter(date)
                     : radioSelection === "bymonth"
                     ? getOnlyMonth(month)
                     : `${dateConverter(startDate)} to ${dateConverter(
                          endDate
                       )}`
               }
               ref={componentRef}
            />
         </div>
      </div>
    );
}

export default Kisanreport;
