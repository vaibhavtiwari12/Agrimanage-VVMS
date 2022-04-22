import { Fragment, useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { Breadcrumb, BreadcrumbItem, Button, Spinner } from "reactstrap";
import { getAllKisan } from "../../Utility/utility";
import { FormattedMessage } from "react-intl";
import axios from "axios";
import InventoryTable from "./InventoryTable";
import InventoryTabs from "./InventoryTabs";

const InventoryLanding = () => {
   const history = useHistory();
   const [inventory, setInventory] = useState([]);
   const [isLoading, setIsLoading] = useState(true);
   const handleAddInventoryType = () => {
      history.push("/addInventoryType");
   };
   useEffect(() => {
      document.title = "VVMS - Inventory";
      try {
         const fetchData = async () => {
            const inventoryData = await axios.get("/inventory/get");
            setInventory(inventoryData.data);
            setIsLoading(false);
         };
         fetchData();
      } catch (e) {
         throw new Error("Something Went Wrong ", e);
      }
   }, []);
   useEffect(() => {
      console.log("Inventory", inventory);
   }, [inventory]);
   return (
      <div className="mt-3">
         <Breadcrumb className="ps-3 mt-2">
            <BreadcrumbItem>
               <Link className="link-no-decoration-black text-primary" to="/">
                  Home
               </Link>
            </BreadcrumbItem>
            <BreadcrumbItem active>Inventory</BreadcrumbItem>
         </Breadcrumb>
         {isLoading ? (
            <div className="text-center mt-5 text-primary">
               <Spinner />
            </div>
         ) : (
            <Fragment>
               <div className="d-flex">
                  <h3 className="flex-fill d-flex justify-content-center font-15">
                     <FormattedMessage id="inventoryLandingTitle" />
                  </h3>
                  <Button
                     className="justify-content-end me-3 font-10"
                     color="primary"
                     onClick={handleAddInventoryType}
                     size="sm"
                  >
                     + <FormattedMessage id="addfasalType" />
                  </Button>
               </div>
               <InventoryTabs inventory={inventory} />
            </Fragment>
         )}
      </div>
   );
};
export default InventoryLanding;
