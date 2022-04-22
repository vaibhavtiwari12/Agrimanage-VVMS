import React, { useEffect, useState } from "react";
import { Table } from "reactstrap";
import { dateConverter } from "../../Utility/utility";

const Transactionperiodsummary = ({ transactionSummary, date }) => {
  const [outGoingCash, setOutGoingCash] = useState(0);
  const [advanceSettled, setTotalAdvanceSettled] = useState(0);
  const [carryForwardAmount, setCarryForwardAmount] = useState(0);
  const [advanceTaken, setAdvanceTaken] = useState(0);
  const [cashPaidTokisan, setCashPaidTokisan] = useState(0);
  useEffect(() => {
    console.log("props changed");
    calculateOutGoingCash();
  }, [transactionSummary]);

  //TODO : Remove all parse int once you change the credit form to use number instead of strings
  const calculateOutGoingCash = () => {
    let totalOutGoingCash = 0;
    let totalAdvanceSettled = 0;
    let totalCarryForwardAmount = 0;
    let cashPaidTokisan = 0;
    let advanceTaken = 0;
    if (transactionSummary && transactionSummary.length > 0) {
      transactionSummary.map((transaction) => {
        if (transaction.type === "DEBIT") {
          totalOutGoingCash += Math.abs(
            parseInt(transaction.transactionAmount)
          );
          advanceTaken += Math.abs(parseInt(transaction.transactionAmount));
        }
        if (transaction.type === "CREDIT") {
          totalOutGoingCash += parseInt(transaction.paidToKisan);
          cashPaidTokisan += parseInt(transaction.paidToKisan);
          totalCarryForwardAmount += parseInt(transaction.carryForwardAmount);
          totalAdvanceSettled += parseInt(transaction.advanceSettlement);
        }
      });
      setOutGoingCash(totalOutGoingCash);
      setTotalAdvanceSettled(totalAdvanceSettled);
      setCarryForwardAmount(totalCarryForwardAmount);
      setCashPaidTokisan(cashPaidTokisan);
      setAdvanceTaken(advanceTaken);
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
              <th>Total Out Going Cash</th>
              <td className="capitalize">{outGoingCash}</td>
            </tr>
            <tr>
              <th>Total Advace Taken</th>
              <td className="capitalize">{advanceTaken}</td>
            </tr>
            <tr>
              <th>Total Cash Paid</th>
              <td>{cashPaidTokisan}</td>
            </tr>
            <tr>
              <th>Total Advance settled in the period</th>
              <td className="capitalize">{advanceSettled}</td>
            </tr>
            <tr>
              <th>Total Amount Carry Forwarded</th>
              <td>{carryForwardAmount}</td>
            </tr>
          </tbody>
        </Table>
      </div>
    </div>
  );
};

export default Transactionperiodsummary;
