import React, { useEffect } from "react";
import { useState } from "react";
import { Table } from "reactstrap";

const PurchaserBill = React.forwardRef((props, ref) => {
   console.log("PORPS ", props);
   const [purchaser, setPurchaser] = useState({});
   const [debitSum, setDebitSum] = useState(0);
   const [creditSum, setCreditSum] = useState(0);
   useEffect(() => {
      setPurchaser(props.data);
   }, [props.data]);
   return (
      <div ref={ref} className="mt-3 ms-5 me-5 mb-3">
         <h6 className="text-center text-success">|| श्री गुरु कृपा ||</h6>
         <h1 className="text-center text-danger text-shadow-im">IM</h1>
         <h1 className="text-center text-danger text-shadow-im underline m-2">
            <u className="company-heading">महाराज वेजिटेबल कंपनी</u>
         </h1>
         <h5 className="text-center text-success">
            धनिया, टमाटर, मटर एवं सब्जी के आढ़ती{" "}
         </h5>
         <hr />
         <h6 className="text-center text-danger">
            <b>दु. न. 35 कृषि उपज मंडी, जबलपुर (म. प्र.) | मो. 9300933117</b>
         </h6>
         <hr />
         <div className="ps-1">
            <Table size="sm" borderless>
               <tbody>
                  <tr>
                     <th>नाम</th>
                     <td>{props.data.name}</td>
                     <th>बिल क्रमांक </th>
                     <td>{props.data.billId}</td>
                  </tr>
                  <tr>
                     <th>कंपनी का नाम</th>
                     <td>{props.data.companyName}</td>
                     <th>दिनांक </th>
                     <td>{props.data.date}</td>
                  </tr>
                  <tr>
                     <th>पता</th>
                     <td>{props.data.address}</td>
                  </tr>
                  <tr>
                     <th>फ़ोन </th>
                     <td>{props.data.phone}</td>
                  </tr>
               </tbody>
            </Table>
         </div>
         <hr />
         <div>
            <Table size="sm" borderless>
               <tbody>
                  <tr>
                     <td className="fill-row">
                        <b>पुराना बचा बैलेंस</b>
                     </td>
                     <td className="text-end">
                        <b>{props.data.oldBalance}</b>
                     </td>
                  </tr>
               </tbody>
            </Table>
            <hr />
            <b>ख़रीददारी का बेयौरा </b> दिनांक : {props.data.date}
            <Table bordered className="mt-2">
               <thead>
                  <tr className="text-end">
                     <th>नग/बोरा</th>
                     <th>कुल वजन</th>
                     <th>रेट</th>
                     <th>
                        <b>टोटल</b>
                     </th>
                  </tr>
               </thead>
               <tbody>
                  {props.data.transaction &&
                     props.data.transaction.map((txn) => {
                        if (txn.type === "DEBIT") {
                           return (
                              <tr key={txn._id} className="text-end">
                                 <td>{txn.numberofBags}</td>
                                 <td>{txn.totalweight}</td>
                                 <td>{txn.rate}</td>
                                 <td>{txn.transactionAmount}</td>
                              </tr>
                           );
                        }
                     })}
                  <tr>
                     <td colSpan={3} className="text-end">
                        <b>कुल योग</b>
                     </td>
                     <td colSpan={1} className="text-end">
                        <b>{props.data.debitSum}</b>
                     </td>
                  </tr>
               </tbody>
            </Table>
         </div>
         <hr />
         <div>
            <Table>
               <tbody>
                  <tr>
                     <td className="fill-row">
                        <b>
                           ख़रीददारी का कुल योग + पुराना बचा बैलेंस (कुल देनदारी)
                        </b>
                     </td>
                     <td className="text-end">
                        <b>
                           {Math.abs(props.data.debitSum -
                              props.data.debitSum * 2 +
                              props.data.oldBalance)}
                        </b>
                     </td>
                  </tr>
                  <tr>
                     <td className="fill-row">
                        <b>कैश जमा किया गया (-)</b>
                     </td>
                     <td className="text-end">
                        <b>{props.data.creditSum}</b>
                     </td>
                  </tr>
                  <tr>
                     <td className="fill-row p-2">
                        <b>आज तक की कुल बाक़ाया देनदारी </b>
                     </td>
                     <td className="text-end">
                        <b>
                           {Math.abs (props.data.debitSum -
                              props.data.debitSum * 2 + props.data.oldBalance +
                              props.data.creditSum)}
                        </b>
                     </td>
                  </tr>
               </tbody>
            </Table>
            <div className="text-end pt-4">
               <span>हस्ताक्षर</span>
            </div>
         </div>
      </div>
   );
});

export default PurchaserBill;
