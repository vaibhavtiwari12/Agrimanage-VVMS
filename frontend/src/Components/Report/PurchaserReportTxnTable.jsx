import React, { Fragment } from "react";
import { Link } from "react-router-dom";
import { Button, Table } from "reactstrap";
import { dateConverter } from "../../Utility/utility";

const PurchaserReportTxnTable = ({ transactionSummary }) => {
   return (
      <div className="p-3">
         <h3 className="text-center font-13">Transactions in the Date</h3>

         <div className="pt-4">
            <Table bordered={true} striped responsive size="lg">
               <thead>
                  <tr>
                     <th>Name - Company Name</th>
                     <th>Date</th>
                     <th>Buying Amount</th>
                     <th>Bought From</th>
                     <th>Particulars</th>
                     <th>OutStanding Settled</th>
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
                                 <th scope="row">
                                    {transaction.name} -{" "}
                                    {transaction.companyName}
                                 </th>
                                 <td>{dateConverter(transaction.date)}</td>
                                 <td>
                                    {transaction.type === "DEBIT"
                                       ? transaction.transactionAmount
                                       : ""}
                                 </td>
                                 <td>
                                    {transaction.type === "DEBIT"
                                       ? <Link to={`kisanDetails/${transaction.kisan}`}>
                                            {transaction.kisanName}
                                         </Link>
                                       : ""}
                                 </td>
                                 <td>
                                    {transaction.type === "DEBIT" && (
                                       <Fragment>
                                          <table>
                                             <tbody>
                                                <tr>
                                                   <td>Bags</td>
                                                   <td className="ps-2">
                                                      {transaction.numberofBags}
                                                   </td>
                                                </tr>
                                                <tr>
                                                   <td>Weigth</td>
                                                   <td className="ps-2">
                                                      {transaction.totalweight}
                                                   </td>
                                                </tr>
                                                <tr>
                                                   <td>Rate</td>
                                                   <td className="ps-2">
                                                      {transaction.rate}
                                                   </td>
                                                </tr>
                                             </tbody>
                                          </table>
                                       </Fragment>
                                    )}
                                 </td>
                                 <td>
                                    {transaction.type === "CREDIT"
                                       ? transaction.transactionAmount
                                       : ""}
                                 </td>
                                </tr>
                           );
                        })}
               </tbody>
            </Table>
         </div>
      </div>
   );
};

export default PurchaserReportTxnTable;
