import React, { Fragment } from "react";
import { Button, Table } from "reactstrap";
import { dateConverter } from "../../Utility/utility";

const Transactiontable = ({ transactionSummary,isPrint }) => {
  return (
    <div className="p-3">
      <h3 className="text-center font-13">Transactions in the Date</h3>

      <div className="pt-4 font-10">
        <Table bordered={true} striped responsive={isPrint? false:true} size="lg">
          <thead>
            <tr>
              <th>Name</th>
              <th>Date</th>
              <th>Advance Taken</th>
              <th>Particulars</th>
              <th>Bill Total</th>
              <th>Advance Paid</th>
              <th>Cash Paid</th>
              <th>Carry Forward</th>
            </tr>
          </thead>
          <tbody>
            {transactionSummary &&
              transactionSummary.length > 0 &&
              transactionSummary
                .sort((a, b) => (a.date < b.date ? 1 : -1))
                .map((transaction, index) => {
                  return (
                    <tr key={index}>
                      <th scope="row">{transaction.name}</th>
                      <td>{dateConverter(transaction.date)}</td>
                      <td>{transaction.type === "DEBIT" ? transaction.transactionAmount : ""}</td>
                      <td>
                        {transaction.type === "CREDIT" && (
                          <Fragment>
                            <table>
                              <tbody>
                                <tr>
                                  <td >Bags</td>
                                  <td className="ps-2">{transaction.numberofBags}</td>
                                </tr>
                                <tr>
                                  <td >Weigth</td>
                                  <td className="ps-2">{transaction.totalweight}</td>
                                </tr>
                                <tr>
                                  <td >Rate</td>
                                  <td className="ps-2">{transaction.rate}</td>
                                </tr>
                                <tr>
                                  <td >Hammali</td>
                                  <td className="ps-2">{transaction.hammali}</td>
                                </tr>
                                <tr>
                                  <td >Bhada</td>
                                  <td className="ps-2">{transaction.bhada}</td>
                                </tr>
                                <tr>
                                  <td >Commission({transaction.commission}%)</td>
                                  <td className="ps-2">{transaction.grossTotal * (transaction.commission/100)}</td>
                                </tr>
                              </tbody>
                            </table>
                          </Fragment>
                        )}
                      </td>
                      <td>{transaction.netTotal}</td>
                      <td>{transaction.type === "CREDIT" ? transaction.advanceSettlement : transaction.type === "ADVANCESETTLEMENT" ? transaction.transactionAmount : ""}</td>
                      <td>{transaction.paidToKisan}</td>
                      <td>{transaction.carryForwardFromThisEntry}</td>
                    </tr>
                  );
                })}
          </tbody>
        </Table>
      </div>
    </div>
  );
};

export default Transactiontable;
