import React from "react";
import PurchaserReportTxnTable from "./PurchaserReportTxnTable";
import PurchaserSummary from "./PurchaserSummary";

const PurchaserReportPrint = React.forwardRef((props, ref) => {
    console.log(props.transactionSummary, props.searchDate)
  return (
    <div ref={ref}>
        <h2 className="text-center pt-3">REPORT</h2>
      <PurchaserSummary
        transactionSummary={props.transactionSummary}
        date = {props.date}
      />
      <PurchaserReportTxnTable transactionSummary={props.transactionSummary} />
    </div>
  );
});

export default PurchaserReportPrint;
