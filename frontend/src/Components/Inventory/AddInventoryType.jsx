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
} from "reactstrap";
import { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { FormattedMessage } from "react-intl";
import { Fragment } from "react";

const AddInventoryType = () => {
   const [name, setName] = useState("");
   const [isnameValid, setIsnameValid] = useState("PRISTINE");
   const [hasError, setHasError] = useState(false);
   const [showAlert, setShowAlert] = useState(false);

   const isFormValid = () => {
      let isInvalid = false;
      if (name.length <= 0) {
         setIsnameValid("");
         isInvalid = true;
      }
      return isInvalid ? false : true;
   };
   const history = useHistory();
   const nameChange = (e) => {
      setName(e.target.value);
      setIsnameValid("");
   };

   const clear = () => {
      setName("");
      setIsnameValid("PRISTINE");
   };
   const submit = (e) => {
      e.preventDefault();
      if (isFormValid()) {
         const formData = {
            name,
         };
         fetch("/inventory/add", {
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
            })
            .catch((error) => {
               console.log("is Here", error);
               throw new error("Something Went Wrong", error);
            });
      } else {
         setHasError(true);
      }
   };

   const handleAlert = () => {
      setShowAlert(true);
      setTimeout(() => {
         setShowAlert(false);
         history.push("/inventory");
      }, 2000);
   };
   return (
      <Fragment>
         <Breadcrumb className="ps-3 mt-3">
            <BreadcrumbItem>
               <Link className="link-no-decoration-black text-primary" to="/">
                  Home
               </Link>
            </BreadcrumbItem>
            <BreadcrumbItem>
               <Link className="link-no-decoration-black text-primary" to="/inventory">
                  Inventory
               </Link>
            </BreadcrumbItem>
            <BreadcrumbItem active>Add Commodity</BreadcrumbItem>
         </Breadcrumb>
         <Form onSubmit={(e) => submit(e)} className="p-3">
            {/*  {hasError && <Alert color="danger"> FORM HAS AN ERROR </Alert>} */}
            <h3 className="flex-fill d-flex justify-content-center font-15 text-secondary">
               <FormattedMessage id="inventoryAddHeading" />
            </h3>
            <FormGroup className="mt-2">
               <Label for="name">
                  <FormattedMessage id="inventory_itemName" />:
               </Label>
               <Input
                  invalid={name.length <= 0 && isnameValid === ""}
                  name="name"
                  type="text"
                  value={name}
                  onChange={(e) => nameChange(e)}
               />
               <FormFeedback>
                  <FormattedMessage id="inventory_itemError" />
               </FormFeedback>
            </FormGroup>
            <Button type="submit" color="primary" className="mt-3">
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
            {showAlert ? (
               <Alert className="mt-4">
                  <FormattedMessage id="inventory_addSuccessful" />
               </Alert>
            ) : (
               ""
            )}
         </Form>
      </Fragment>
   );
};

export default AddInventoryType;
