import { getPurchaserById } from "../../Utility/utility";
import Purchasersummary from "./PurchaserSummary";
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
import { FormattedMessage } from "react-intl";



const Purchasercreditform = () => {
  const { id, type, transactionNumber } = useParams();
  const [comment, setComment] = useState("");
  const [amount, setAmount] = useState("");
  const [isCommentValid, setIsCommentValid] = useState("PRISTINE");
  const [isAmountValid, setIsAmountValid] = useState("PRISTINE");
  const [purchaser, setPurchaser] = useState({});
  const [hasError, setHasError] = useState(false);
  const [showAlert, setShowAlert] = useState(false);

  useEffect(() => {
    try {
      console.log(id, type, transactionNumber);
      const fetchData = async () => {
        setPurchaser(await getPurchaserById(id));
      };
      fetchData();
    } catch (e) {
      throw new Error("Something Went Wrong ", e);
    }
  }, []);

  useEffect(() => {
    if (transactionNumber && Object.keys(purchaser).length > 0) {
      const transactionToedit = purchaser.transactions.filter(
        (transac) => transac._id === transactionNumber.toString()
      )[0];

      console.log("transactionToedit", transactionToedit);
      setAmount(transactionToedit.transactionAmount);
      setComment(transactionToedit.comment);
    }
  }, [purchaser]);

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
  };
  const [isSubmitting, setIsSubmitting] = useState(false)
  const submit = (e) => {
    e.preventDefault();
    if (isFormValid()) {
      setIsSubmitting(true)
      const formData = {
        transaction: {
          transactionAmount: parseInt(amount),
          type: "CREDIT",
          comment,
        },
      };
      fetch(`/purchaser/AddCreditTransaction/${id}`, {
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
          setIsSubmitting(false)
        })
        .catch((error) => {
          console.log("is Here", error);
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
      history.push(`/purchaserDetails/${id}`);
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
          console.log("Res", res);
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
    <div>
      <Breadcrumb className="ps-3 mt-3">
        <BreadcrumbItem>
          <Link className="link-no-decoration-black text-primary" to="/">
            Home
          </Link>
        </BreadcrumbItem>
        <BreadcrumbItem>
          <Link className="link-no-decoration-black text-primary" to="/purchaser">
            Purchaser
          </Link>
        </BreadcrumbItem>
        <BreadcrumbItem>
          <Link
            className="link-no-decoration-black text-primary"
            to={`/purchaserDetails/${purchaser._id}`}
          >
            Details
          </Link>
        </BreadcrumbItem>
        <BreadcrumbItem active>Purchaser Credit Form</BreadcrumbItem>
      </Breadcrumb>
      <h2 className="text-center text-secondary mt-3 font-13">
        <FormattedMessage id="purchaserPaymentEntryButtonText" />
      </h2>
      <div>
        <div>
          <Purchasersummary purchaser={purchaser} />
        </div>
        <div></div>
      </div>
      <Form onSubmit={(e) => submit(e)} className="p-3 font-10">
        {/*  {hasError && <Alert color="danger"> FORM HAS AN ERROR </Alert>} */}
        <h2 className="text-center text-secondary mt-3 font-13">
          <FormattedMessage id="purchaserPaymentFormTitle" />
        </h2>
        <FormGroup className="mt-2">
          <Label for="amount">
             <FormattedMessage id="paymentAmount" />
          </Label>
          <Input
            disabled={type === "edit" ? true : false}
            invalid={amount <= 0 && isAmountValid === ""}
            name="amount"
            type="number"
            className="font-10"
            value={amount.toString()}
            onWheel={(e) => e.target.blur()}
            onChange={(e) => amountChange(e)}
          />
          <FormFeedback>
            {" "}
            <FormattedMessage id="amountSBGTZ" />
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
            className="font-10"
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
            <Button type="submit" color="primary" className="mt-3 font-10" disabled={isSubmitting}>
            {isSubmitting &&( <span><Spinner className="spinner-size-1"/> &nbsp;</span> )}<FormattedMessage id="createEntryButtonText" />
            </Button>
            <Button
              type="reset"
              color="danger"
              className="ms-1 mt-3 font-10"
              onClick={clear}
            >
              <FormattedMessage id="resetButtonText" />
            </Button>
          </React.Fragment>
        ) : (
          <Button
            type="button"
            color="primary"
            className="mt-3 font-10"
            onClick={handleEdit}
            disabled={isSubmitting}
          >
            {isSubmitting &&( <span><Spinner className="spinner-size-1"/> &nbsp;</span> )}<FormattedMessage id="editButtonText" />
          </Button>
        )}
        {showAlert ? (
          type === "add" ? (
            <Alert className="mt-4 font-10">Credit Entry been added successfully</Alert>
          ) : (
            <Alert className="mt-4 font-10">
              Credit Entry has been Edited successfully
            </Alert>
          )
        ) : (
          ""
        )}
      </Form>
    </div>
  );

};

export default Purchasercreditform;
