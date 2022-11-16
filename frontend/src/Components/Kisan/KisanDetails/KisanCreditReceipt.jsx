import React from "react";
import { Table } from "reactstrap";
import { dateConverter } from "../../../Utility/utility";
const Kisancreditreceipt = React.forwardRef((props, ref) => {
    console.log("props===========", props);
   return (
      <div ref={ref} className="mt-3 ms-5 me-5 mb-3">
         <h6 className="text-center text-success">|| श्री गुरु कृपा ||</h6>
         <h3 className="text-center text-danger text-shadow-im">IM</h3>
         <h5 className="text-center text-danger text-shadow-im underline m-2">
            <u className="company-heading">महाराज वेजिटेबल कंपनी</u>
         </h5>
         <h6 className="text-center text-success border-bottom pb-2">
            धनिया, टमाटर, मटर एवं सब्जी के आढ़ती{" "}
         </h6>
         <h6 className="text-center text-danger border-bottom pb-2">
            <b>दु. न. 35 कृषि उपज मंडी, जबलपुर (म. प्र.)  |  मो. 9300933117</b>
         </h6>

          {props.data.type != "ADVANCESETTLEMENT" &&
             <div className="">
               <div className="ps-1 border-bottom">
                  <Table size="sm" borderless>
                     <tbody>
                        <tr>
                           <th>नाम</th>
                           <td>{props.data.name}</td>
                           <th>बिल क्रमांक </th>
                           <td>{props.data.txn_id}</td>
                        </tr>
                        <tr>
                           <th>पिता का नाम </th>
                           <td>{props.data.fatherName}</td>
                           <th>दिनांक </th>
                           <td>{props.data.txn_date}</td>
                        </tr>
                        <tr>
                           <th>पता</th>
                           <td>{props.data.address}</td>
                           <th>फ़ोन </th>
                           <td>{props.data.phone}</td>
                        </tr>
                     </tbody>
                  </Table>
               </div>
                <Table>
                   <tbody>
                      <tr>
                         <td className="fill-row">
                            <b>पुराने बिल से बची राशि</b>
                         </td>
                         <td className="pe-4 text-end">
                            <b>{props.data.txn_previousBillSettlementAmount}</b>
                         </td>
                      </tr>

                      {props.data.txn_grossTotal>0 && <tr>
                         <td colSpan={2}>
                            <b className="mt-2">खरीदारी का बेयौरा</b>
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
                                  <tr className="text-end">
                                     <td>{props.data.txn_numberofBags}</td>
                                     <td>{props.data.txn_totalWeight}</td>
                                     <td>{props.data.txn_rate}</td>
                                     <td>{props.data.txn_grossTotal}</td>
                                  </tr>
                                  <tr>
                                     <td colSpan={3} className="text-end">
                                        <b>खरीदारी का कुल योग</b>
                                     </td>
                                     <td colSpan={1} className="text-end">
                                        <b>{props.data.txn_grossTotal}</b>
                                     </td>
                                  </tr>
                               </tbody>
                            </Table>
                         </td>
                      </tr>
                      }
                      {props.data.txn_grossTotal>0 &&
                      <tr>
                         <td colSpan={2}>
                            <b className="mt-2">कटौती</b>
                            <Table bordered className="mt-2">
                               <thead>
                                  <tr className="text-end">
                                     <th>कमीशन</th>
                                     <th>हम्माली</th>
                                     <th>भाड़ा</th>
                                     <th>
                                        <b>टोटल</b>
                                     </th>
                                  </tr>
                               </thead>
                               <tbody>
                                  <tr className="text-end">
                                     <td>{(props.data.txn_commission / 100) * props.data.txn_grossTotal}</td>
                                     <td>{props.data.txn_hammali}</td>
                                     <td>{props.data.txn_bhada}</td>
                                     <td>-{props.data.txn_grossTotal - props.data.txn_netTotal}</td>
                                  </tr>
                                  <tr>
                                     <td colSpan={3} className="text-end">
                                        <b>कटौती के बाद कुल योग</b>
                                     </td>
                                     <td colSpan={1} className="text-end">
                                        <b>{props.data.txn_netTotal}</b>
                                     </td>
                                  </tr>
                               </tbody>
                            </Table>
                         </td>
                      </tr>
                      }
                       {props.data.txn_grossTotal>0 && <tr>
                         <td className="fill-row">
                            <b>पुराने बिल से बची राशि + कटौती के बाद कुल योग </b>
                         </td>
                         <td className="pe-4 text-end">
                            <b>
                               {props.data.txn_netTotal +
                                  props.data.txn_previousBillSettlementAmount}
                            </b>
                         </td>
                      </tr>}

                      <tr>
                         <td className="fill-row">
                            <b>समायोजन </b>
                         </td>
                         <td></td>
                      </tr>
                      <tr className="no-border">
                         <td className="fill-row p-2">
                            &nbsp; &nbsp;एडवांस का भुगतान (एडवांस की बकाया राशि:{" "}
                            {props.data.balance})
                         </td>
                         <td className="pe-4 text-end">{props.data.txn_advanceSettlement}</td>
                      </tr>
                      <tr>
                         <td className="fill-row p-2">
                            &nbsp; &nbsp;बकाया (अगले बिल में समायोजन हेतु){" "}
                         </td>
                         <td className="pe-4 text-end">{props.data.txn_carryForwardFromThisEntry}</td>
                      </tr>
                      <tr>
                         <td className="fill-row p-2">
                            &nbsp; &nbsp;<b>कैश भुगतान</b>
                         </td>
                         <td className="pe-4 text-end">
                            <b>{props.data.txn_paidToKisan}</b>
                         </td>
                      </tr>
                   </tbody>
                </Table>
                <div className="text-end pt-4">
                   <span>हस्ताक्षर</span>
                </div>
             </div>
          }
          {props.data.type == "ADVANCESETTLEMENT" &&
              <div className="text-center m-4">
                  <h4 className="text-center">-- एडवांस वापसी की रसीद --</h4>

                    <div className="text-start m-4">
                      <p className="receipt-paragraph">महाराज वेजिटेबल कंपनी द्वारा,आज दिनांक___<u><b>{props.data.date}</b></u>___ को श्री
                          ___<u><b>{props.data.name}</b></u>___ वल्द श्री ___<u><b>{props.data.fatherName}</b></u>___ से ___<u><b>₹{props.data.transactionAmount}/-</b></u>___ की राशि,
                          ___<u>नक़द/चैक/UPI</u>___ के माध्यम से प्राप्त की गयी।</p>
                    </div>
                  <div className="align-items-end d-flex flex-fill justify-content-end p-5">
                      <b>हस्ताक्षर </b>
                  </div>
              </div>

          }

      </div>
   );
});

export default Kisancreditreceipt;
