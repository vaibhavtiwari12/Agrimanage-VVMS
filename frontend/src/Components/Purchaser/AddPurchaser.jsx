import React, { useState } from "react";
import { FormattedMessage } from "react-intl";
import { Link, useHistory } from "react-router-dom";
import {
    Form,
    FormGroup,
    Label,
    Input,
    Button,
    FormFeedback,
    Alert,
    Breadcrumb,
    BreadcrumbItem,
    Spinner,
  } from "reactstrap";
const AddPurchaser = () => {
  const [name, setName] = useState("");
  const [companyName, setcompanyName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [isnameValid, setIsnameValid] = useState("PRISTINE");
  const [iscompanyNameValid, setIscompanyNameValid] = useState("PRISTINE");
  const [isPhonePristine, setIsPhonePristine] = useState("PRISTINE");
  const [isAddressValid, setIsAddressValid] = useState("PRISTINE");
  const [hasError, setHasError] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isFormValid = () => {
    let isInvalid = false;
    if (name.length <= 0) {
      setIsnameValid("");
      isInvalid = true;
    }
    if (companyName.length <= 0) {
      setIscompanyNameValid("");
      isInvalid = true;
    }
    if (phone.length <= 0) {
      setIsPhonePristine("");
      isInvalid = true;
    }
    if (address.length <= 0) {
      setIsAddressValid("");
      isInvalid = true;
    }
    return isInvalid ? false : true;
  };
  const history = useHistory();
  const nameChange = (e) => {
    setName(e.target.value);
    setIsnameValid("");
  };
  const companyNameChange = (e) => {
    setcompanyName(e.target.value);
    setIscompanyNameValid("");
  };

  const phoneChange = (e) => {
    if(e.target.value.length<=10){
      setPhone(e.target.value);
      setIsPhonePristine("");
    }
  };
  const addressChange = (e) => {
    setAddress(e.target.value);
    setIsAddressValid("");
  };
  const clear = () => {
    setName("");
    setcompanyName("");
    setPhone("");
    setAddress("");
    setHasError(false);
    setIscompanyNameValid("PRISTINE");
    setIsnameValid("PRISTINE");
    setIsPhonePristine("PRISTINE");
    setIsAddressValid("PRISTINE");
  };
  const submit = (e) => {
    e.preventDefault();
    if (isFormValid()) {
      setIsSubmitting(true);
      const formData = {
        name,
        companyName,
        phone,
        address,
      };
      fetch("/purchaser/add", {
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
      history.push("/purchaser");
    }, 4000);
  };
  return (
    <div className="mt-3">
      <Breadcrumb className="ps-3 mt-2">
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
        <BreadcrumbItem active>Purchaser Form</BreadcrumbItem>
      </Breadcrumb>
    <Form onSubmit={(e) => submit(e)} className="p-3">
      {/*  {hasError && <Alert color="danger"> FORM HAS AN ERROR </Alert>}{" "} */}
      <h3 className="flex-fill d-flex justify-content-center">
        <FormattedMessage id="newPurchaserDeatils" />
      </h3>
      <FormGroup className="mt-2">
        <Label for="name">
          <FormattedMessage id="name" />:
        </Label>{" "}
        <Input
          invalid={name.length <= 0 && isnameValid === ""}
          name="name"
          type="text"
          value={name}
          onChange={(e) => nameChange(e)}
        />{" "}
        <FormFeedback>
          <FormattedMessage id="nameIsRequired" />
        </FormFeedback>{" "}
      </FormGroup>{" "}
      <FormGroup className="mt-2">
        <Label for="companyName">
          <FormattedMessage id="companyName" /> :
        </Label>{" "}
        <Input
          invalid={companyName.length <= 0 && iscompanyNameValid === ""}
          name="companyName"
          type="text"
          value={companyName}
          onChange={(e) => companyNameChange(e)}
        />{" "}
        <FormFeedback>
            <FormattedMessage id="companyNameIsRequired" />
        </FormFeedback>{" "}
      </FormGroup>{" "}
      <FormGroup className="mt-2">
        <Label for="phone">
          <FormattedMessage id="phone" />:
        </Label>{" "}
        <Input
          invalid={phone.length <= 0 && isPhonePristine === ""}
          name="phone"
          type="number"
          value={phone}
          onChange={(e) => phoneChange(e)}
        />{" "}
        <FormFeedback>
          <FormattedMessage id="phoneIsRequired" />
        </FormFeedback>{" "}
      </FormGroup>{" "}
      <FormGroup className="mt-2">
        <Label for="address">
          <FormattedMessage id="address" />:
        </Label>{" "}
        <Input
          invalid={address.length <= 0 && isAddressValid === ""}
          name="address"
          type="text"
          value={address}
          onChange={(e) => addressChange(e)}
        />{" "}
        <FormFeedback>
          <FormattedMessage id="addressIsRequired" />
        </FormFeedback>{" "}
      </FormGroup>{" "}
      <Button type="submit" color="primary" className="mt-3" disabled={isSubmitting}>
      {isSubmitting &&( <span><Spinner className="spinner-size-1"/> &nbsp;</span> )}<FormattedMessage id="addPurchaserButtonText" />
      </Button>
      <Button type="reset" color="danger" className="ms-1 mt-3" onClick={clear}>
        <FormattedMessage id="resetButtonText" />
      </Button>{" "}
      {showAlert ? (
        <Alert className="mt-4"><FormattedMessage id="purchaser_addSuccessful" /></Alert>
      ) : (
        ""
      )}
    </Form>
    </div>
  );
};

export default AddPurchaser;
