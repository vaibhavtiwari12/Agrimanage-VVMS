import React, { useEffect, useState } from "react";
import { Table } from "reactstrap";
import { dateConverter } from "../../Utility/utility";

const PurchaserSummary = ({ transactionSummary, date }) => {
  const [outGoingCash, setOutGoingCash] = useState(0);
  const [advanceSettled, setTotalAdvanceSettled] = useState(0);
  const [carryForwardAmount, setCarryForwardAmount] = useState(0);
  const [buyingAmount, setBuyingAmount] = useState(0);
  const [totalOutstandingInThePeriod, setTotalOutstandingInThePeriod] = useState(0);
  useEffect(() => {
    console.log("props changed");
    calculateOutGoingCash();
  }, [transactionSummary]);

  //TODO : Remove all parse int once you change the credit form to use number instead of strings
  const calculateOutGoingCash = () => {
    let totalOutstandingInThePeriod = 0;
    let totalAdvanceSettled = 0;
    let buyingAmount = 0;
    if (transactionSummary && transactionSummary.length > 0) {
      transactionSummary.map((transaction) => {
        if (transaction.type === "CREDIT") {
          totalAdvanceSettled += parseInt(transaction.transactionAmount);
        }
        if (transaction.type === "DEBIT") {
          buyingAmount += Math.abs(parseInt(transaction.transactionAmount));
          totalOutstandingInThePeriod += parseInt(transaction.transactionAmount)
          }
        });
      setTotalAdvanceSettled(totalAdvanceSettled);
      setTotalOutstandingInThePeriod(totalOutstandingInThePeriod);
      setBuyingAmount(buyingAmount);
      return null;
    }
  };
  return (
    <div>
      <div className="p-3">
        <Table bordered responsive className="p-3 kisan-detail">
          <tbody>
            <tr>
              <th>Date</th>
              <td className="capitalize">{date}</td>
            </tr>
            <tr>
              <th>Total Outstanding In Period</th>
              <td className="capitalize">{totalOutstandingInThePeriod}</td>
            </tr>
            <tr>
              <th>Total Buying Amount</th>
              <td className="capitalize">{buyingAmount}</td>
            </tr>
            <tr>
              <th>Total Outstanding settled in the period</th>
              <td className="capitalize">{advanceSettled}</td>
            </tr>
          </tbody>
        </Table>
      </div>
    </div>
  );
};

export default PurchaserSummary;
