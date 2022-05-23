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
   Spinner,
} from "reactstrap";

import { useState } from "react";
import { Link, useHistory, useParams } from "react-router-dom";
import { getKisanByID } from "../../../Utility/utility";
import Kisanmoneysummary from "./KisanMoneySummary";
import { FormattedMessage } from "react-intl";

const Advancesettlementform = () => {
   const { id, type, transactionNumber } = useParams();
   const [comment, setComment] = useState("");
   const [amount, setAmount] = useState("");
   const [outstanding, setOutStanding] = useState("");
   const [isCommentValid, setIsCommentValid] = useState("PRISTINE");
   const [isAmountValid, setIsAmountValid] = useState("PRISTINE");
   const [kisan, setKisan] = useState({});
   const [hasError, setHasError] = useState(false);
   const [showAlert, setShowAlert] = useState(false);
   const [isLoading, setIsLoading] = useState(true);

   useEffect(() => {
      try {
         console.log(id, type, transactionNumber);
         const fetchData = async () => {
            setKisan(await getKisanByID(id));
            setIsLoading(false);
         };
         fetchData();
      } catch (e) {
        setIsLoading(false);
         throw new Error("Something Went Wrong ", e);
      }
   }, []);

   useEffect(() => {
      console.log("Kisan", kisan);
      if (transactionNumber && Object.keys(kisan).length > 0) {
         const transactionToedit = kisan.transactions.filter(
            (transac) => transac._id === transactionNumber.toString()
         )[0];

         console.log("transactionToedit", transactionToedit);
         setAmount(transactionToedit.transactionAmount);
         setComment(transactionToedit.comment);
         setOutStanding(transactionToedit.balanceAfterThisTransaction);
      }
   }, [kisan]);

   const isFormValid = () => {
      let isInvalid = false;
      if (amount.length <= 0) {
         setIsAmountValid("");
         isInvalid = true;
      } else if (Math.abs(kisan.balance) < amount) {
         setIsAmountValid("AMOUNTEXCEEDBALANCE");
         isInvalid = true;
      }
      if (comment.length <= 0) {
         setIsCommentValid("");
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

   const validateAmount = () => {
      if (Math.abs(kisan.balance) < amount) {
         setIsAmountValid("AMOUNTEXCEEDBALANCE");
      } else {
         setIsAmountValid("");
      }
   };

   const clear = () => {
      setAmount("");
      setComment("");

      setHasError(false);
      setIsCommentValid("PRISTINE");
      setIsAmountValid("PRISTINE");
   };

   const [isSubmitting, setIsSubmitting] = useState(false);

   const submit = (e) => {
      e.preventDefault();
      if (isFormValid()) {
         setIsSubmitting(true);
         const formData = {
            transaction: {
               balanceAfterThisTransaction:
                  parseInt(kisan.balance) + parseInt(amount),
               transactionAmount: parseInt(amount),
               type: "ADVANCESETTLEMENT",
               comment,
            },
         };
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
               console.log("Res", res);
               handleAlert();
               clear();
               setIsSubmitting(false);
            })
            .catch((error) => {
               console.log("is Here", error);
               setIsSubmitting(false);
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
         setIsSubmitting(true);
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
               console.log("Res", res);
               handleAlert();
               clear();
               setIsSubmitting(false);
            })
            .catch((error) => {
               setIsSubmitting(false);
               throw new error("Somethign Went Wrong", error);
            });
      } else {
         setHasError(true);
      }
   };

   return (
      <div>
         {isLoading ? (
            <div className="text-center text-primary pt-5">
               <Spinner />
            </div>
         ) : (
            <div className="mt-3">
               <Breadcrumb className="ps-3 mt-2">
                  <BreadcrumbItem>
                     <Link
                        className="link-no-decoration-black text-primary"
                        to="/"
                     >
                        Home
                     </Link>
                  </BreadcrumbItem>
                  <BreadcrumbItem>
                     <Link
                        className="link-no-decoration-black text-primary"
                        to="/kisan"
                     >
                        Kisan
                     </Link>
                  </BreadcrumbItem>
                  <BreadcrumbItem>
                     <Link
                        className="link-no-decoration-black text-primary"
                        to={`/kisanDetails/${kisan._id}`}
                     >
                        Details
                     </Link>
                  </BreadcrumbItem>
                  <BreadcrumbItem active>
                     Advance Settlement Form
                  </BreadcrumbItem>
               </Breadcrumb>
               <h2 className="text-center text-secondary mt-3 font-15">
                  <FormattedMessage id="depositAdvanceKisanButtonText" />
               </h2>
               <div>
                  <div>
                     <Kisanmoneysummary kisan={kisan} />
                  </div>
                  <div></div>
               </div>
               <Form onSubmit={(e) => submit(e)} className="p-3">
                  {/*  {hasError && <Alert color="danger"> FORM HAS AN ERROR </Alert>} */}
                  <h2 className="text-center text-secondary mt-3 font-15">
                     <FormattedMessage id="advanceDepositDetails" />
                  </h2>
                  {type === "edit" ? (
                     <h6>
                        <b>
                           <FormattedMessage id="balanceTextTillThisWithoutCurrency" />{" "}
                           :{" "}
                           <span className="text-primary">
                              <FormattedMessage id="currency" />{" "}
                              {outstanding - amount}
                           </span>
                        </b>
                     </h6>
                  ) : (
                     <b>
                        <FormattedMessage id="balanceTextWithoutCurrency" /> :{" "}
                        <span className="text-primary">
                           <FormattedMessage id="currency" /> {kisan.balance}
                        </span>
                     </b>
                  )}
                  <FormGroup className="mt-2">
                     <Label for="amount">
                        {" "}
                        <FormattedMessage id="advanceDepositAmount" />{" "}
                     </Label>
                     <Input
                        disabled={type === "edit" ? true : false}
                        invalid={
                           (amount <= 0 && isAmountValid === "") ||
                           isAmountValid === "AMOUNTEXCEEDBALANCE"
                        }
                        name="amount"
                        type="number"
                        value={amount.toString()}
                        onWheel={(e) => e.target.blur()}
                        onChange={(e) => amountChange(e)}
                        onBlur={(e) => validateAmount()}
                     />
                     <FormFeedback>
                        {isAmountValid === "AMOUNTEXCEEDBALANCE" ? (
                            <span><FormattedMessage id="advanceSCNBMTO" /> {Math.abs(kisan.balance)} </span>
                        ) : (
                           <FormattedMessage id="amountSBGTZ" />
                        )}
                     </FormFeedback>
                  </FormGroup>
                  <FormGroup className="mt-2">
                     <Label for="comment">
                        {" "}
                        <FormattedMessage id="comment" />
                     </Label>
                     <Input
                        invalid={comment.length <= 0 && isCommentValid === ""}
                        name="comment"
                        type="text"
                        value={comment}
                        onWheel={(e) => e.target.blur()}
                        onChange={(e) => commentChange(e)}
                     />
                     <FormFeedback>
                        {" "}
                        <FormattedMessage id="commentIsRequired" />
                     </FormFeedback>
                  </FormGroup>
                  {type === "add" ? (
                     <React.Fragment>
                        <Button
                           type="submit"
                           color="primary"
                           className="mt-3"
                           disabled={isSubmitting}
                        >
                           {isSubmitting && (
                              <span>
                                 <Spinner className="spinner-size-1" /> &nbsp;
                              </span>
                           )}
                           <FormattedMessage id="createEntryButtonText" />
                        </Button>
                        <Button
                           type="reset"
                           color="danger"
                           className="ms-1 mt-3"
                           onClick={clear}
                        >
                           <FormattedMessage id="resetButtonText" />
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
                        {isSubmitting && (
                           <span>
                              <Spinner className="spinner-size-1" /> &nbsp;
                           </span>
                        )}
                        <FormattedMessage id="editButtonText" />
                     </Button>
                  )}
                  {showAlert ? (
                     type === "add" ? (
                        <Alert className="mt-4">
                           <FormattedMessage id="advanceSettlementAddedSuccessfully" />
                        </Alert>
                     ) : (
                        <Alert className="mt-4">
                           <FormattedMessage id="advanceSettlementUpdatedSuccessfully" />
                        </Alert>
                     )
                  ) : (
                     ""
                  )}
               </Form>
            </div>
         )}
      </div>
   );
};

export default Advancesettlementform;
