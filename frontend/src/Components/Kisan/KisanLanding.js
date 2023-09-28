import { useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { Breadcrumb, BreadcrumbItem, Button, Form, FormFeedback, FormGroup, Input, Label, Spinner } from "reactstrap";
import Search from "../Search/Search";
import KisanTable from "./KisanSearch/KisanTable";
import { getAllKisan } from "../../Utility/utility";
import { FormattedMessage, useIntl } from "react-intl";
import { Fragment } from "react";
import axios from "axios";
const KisanLanding = () => {
   const intlA = useIntl();
   const history = useHistory();
   const handleAddKisanClick = () => {
      history.push("/addKisan");
   };
   const [kisans, setKisans] = useState([]);
   const [isLoading, setIsLoading] = useState(true);
   const [searchTerm, setSearchTerm] = useState("");
   const [searchType, setSearchType] = useState("Name");
   const [inventory, setInventory] = useState([]);
   const [itemType, setItemType] = useState("");
   const [filteredKisans, setFilteredKisans] = useState([]);
   const [isItemTypeInvalid, setIsItemTypeInvalid] = useState("PRISTINE");
   const handleItemChange = (e) => {
    console.log("target value", e.target.value)
      setItemType(e.target.value);
      if(e.target.value === ""){
        setFilteredKisans(kisans)
      }else {
        const filterKisan = kisans.filter(kisan => {
          return kisan.kisanCommodity == e.target.value
        })
        setFilteredKisans(filterKisan)
      }
   };
   const handleSearchTermChange = (term) => {
      console.log("Term Changed", term);
      setSearchTerm(term);
   };
   const handleSearchTypeChange = (type) => {
      console.log("Type Changed", type);
      setSearchType(type);
   };
   useEffect(() => {
      document.title = "VVMS - Kisan";
      try {
         const fetchData = async () => {
            const inventoryData = await axios.get("/inventory/get");
            if (inventoryData.data.length <= 0) {
               history.push("/inventory");
            } else {
               setInventory(inventoryData.data);
               //setIsLoading(false);
            }
            const kisans = await getAllKisan()
            setKisans(kisans);
            setFilteredKisans(kisans)
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
            <BreadcrumbItem active>Kisan</BreadcrumbItem>
         </Breadcrumb>
         {isLoading ? (
            <div className="text-center mt-5 text-primary">
               <Spinner />
            </div>
         ) : (
            <Fragment>
               <div className="d-flex">
                  <h3 className="flex-fill d-flex justify-content-center font-13">
                     <FormattedMessage id="kisanLandingTitle" />
                  </h3>
                  <Button
                     className="justify-content-end me-3 font-10"
                     color="primary"
                     size="sm"
                     onClick={handleAddKisanClick}
                  >
                     + <FormattedMessage id="addKisanButtonText" />
                  </Button>
               </div>
               {/* <AddKisan></AddKisan> */}
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
               <KisanTable
                  kisans={filteredKisans}
                  term={searchTerm}
                  type={searchType}
               ></KisanTable>
            </Fragment>
         )}
      </div>
   );
};
export default KisanLanding;
