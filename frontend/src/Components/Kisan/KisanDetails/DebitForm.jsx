import React, { useEffect } from "react";
import {
  Form,
  FormGroup,
  Label,
  Input,
  Button,
  FormFeedback,
  Alert,
  BreadcrumbItem,
  Breadcrumb,
  Spinner
} from "reactstrap";

import { useState } from "react";
import { Link, useHistory, useParams } from "react-router-dom";
import { formatDate, getKisanByID, getTodaysFormattedDate } from "../../../Utility/utility";
import Kisanmoneysummary from "./KisanMoneySummary";
import { FormattedMessage } from "react-intl";
import "../../../Utility/creditFormSwitch.css"


const Debitform = () => {
  const { id, type, transactionNumber } = useParams();
  const [comment, setComment] = useState("");
  const [amount, setAmount] = useState("");
  const [isCommentValid, setIsCommentValid] = useState("PRISTINE");
  const [isAmountValid, setIsAmountValid] = useState("PRISTINE");
  const [kisan, setKisan] = useState({});
  const [hasError, setHasError] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [backDate, setBackDate] = useState("");
  const [creationDate, setCreationDate] = useState("");
  const [billDate, setBillDate] = useState(formatDate(new Date()));
  const [isDateEditable, setIsDateEditable] = useState(false);
  const [isBillDateValid, setIsBillDateValid] = useState("PRISTINE");

  useEffect(() => {
    try {
      console.log(id, type, transactionNumber);
      const fetchData = async () => {
        setKisan(await getKisanByID(id));
      };
      fetchData();
    } catch (e) {
      throw new Error("Something Went Wrong ", e);
    }
  }, []);

  useEffect(() => {
    if (!isDateEditable) {
       billDateChange({ target: { value: getTodaysFormattedDate() } })
    }
    if(isDateEditable){
      setBillDate(formatDate(new Date(),1))
    }
 }, [isDateEditable]);
  useEffect(() => {
    if (transactionNumber && Object.keys(kisan).length > 0) {
      const transactionToedit = kisan.transactions.filter(
        (transac) => transac._id === transactionNumber.toString()
      )[0];

      console.log("transactionToedit", transactionToedit);
      setAmount(transactionToedit.transactionAmount);
      setComment(transactionToedit.comment);
      if (transactionToedit.backDate) {
        setCreationDate(transactionToedit.creationDate)
        setBackDate(transactionToedit.backDate)
     }
     setBillDate(formatDate(transactionToedit.date))
    }
  }, [kisan]);
  const billDateChange = (e) => {
    if (type === "edit") {
       setBillDate(e.target.value);
       setIsBillDateValid("");
    } else {
       if (e.target.value !== getTodaysFormattedDate()) {
          let hasError = false;
          //Check if Kisan has transactions after this date.
          if (hasError === false) {
             if (kisan.transactions && kisan.transactions.length > 0) {
                const latestKisanTransactionDate = getLatestKisanTransactionDate();
                if (new Date(latestKisanTransactionDate) > new Date(e.target.value)) {
                   setIsBillDateValid("HASKISANTRANSACTIONPOSTTHISDATE");
                   setBillDate(e.target.value);
                }else {
                   setBillDate(e.target.value);
                   setIsBillDateValid("");
                }
             } else {
                setBillDate(e.target.value);
                setIsBillDateValid("");
             }
          }
       }
       if (e.target.value === getTodaysFormattedDate()) {
          setBillDate(e.target.value);
          setIsBillDateValid("");
       }
    }
 };
 const getLatestKisanTransactionDate = () => {
    let lastTransactionIndex = kisan.transactions.length - 1
    let lastTransaction = kisan.transactions[lastTransactionIndex]
    let lastTransactionDate = lastTransaction.date;
    let jsdateString = new Date(lastTransactionDate)
    let kisanLatestTransactionDate = jsdateString.toISOString().split('T')[0]
    return kisanLatestTransactionDate;
 }

 const handleEditDateEnabler = () => {
    setIsDateEditable((isDateEditable) => !isDateEditable);
 };
  const isFormValid = () => {
    let isInvalid = false;
    if (comment.length <= 0) {
      setIsCommentValid("");
      isInvalid = true;
    }
    if (amount.length <= 0) {
      setIsAmountValid("");
      isInvalid = true;
    }
    if (isBillDateValid !== "" && isBillDateValid !== "PRISTINE") {
      isInvalid = true;
   }

    return isInvalid ? false : true;
  };
  const history = useHistory();
  const commentChange = (e) => {
    setComment(e.target.value);
    setIsCommentValid("");
  };
  const amountChange = (e) => {
    setAmount(e.target.value);
    setIsAmountValid("");
  };

  const clear = () => {
    setAmount("");
    setComment("");

    setHasError(false);
    setIsCommentValid("PRISTINE");
    setIsAmountValid("PRISTINE");
    setIsBillDateValid("PRISTINE")
  };
  const [isSubmitting, setIsSubmitting] = useState(false);
  const submit = (e) => {
    e.preventDefault();
    if (isFormValid()) {
      setIsSubmitting(true)
      const formData = {
        transaction: {
          balanceAfterThisTransaction: kisan.balance + (amount - amount * 2),
          transactionAmount: amount - amount * 2,
          type: "DEBIT",
          comment,
        },
      };
      if ((isBillDateValid === "" || isBillDateValid === "PRISTINE") && billDate !== getTodaysFormattedDate() && isDateEditable) {
        const backDateHours = new Date().getHours()
        const backDateMinutes = new Date().getMinutes()
        const backDateSeconds = new Date().getSeconds()
        formData.transaction["backDateHours"] = backDateHours;
        formData.transaction["backDateMinutes"] = backDateMinutes;
        formData.transaction["backDateSeconds"] = backDateSeconds;
        formData.transaction["backDate"] = billDate;
     }
      fetch(`/kisan/AddTransaction/${id}`, {
        method: "POST",
        body: JSON.stringify(formData),
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      })
      .then((res) => res.json())
      .then((res) => {
        handleAlert();
        clear();
        setIsSubmitting(false)
      })
      .catch((error) => {
          setIsSubmitting(false)
          throw new error("Somethign Went Wrong", error);
        });
    } else {
      setHasError(true);
    }
  };

  const handleAlert = () => {
    setShowAlert(true);
    setTimeout(() => {
      setShowAlert(false);
      history.push(`/kisanDetails/${id}`);
    }, 2000);
  };

  const handleEdit = () => {
    if (isFormValid()) {
      setIsSubmitting(true)
      const formData = {
        transactionNumber,
        comment,
      };
      fetch(`/kisan/editTransaction/${id}`, {
        method: "POST",
        body: JSON.stringify(formData),
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      })
        .then((res) => res.json())
        .then((res) => {
          handleAlert();
          clear();
          setIsSubmitting(false)
        })
        .catch((error) => {
          setIsSubmitting(false)
          throw new error("Somethign Went Wrong", error);
        });
    } else {
      setHasError(true);
    }
  };


  return (
    <div className="mt-3 font-10">
      <Breadcrumb className="ps-3 mt-2">
        <BreadcrumbItem>
          <Link className="link-no-decoration-black text-primary" to="/">
            Home
          </Link>
        </BreadcrumbItem>
        <BreadcrumbItem>
          <Link className="link-no-decoration-black text-primary" to="/kisan">
            Kisan
          </Link>
        </BreadcrumbItem>
        <BreadcrumbItem>
          <Link className="link-no-decoration-black text-primary" to={`/kisanDetails/${kisan._id}`}>
          Details
          </Link>
        </BreadcrumbItem>
        <BreadcrumbItem active>Debit Form</BreadcrumbItem>
      </Breadcrumb>
      <h2 className="text-center text-secondary mt-3 font-15"><FormattedMessage id="giveAdvanceKisanButtonText"/></h2>
      <div>
        <div>
          <Kisanmoneysummary kisan={kisan} />
        </div>
        <div></div>
      </div>
      <Form onSubmit={(e) => submit(e)} className="p-3">
        {/*  {hasError && <Alert color="danger"> FORM HAS AN ERROR </Alert>} */}
        <h2 className="text-center text-secondary mt-3 font-15"><FormattedMessage id="advanceDetails"/></h2>
        <div className="shadow p-3 mb-3">
                     <div>
                           {type === "edit" && backDate !== "" &&
                              <div className="text pt-2">
                                 <h3 className="text-dark font-15"><FormattedMessage id="backDatedEntryMsg" /></h3>
                                 <div className="text-secondary">
                                    <FormattedMessage id="actualBillCreationDateMsg" />{" : "} <span className="text-primary">{formatDate(creationDate).split("-").reverse().join("-")}</span>
                                 </div>
                              </div>}
                           {type === "edit" && backDate === "" &&
                              <div className="text pt-2">
                                 <h3 className="text-dark font-15"><FormattedMessage id="billDateSectionTitle" /></h3>
                              </div>}
                           {type !== "edit" && <div className="switch-container d-flex">
                              <h3 className="text-dark font-15"><FormattedMessage id="backDatedEntryMsg" /> ?{"  "}</h3>
                              <div className="flex-fill d-flex justify-content-end">
                                 <label className="toggle-switch">
                                    {"  "}<input
                                       type="checkbox"
                                       name="toggleSwitch"
                                       className="toggle-switch__checkbox"
                                       id="myToggleSwitch"
                                       onChange={handleEditDateEnabler}
                                       checked={isDateEditable}
                                    />
                                    <span className="toggle-switch__label">
                                       <span className="toggle-switch__inner"></span>
                                    </span>
                                 </label>
                              </div>
                           </div>
                           }
                           <FormGroup className="mt-2">
                        {<Label for="billDate">
                           <FormattedMessage id="entryDateLabel" />
                        </Label>}
                        <Input
                           invalid={isBillDateValid !== "PRISTINE" && isBillDateValid !== "" ? true : false}
                           name="billDate"
                           type="date"
                           value={billDate}
                           max={formatDate(new Date(), 1)}
                           disabled={!isDateEditable}
                           onChange={(e) => billDateChange(e)}
                        />{" "}
                        <FormFeedback>
                           {
                              isBillDateValid === "HASPURCHASERTRANSACTIONPOSTTHISDATE" ? <FormattedMessage id="purchaserHasTxnAfterThisDateMsg" /> :
                                 isBillDateValid === "HASKISANTRANSACTIONPOSTTHISDATE" ? <FormattedMessage id="kisanHasTxnAfterThisDateMsgForEntry" /> : "invalid"
                           }
                        </FormFeedback>
                     </FormGroup>
                        </div>
                  </div>
                  <div className="shadow p-3 mb-3">
        <FormGroup className="mt-2">
          <Label for="amount"> <FormattedMessage id="advanceDebited" />{" "}<FormattedMessage id="currencyWithBracket" /></Label>
          <Input
            disabled={type === "edit" ? true : false}
            invalid={amount <= 0 && isAmountValid === ""}
            name="amount"
            type="number"
            value={amount.toString()}
            onWheel={(e) => e.target.blur()}
            onChange={(e) => amountChange(e)}
          />
          <FormFeedback> <FormattedMessage id="amountSBGTZ"/></FormFeedback>
        </FormGroup>
        <FormGroup className="mt-2">
          <Label for="comment"> <FormattedMessage id="comment"/></Label>
          <Input
            invalid={comment.length <= 0 && isCommentValid === ""}
            name="comment"
            type="text"
            value={comment}
            onWheel={(e) => e.target.blur()}
            onChange={(e) => commentChange(e)}
          />
          <FormFeedback> <FormattedMessage id="commentIsRequired"/></FormFeedback>
        </FormGroup>
                    
                    </div>       
        {type === "add" ? (
          <React.Fragment>
            <Button type="submit" color="primary" className="mt-3" disabled={isSubmitting}>
            {isSubmitting &&( <span><Spinner className="spinner-size-1"/> &nbsp;</span> )}<FormattedMessage id="createEntryButtonText" />
            </Button>
            <Button
              type="reset"
              color="danger"
              className="ms-1 mt-3"
              onClick={clear}
            >
              <FormattedMessage id="resetButtonText"/>
            </Button>
          </React.Fragment>
        ) : (
          <Button
            type="button"
            color="primary"
            className="mt-3"
            onClick={handleEdit}
            disabled={isSubmitting}
          >
            {isSubmitting &&( <span><Spinner className="spinner-size-1"/> &nbsp;</span> )}<FormattedMessage id="editButtonText"/>
          </Button>
        )}
        {showAlert ? (
            type === "add" ? (
              <Alert className="mt-4">
                  <FormattedMessage id="entryAddSuccessMsg" />
              </Alert>
            ) : (
              <Alert className="mt-4">
                  <FormattedMessage id="entryEditSuccessMsg" />
              </Alert>
            )
        ) : (
            ""
        )}
      </Form>
    </div>
  );
};

export default Debitform;
