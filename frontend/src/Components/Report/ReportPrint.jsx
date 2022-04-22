import React from "react";
import Transactionperiodsummary from "./transactionPeriodSummary";
import Transactiontable from "./TransactionTable";

const Reportprint = React.forwardRef((props, ref) => {
    console.log(props.transactionSummary, props.searchDate)
  return (
    <div ref={ref}>
        <h2 className="text-center pt-3">REPORT</h2>
      <Transactionperiodsummary
        transactionSummary={props.transactionSummary}
        date = {props.date}
      />
      <Transactiontable isPrint={true} transactionSummary={props.transactionSummary} />
    </div>
  );
});

export default Reportprint;
