import React, { Fragment } from "react";
import { useState } from "react";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Button, Table, Spinner } from "reactstrap";
import { useReactToPrint } from "react-to-print";
import Kisanreceipt from "./KisanReceipt";
import { useRef } from "react";
import { dateConverter } from "../../../Utility/utility";
import Kisancreditreceipt from "./KisanCreditReceipt";
import { FormattedMessage } from "react-intl";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { solid, regular, brands } from '@fortawesome/fontawesome-svg-core/import.macro'
import { Tooltip } from 'reactstrap';

const Kisantransactionstable = ({ kisan, updateKisan }) => {
  /* const [balances, setBalances] = useState([]); */
  /* FOR TOOL TIP */
  const [printToolTip, setPrintToolTip] = useState(false);
  const [editToolTip, setEditTooltip] = useState(false);
  const [detailsTooltip, setDetailsTooltip] = useState(false);
  const [printCredit, setPrintCredit] = useState(false);
  const [editAdvance, setEditAdvance] = useState(false);
  const [advanceEntryPrint, setAdvanceEntryPrint] = useState(false);
  /* const toggle = () => {
    setTooltipOpen(!tooltipOpen);
  }   */
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false)
  const [transaction, setTransaction] = useState({});
 
  const componentRef = useRef();
  const creditPrintRef = useRef();
  const print = (currentTransaction) => {
    setTransaction({
      address: kisan.address,
      balance: kisan.balance,
      fatherName: kisan.fatherName,
      name: kisan.name,
      phone: kisan.phone,
      date: dateConverter(currentTransaction.date),
      transactionAmount: currentTransaction.transactionAmount,
      type: currentTransaction.type,
    });
  };
  const printCreditEntry = (currentTransaction) => {
    setTransaction({
      address: kisan.address,
      balance: kisan.balance,
      fatherName: kisan.fatherName,
      name: kisan.name,
      phone: kisan.phone,
      txn_id: currentTransaction._id,
      txn_date: dateConverter(currentTransaction.date),
      txn_previousBillSettlementAmount:
        currentTransaction.previousBillSettlementAmount,
      txn_numberofBags: currentTransaction.numberofBags,
      txn_totalWeight: currentTransaction.totalweight,
      txn_rate: currentTransaction.rate,
      txn_grossTotal: currentTransaction.grossTotal,
      txn_commission: currentTransaction.commission,
      txn_hammali: currentTransaction.hammali,
      txn_bhada: currentTransaction.bhada,
      txn_netTotal: currentTransaction.netTotal,
      txn_advanceSettlement: currentTransaction.advanceSettlement,
      txn_carryForwardFromThisEntry:
        currentTransaction.carryForwardFromThisEntry,
      txn_paidToKisan: currentTransaction.paidToKisan,
    });
  };
  useEffect(()=> {
    if(kisan && kisan.transactions){
      setIsLoading(false);
      setIsDeleting(false);
    }
  },[kisan])
  useEffect(() => {
    if (Object.keys(transaction).length > 0) {
      if (transaction && transaction.type === "DEBIT") {
        handlePrint();
      } else {
        handlePrintCreditEntry();
      }
    }
  }, [transaction]);
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });
  const handlePrintCreditEntry = useReactToPrint({
    content: () => creditPrintRef.current,
  });

  const deleteTransaction = (txn,kisanId) => {
    setIsDeleting(true);
    console.log("txn", txn)
    const formData = {
      kisanTxnId:txn._id,
      purchaserId:txn.purchaserId,
      purchaserTxnId:txn.purchaserTxnId,
      inventoryItemId: txn.inventoryItemId,
      inventoryTxnId:txn.inventoryTxnId,
    };
    fetch(`/kisan/DeleteTransacton/${kisanId}`, {
      method: "POST",
      body: JSON.stringify(formData),
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((res) => {
        console.log("Res", res);
        updateKisan();
      })
      .catch((error) => {
        console.log("is Here", error);
        setIsDeleting(false);
        throw new error("Somethign Went Wrong", error);
      });
  }

  const deleteTransactionAdvanceSettlement = (txn, kisanId) => {
    setIsDeleting(true);
    const formData = {
      kisanId:kisanId,
      transactionID: txn._id 
    };
    fetch(`/kisan/DeleteAdvanceSettlementTransaction`, {
      method: "POST",
      body: JSON.stringify(formData),
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    })
    .then((res) => res.json())
    .then((res) => {
      console.log("Res", res);
      updateKisan();
    })
    .catch((error) => {
      console.log("is Here", error);
      setIsDeleting(false);
      throw new error("Somethign Went Wrong", error);
    });
  }
  const deleteTransactionDebit = (txn, kisanId) => {
    setIsDeleting(true);
    console.log("is here")
    const formData = {
      kisanId:kisanId,
      transactionID: txn._id 
    };
    fetch(`/kisan/DeleteDebitTransaction`, {
      method: "POST",
      body: JSON.stringify(formData),
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    })
    .then((res) => res.json())
    .then((res) => {
      console.log("Res", res);
      updateKisan();
    })
    .catch((error) => {
      console.log("is Here", error);
      setIsDeleting(false);
      throw new error("Somethign Went Wrong", error);
    });
  }
  /*  useEffect(() => {
    let sum = 0;
    if (kisan && kisan.transactions) {
      const tempbalances = kisan.transactions.reverse().map((transaction) => {
        if (transaction.type === "DEBIT") {
          return (sum = sum + transaction.transactionAmount);
        } else {
          return (sum = sum + parseInt(transaction.advanceSettlement));
        }
      });
      setBalances(tempbalances.reverse());
    }
    console.log("balances", balances);
  }, [kisan]); */
  return (
    <div>
      {isLoading ? 
      <div className="text-center text-primary ">
        <Spinner />
      </div>
            
      :
      
      
      <Table striped bordered responsive size="sm" className="shadow font-10">
        <thead>
          <tr>
            <th>#</th>
            <th>
              <FormattedMessage id="date" />
            </th>
            <th>
              <FormattedMessage id="comment" />
            </th>
            <th>
              <FormattedMessage id="advanceDebited" />
            </th>
            <th>
              <FormattedMessage id="grossTotalWithCurrency" />
            </th>
            <th>
              <FormattedMessage id="billTotal" />
            </th>
            <th>
              <FormattedMessage id="advanceCredited" />
            </th>
            <th>
              <FormattedMessage id="cashPaid" />
            </th>
            <th>
              <FormattedMessage id="carryForward" />
            </th>
            <th>
              <FormattedMessage id="balance" />
            </th>
            <th>
              <FormattedMessage id="actions" />
            </th>
          </tr>
        </thead>
        <tbody>
          {kisan &&
            kisan.transactions &&
            kisan.transactions
              .sort((a, b) => new Date(b.date) - new Date(a.date))
              .map((transaction, index) => {
                return (
                  <tr key={index}>
                    <th scope="row">{index + 1}</th>
                    <td>{dateConverter(transaction.date)}</td>
                    <td>{transaction.comment}</td>
                    <td>
                      {transaction.type === "DEBIT"
                        ? transaction.transactionAmount
                        : ""}
                    </td>
                    <td>{transaction.grossTotal}</td>
                    <td>{transaction.netTotal}</td>

                    <td>
                      {transaction.type === "CREDIT"
                        ? transaction.advanceSettlement
                        : transaction.type === "ADVANCESETTLEMENT"
                        ? transaction.transactionAmount
                        : ""}
                    </td>

                    <td>{transaction.paidToKisan}</td>
                    <td>{transaction.carryForwardFromThisEntry}</td>
                    {/*  <td>{balances[index] <0 ? <span className="text-danger">{balances[index]}</span> : <span className="text-success">{balances[index]}</span> }</td> */}
                    <td>
                      <span
                        className={
                          transaction.balanceAfterThisTransaction < 0
                            ? "text-danger"
                            : "text-primary"
                        }
                      >
                        {transaction.balanceAfterThisTransaction}
                      </span>
                    </td>
                    <td>
                      {transaction.type === "DEBIT" ? (
                        <div className="d-flex">
                          <Button color="success" id="advanceEntryEdit" className="font-10">
                            <Link
                              className="link-no-decoration"
                              to={`/kisanDebitForm/${kisan._id}/edit/${transaction._id}`}
                            >
                              {/* <FormattedMessage id="editButtonText" /> */}
                              <FontAwesomeIcon  icon={solid('pen-to-square')} className="text-white"/>
                            </Link>
                            <Tooltip placement="left" isOpen={editAdvance} target="advanceEntryEdit" toggle={e => setEditAdvance(!editAdvance)}>
                              Edit
                            </Tooltip>
                          </Button>
                          <Button
                            className="ms-2 font-10"
                            color="primary"
                            id="advanceEntryPrint"
                            onClick={(e) => print(transaction)}
                          >
                            <Tooltip placement="top" isOpen={advanceEntryPrint} target="advanceEntryPrint" toggle={e => setAdvanceEntryPrint(!advanceEntryPrint)}>
                              Print
                            </Tooltip>
                            {/* <FormattedMessage id="printButtonText" /> */}
                            <FontAwesomeIcon icon={solid('print')} className="text-white"/>
                          </Button>
                          { index=== 0 && 
                            transaction.type === "DEBIT" && <div>
                              {isDeleting ? 
                                <Button color="danger" className="ms-2 "><Spinner className="spinner-size-1"/></Button> :
                                <Button color="danger" className="ms-2" onClick={e => deleteTransactionDebit(transaction,kisan._id)}><FontAwesomeIcon icon={solid('trash')} className="text-white"/></Button>
                              }
                            </div>
                          }
                        </div>
                      ) : transaction.type === "ADVANCESETTLEMENT" ? (
                        <div className="d-flex">
                          <Button color="success" id="edit">
                            <Link
                            className="link-no-decoration font-10"
                              to={`/kisanAdvanceSettlement/${kisan._id}/edit/${transaction._id}`}

                            >

                              {/* <FormattedMessage id="editButtonText" /> */}
                              <FontAwesomeIcon  icon={solid('pen-to-square')} className="text-white"/>
                            </Link>
                            <Tooltip  placement="left" isOpen={editToolTip} target="edit" toggle={e => setEditTooltip(!editToolTip)}>
                              Edit
                            </Tooltip>
                          </Button>

                          <Button
                            className="ms-2 font-10"
                            color="primary"
                            id="printAdvance"
                            onClick={(e) => print(transaction)}
                          >
                             <Tooltip placement="top" isOpen={printToolTip} target="printAdvance" toggle={e => setPrintToolTip(!printToolTip)}>
                              Print
                            </Tooltip>
                             <FontAwesomeIcon icon={solid('print')} className="text-white"/>
                          </Button>
                          { index===0 && 
                            transaction.type === "ADVANCESETTLEMENT" && <div>
                          {   isDeleting ? 
                                <Button color="danger" className="ms-2"><Spinner className="spinner-size-1"/></Button> : 
                                <Button color="danger" className="ms-2" onClick={e => deleteTransactionAdvanceSettlement(transaction,kisan._id)}><FontAwesomeIcon icon={solid('trash')} className="text-white"/></Button> 
                              }
                              </div>
                          }
                        </div>
                      ) : (
                        <div className="d-flex">
                          <Button color="secondary" id="details" className="font-10">
                            <Link
                              className="link-no-decoration"
                              to={`/kisanCreditForm/${kisan._id}/edit/${transaction._id}`}
                            > <FontAwesomeIcon  icon={solid('list-ul')} className="text-white"/>
                            </Link>
                          </Button>
                          <Tooltip hideArrow={false} placement="left" isOpen={detailsTooltip} target="details" toggle={e => setDetailsTooltip(!detailsTooltip)}>
                              Details
                            </Tooltip>
                          <Button
                            className="ms-2 font-10"
                            color="primary"
                            id="printCredit"
                            onClick={(e) => printCreditEntry(transaction)}
                          >
                            {/* <FormattedMessage id="printButtonText" /> */}
                            <FontAwesomeIcon icon={solid('print')} className="text-white"/>
                            <Tooltip hideArrow={false} placement="top" isOpen={printCredit} target="printCredit" toggle={e => setPrintCredit(!printCredit)}>
                              Print
                            </Tooltip>
                          </Button>
                          
                          { index===0 && transaction.type === "CREDIT" && <div>
                            {isDeleting? <Button color="danger" className="ms-2" >
                              <Spinner className="spinner-size-1"/>
                            </Button>:
                            <Button color="danger" className="ms-2" onClick={e => deleteTransaction(transaction,kisan._id)}>
                              <FontAwesomeIcon icon={solid('trash')} className="text-white"/>
                            </Button>
                            }
                          </div> 
                           }
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
        </tbody>
      </Table>
      }
      
      <div className="hide-till-print">
        <Kisanreceipt data={transaction} ref={componentRef} />
      </div>
      <div className="hide-till-print">
        <Kisancreditreceipt data={transaction} ref={creditPrintRef} />
      </div>
    </div>
  );
};

export default Kisantransactionstable;
