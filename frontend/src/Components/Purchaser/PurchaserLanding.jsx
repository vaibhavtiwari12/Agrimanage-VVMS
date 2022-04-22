import React, { Fragment, useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { Breadcrumb, BreadcrumbItem, Button, Spinner } from "reactstrap";
import { getAllPurchasers } from "../../Utility/utility";
import Search from "../Search/Search";
import Purchasertable from "./PurchaserTable";
import { FormattedMessage } from "react-intl";

const Purchaserlanding = () => {
   const history = useHistory();
   const handleAddPurchaserClick = () => {
      history.push("/addPurchaser");
   };
   const [purchasers, setPurchasers] = useState([]);
   const [isLoading, setIsLoading] = useState(true);
   const [searchTerm, setSearchTerm] = useState("");
   const [searchType, setSearchType] = useState("Name");
   const handleSearchTermChange = (term) => {
      console.log("Term Changed", term);
      setSearchTerm(term);
   };
   const handleSearchTypeChange = (type) => {
      console.log("Type Changed", type);
      setSearchType(type);
   };
   useEffect(() => {
      document.title = "VVMS - Purchaser";
      try {
         const fetchData = async () => {
            const fetchedPurchasers = await getAllPurchasers();
            console.log("Fetched purchases", fetchedPurchasers);
            setPurchasers(fetchedPurchasers.data);
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
               <Search
                  setSearchTermChange={handleSearchTermChange}
                  setSearchTermType={handleSearchTypeChange}
               ></Search>
               <Purchasertable
                  purchasers={purchasers}
                  term={searchTerm}
                  type={searchType}
               ></Purchasertable>
            </Fragment>
         )}
      </div>
   );
};

export default Purchaserlanding;
