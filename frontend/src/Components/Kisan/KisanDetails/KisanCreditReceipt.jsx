import React from "react";
import { Table } from "reactstrap";
import { dateConverter } from "../../../Utility/utility";
import { FormattedMessage } from "react-intl";
const Kisancreditreceipt = React.forwardRef((props, ref) => {
   console.log("props===========", props);
   return (

      <div ref={ref} className="mt-3 ms-5 me-5 mb-3">
         <div className="text-center">
            <h6 className="text-success">|| श्री गुरु कृपा ||</h6>
            <h3 className="text-danger text-shadow-im">IM</h3>

            <h5 className="text-danger text-shadow-im underline m-2">
               <u className="company-heading">महाराज वेजिटेबल कंपनी</u>
            </h5>
            <h6 className="text-success border-bottom pb-2">
               धनिया, टमाटर, मटर एवं सब्जी के आढ़ती{" "}
            </h6>
            <h6 className="text-danger border-bottom pb-2">
               <b>दु. न. 35 कृषि उपज मंडी, जबलपुर (म. प्र.)  |  मो. 9300933117</b>
            </h6>
         </div>
         {props.data.type != "ADVANCESETTLEMENT" &&
            <div>
               <div>
                  <Table borderless className="receipt-table">
                     <tbody>
                        <tr>
                           <th>नाम :</th>
                           <td>{props.data.name}</td>
                           <th>बिल क्र. :</th>
                           <td>{props.data.txn_id}</td>
                        </tr>
                        <tr>
                           <th>फ़ोन :</th>
                           <td>{props.data.phone}</td>
                           <th>दिनांक :</th>
                           <td>{props.data.txn_date}</td>
                        </tr>
                        <tr>
                           <th>पता :</th>
                           <td>{props.data.address}</td>
                        </tr>
                     </tbody>
                  </Table>
                  <Table className="receipt-table">
                     <tbody>
                        {props.data.txn_grossTotal > 0 &&
                           <tr>
                              <td colSpan={2} className="no-bottom-border">
                                 <Table bordered className="receipt-table">
                                    <thead></thead>
                                    <tbody>
                                       <tr>
                                          <th colSpan={4} className="text-center">** बिल **</th>
                                       </tr>
                                       <tr className="table-light">
                                          <td colSpan={4} className="">
                                             <b>1. ट्रेडिंग का विवरण</b>
                                          </td>
                                       </tr>
                                       <tr className="text-end">
                                          <td>नग/बोरा ({props.data.txn_itemType})</td>
                                          <td>कुल वजन</td>
                                          <td>रेट</td>
                                          <td>टोटल</td>
                                       </tr>
                                       <tr className="text-end">
                                          <td>{props.data.txn_numberofBags}</td>
                                          <td>{props.data.txn_totalWeight}</td>
                                          <td>{props.data.txn_rate}</td>
                                          <td>{props.data.txn_grossTotal}</td>
                                       </tr>
                                       <tr>
                                          <th colSpan={3} className="text-end">
                                             ट्रेडिंग टोटल (उपज का कुल मूल्य) (₹)
                                          </th>
                                          <td colSpan={1} className="text-end">
                                             <b>{props.data.txn_grossTotal}</b>
                                          </td>
                                       </tr>
                                       <tr className="table-light">
                                          <td colSpan={4} className="">
                                             <b>2. कटौती</b>
                                          </td>
                                       </tr>
                                       <tr className="text-end">
                                          <td>कमीशन</td>
                                          <td>हम्माली</td>
                                          <td>भाड़ा</td>
                                          <td>टोटल</td>
                                       </tr>
                                       <tr className="text-end">
                                          <td>{(props.data.txn_commission / 100) * props.data.txn_grossTotal}</td>
                                          <td>{props.data.txn_hammali}</td>
                                          <td>{props.data.txn_bhada}</td>
                                          <td>-{props.data.txn_grossTotal - props.data.txn_netTotal}</td>
                                       </tr>
                                       <tr>
                                          <th colSpan={3} className="text-end">
                                             बिल टोटल (कटौती के बाद) (₹)
                                          </th>
                                          <td colSpan={1} className="text-end">
                                             <b>{props.data.txn_netTotal}</b>
                                          </td>
                                       </tr>
                                       <tr className="table-light">
                                          <td colSpan={4} className="">
                                             <b>3. समायोजन/हिसाब</b>
                                          </td>
                                       </tr>
                                       <tr>
                                          <td colSpan={3} className="text-end">
                                             एडवांस चुकाया (₹)
                                          </td>
                                          <td colSpan={1} className="text-end">
                                             {props.data.txn_advanceSettlement}
                                          </td>
                                       </tr>
                                       <tr>
                                          <th colSpan={3} className="text-end">नगद भुगतान (₹)</th>
                                          <th colSpan={1} className="text-end">{props.data.txn_paidToKisan}</th>
                                       </tr>
                                       <tr>
                                          <td colSpan={3} className="text-end">
                                             इस बिल का बकाया भुगतान (₹)
                                          </td>
                                          <td colSpan={1} className="text-end">
                                             {props.data.txn_carryForwardFromThisEntry - props.data.txn_previousBillSettlementAmount}
                                          </td>
                                       </tr>
                                    </tbody>
                                 </Table>
                              </td>
                           </tr>
                        } : {
                           <tr>
                              <td colSpan={2} className="no-bottom-border">
                                 <Table bordered className="receipt-table">
                                    <thead></thead>
                                    <tbody>
                                       <tr>
                                          <th colSpan={4} className="text-center">** पेमेंट बिल **</th>
                                       </tr>
                                       <tr className="table-light">
                                          <td colSpan={4} className="text">
                                             <b>बकाया एडवांस </b>
                                          </td>
                                       </tr>
                                       <tr>
                                          <td colSpan={3} className="text-end">
                                             इस बिल से पहले का कुल बकाया एडवांस (₹)
                                          </td>
                                          <td colSpan={1} className="text-end">
                                             {-1 * (props.data.balance - props.data.txn_advanceSettlement)}
                                          </td>
                                       </tr>
                                       <tr className="table-light">
                                          <td colSpan={4} className="text">
                                             <b>बकाया पेमेंट </b>
                                          </td>
                                       </tr>
                                       <tr>
                                          <td colSpan={3} className="text-end">
                                             इस बिल से पहले की कुल बकाया पेमेंट (₹)
                                          </td>
                                          <td colSpan={1} className="text-end">
                                             {props.data.txn_previousBillSettlementAmount}
                                          </td>
                                       </tr>
                                       <tr className="table-light">
                                          <td colSpan={4} className="">
                                             <b>समायोजन/हिसाब</b>
                                          </td>
                                       </tr>
                                       <tr>
                                          <td colSpan={3} className="text-end">
                                             एडवांस चुकाया (₹)
                                          </td>
                                          <td colSpan={1} className="text-end">
                                             {props.data.txn_advanceSettlement}
                                          </td>
                                       </tr>
                                       <tr>
                                          <td colSpan={3} className="text-end">नगद भुगतान (₹)</td>
                                          <td colSpan={1} className="text-end">{props.data.txn_paidToKisan}</td>
                                       </tr>
                                       <tr>
                                          <th colSpan={3} className="text-end">
                                             इस बिल की कुल पेमेंट (₹)
                                          </th>
                                          <th colSpan={1} className="text-end">
                                             {props.data.txn_advanceSettlement + props.data.txn_paidToKisan}
                                          </th>
                                       </tr>
                                    </tbody>
                                 </Table>
                              </td>
                           </tr>
                        }
                     </tbody>
                  </Table>
               </div>
               <div className="receipt-table">
                  <ul>
                     <li>अगले बिल के लिए बकाया एडवांस = ({-1 * (props.data.balance - props.data.txn_advanceSettlement)} - {props.data.txn_advanceSettlement}) 
                     = ₹ {-1 * props.data.balance}</li>
                     <li>अगले बिल के लिए बकाया पेमेंट = ({props.data.txn_previousBillSettlementAmount} - {props.data.txn_paidToKisan}) 
                     = ₹ {props.data.txn_carryForwardFromThisEntry}</li>
                  </ul>
               </div>
               <div className="text-end pt-4">
                  <span>हस्ताक्षर</span>
               </div>
            </div>
         }
         {props.data.type == "ADVANCESETTLEMENT" &&
            <div className="text-center m-4">
               <h4 className="text-center">** एडवांस वापसी की रसीद **</h4>
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
