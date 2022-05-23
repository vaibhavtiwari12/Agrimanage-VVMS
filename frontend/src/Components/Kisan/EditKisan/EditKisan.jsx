import {
   Form,
   FormGroup,
   Label,
   Input,
   Button,
   FormFeedback,
   Alert,
   Spinner,
} from "reactstrap";
import { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import { FormattedMessage } from "react-intl";
import { getKisanByID } from "../../../Utility/utility";

const EditKisan = () => {
   const { id } = useParams();
   const [kisanDetails, setKisanDetails] = useState({});
   const [name, setName] = useState("");
   const [fatherName, setfatherName] = useState("");
   const [phone, setPhone] = useState("");
   const [address, setAddress] = useState("");
   const [isnameValid, setIsnameValid] = useState("PRISTINE");
   const [isfatherNameValid, setIsfatherNameValid] = useState("PRISTINE");
   const [isPhonePristine, setIsPhonePristine] = useState("PRISTINE");
   const [isAddressValid, setIsAddressValid] = useState("PRISTINE");
   const [hasError, setHasError] = useState(false);
   const [showAlert, setShowAlert] = useState(false);
   const [isSubmitting, setIsSubmitting] = useState(false);
   const [isLoading, setIsLoading] = useState(true);

   useEffect(() => {
      console.log(id);
      try {
         const fetchData = async () => {
            const details = await getKisanByID(id);
            if (Object.keys(details).length >> 0) {
               setName(details.name);
               setfatherName(details.fatherName);
               setPhone(details.phone);
               setAddress(details.address);
               setIsLoading(false);
            }
         };
         fetchData();
      } catch (e) {
         setIsLoading(false);
         throw new Error(
            "Something Went Wrong while fetching kisan Details ",
            e
         );
      }
   }, []);
   const isFormValid = () => {
      let isInvalid = false;
      if (name.length <= 0) {
         setIsnameValid("");
         isInvalid = true;
      }
      if (fatherName.length <= 0) {
         setIsfatherNameValid("");
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
   const fatherNameChange = (e) => {
      setfatherName(e.target.value);
      setIsfatherNameValid("");
   };

   const phoneChange = (e) => {
      if (e.target.value.length <= 10) {
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
      setfatherName("");
      setPhone("");
      setAddress("");
      setHasError(false);
      setIsfatherNameValid("PRISTINE");
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
            fatherName,
            phone,
            address,
            id,
         };
         fetch("/kisan/edit", {
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
         history.push("/kisan");
      }, 4000);
   };
   return (
      <div>
         {isLoading ? (
            <div className="text-center text-primary pt-5">
               <Spinner />
            </div>
         ) : (
            <Form onSubmit={(e) => submit(e)} className="p-3">
               {/*  {hasError && <Alert color="danger"> FORM HAS AN ERROR </Alert>}{" "} */}
               <h3 className="flex-fill d-flex justify-content-center">
                  {/* <FormattedMessage id="newKisanDeatils"/> */}
                  <FormattedMessage id="editKisan" />
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
                  <Label for="fatherName">
                     <FormattedMessage id="fatherName" />:
                  </Label>{" "}
                  <Input
                     invalid={
                        fatherName.length <= 0 && isfatherNameValid === ""
                     }
                     name="fatherName"
                     type="text"
                     value={fatherName}
                     onChange={(e) => fatherNameChange(e)}
                  />{" "}
                  <FormFeedback>
                     <FormattedMessage id="fatherNameIsRequired" />
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
                  {/* <FormattedMessage id="addNewKisanButtonText"/> */}
                  {isSubmitting && (
                     <span>
                        <Spinner className="spinner-size-1" /> &nbsp;
                     </span>
                  )}
                  <FormattedMessage id="editButtonText" />
               </Button>{" "}
               <Button
                  type="reset"
                  color="danger"
                  className="ms-1 mt-3"
                  onClick={clear}
               >
                  {" "}
                  <FormattedMessage id="resetButtonText" />{" "}
               </Button>{" "}
               {showAlert ? (
                  <Alert className="mt-4">
                     <FormattedMessage id="editKisanSuccessful" />
                  </Alert>
               ) : (
                  ""
               )}
            </Form>
         )}
      </div>
   );
};

export default EditKisan;
