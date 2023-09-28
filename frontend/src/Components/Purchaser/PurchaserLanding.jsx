import React, { Fragment, useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { Breadcrumb, BreadcrumbItem, Button, Form, FormFeedback, FormGroup, Input, Label, Spinner } from "reactstrap";
import { getAllPurchasers } from "../../Utility/utility";
import Search from "../Search/Search";
import Purchasertable from "./PurchaserTable";
import { FormattedMessage, useIntl } from "react-intl";
import axios from "axios";

const Purchaserlanding = () => {
   const intlA = useIntl();
   const history = useHistory();
   const handleAddPurchaserClick = () => {
      history.push("/addPurchaser");
   };
   const [purchasers, setPurchasers] = useState([]);
   const [isLoading, setIsLoading] = useState(true);
   const [searchTerm, setSearchTerm] = useState("");
   const [searchType, setSearchType] = useState("Name");
   const [inventory, setInventory] = useState([]);
   const [itemType, setItemType] = useState("");
   const [filteredPurchasers, setFilteredPurchasers] = useState([]);
   const [isItemTypeInvalid, setIsItemTypeInvalid] = useState("PRISTINE");
   const handleSearchTermChange = (term) => {
      console.log("Term Changed", term);
      setSearchTerm(term);
   };
   const handleSearchTypeChange = (type) => {
      console.log("Type Changed", type);
      setSearchType(type);
   };
   const handleItemChange = (e) => {
      console.log("target value", e.target.value)
        setItemType(e.target.value);
        if(e.target.value === ""){
         setFilteredPurchasers(purchasers)
        }else {
          const filterPurchaser= purchasers.filter(purchasers => {
            return purchasers.purchaserCommodity == e.target.value
          })
          setFilteredPurchasers(filterPurchaser)
        }
     };
   useEffect(() => {
      document.title = "VVMS - Purchaser";
      try {
         const fetchData = async () => {
            const inventoryData = await axios.get("/inventory/get");
            if (inventoryData.data.length <= 0) {
               history.push("/inventory");
            } else {
               setInventory(inventoryData.data);
               //setIsLoading(false);
            }
            const fetchedPurchasers = await getAllPurchasers();
            console.log("Fetched purchases", fetchedPurchasers);
            setPurchasers(fetchedPurchasers.data);
            setFilteredPurchasers(fetchedPurchasers.data)
            setIsLoading(false);
         };
         fetchData();
      } catch (e) {
         throw new Error("Something Went Wrong ", e);
      }
   }, []);
   return (
      <div className="mt-3">
         <Breadcrumb className="ps-3 mt-2">
            <BreadcrumbItem>
               <Link className="link-no-decoration-black text-primary" to="/">
                  Home
               </Link>
            </BreadcrumbItem>
            <BreadcrumbItem active>Purchaser</BreadcrumbItem>
         </Breadcrumb>
         {isLoading ? (
            <div className="text-center mt-5 text-primary">
               <Spinner />
            </div>
         ) : (
            <Fragment>
               <div className="d-flex">
                  <h3 className="flex-fill d-flex justify-content-center font-13">
                     <FormattedMessage id="purchaserLandingTitle" />
                  </h3>
                  <Button
                     className="justify-content-end me-3 font-10"
                     color="primary"
                     size="sm"
                     onClick={handleAddPurchaserClick}
                  >
                     + <FormattedMessage id="addPurchaserButtonText" />
                  </Button>
               </div>
               <div className="mx-3 mt-3 shadow pb-4 font-10">

                  <Form className="p-3">
                     <FormGroup>
                        <Label for="itemType" className="mt-2">
                        <FormattedMessage id="whatAreYouBuyingText" />
                        </Label>
                        <Input
                           type="select"
                           /* disabled={type === "edit" ? true : false} */
                           name="select"
                           invalid={isItemTypeInvalid === "TRUE"}
                           id="itemType"
                           value={itemType}
                           onChange={(e) => handleItemChange(e)}
                        >
                           <option value="">
                              {intlA.formatMessage({ id: "selectTradingType" })}
                           </option>
                           {inventory.map((item) => {
                              return (
                                 <option key={item._id} value={item.itemName}>
                                    {item.itemName}
                                 </option>
                              );
                           })}
                        </Input>
                        <FormFeedback>
                           Commodity Selection is Mandatory
                        </FormFeedback>
                     </FormGroup>
                  </Form>
               </div>
               <Search
                  setSearchTermChange={handleSearchTermChange}
                  setSearchTermType={handleSearchTypeChange}
               ></Search>
               <Purchasertable
                  purchasers={filteredPurchasers}
                  term={searchTerm}
                  type={searchType}
               ></Purchasertable>
            </Fragment>
         )}
      </div>
   );
};

export default Purchaserlanding;
