import { useEffect, useRef, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import { Breadcrumb, BreadcrumbItem, Button } from "reactstrap";
import { Link } from "react-router-dom";
import { FormattedMessage } from "react-intl";
import { fetchCustomTransactionsForPurchaser, getPurchaserById } from "../../Utility/utility";
import Purchasersummary from "./PurchaserSummary";
import Purchasertransactiontable from "./PurchaserTransactionTable";

const Purchaserdetails = () => {
  const { id } = useParams();
  const [purchaser, setPurchaser] = useState({});
  const [customPurchaserTransaction, setCustomPurchaserTransaction] = useState(null)
  const history = useHistory();
  useEffect(() => {
    console.log(id);
    try {
      const fetchData = async () => {
        setPurchaser(await getPurchaserById(id));
        setCustomPurchaserTransaction(await fetchCustomTransactionsForPurchaser(id))
      };
      fetchData();
    } catch (e) {
      throw new Error("Something Went Wrong ", e);
    }
  }, []);
  useEffect(() => {
    console.log("KISAN ", purchaser);
    if (purchaser.name) {
      document.title = "VVMS - Purchaser - " + purchaser.name;
    }
  }, [purchaser]);
  const handleButtonclick = (link) => {
    history.push(link)
}
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
        <BreadcrumbItem active>Details</BreadcrumbItem>
      </Breadcrumb>
      <h2 className="d-flex justify-content-center mt-2 capitalize font-13">
        <FormattedMessage id="purchaserDetailsPageTitle" />
      </h2>
      <div className="text-center">
        <Button color="primary" onClick={e=> handleButtonclick(`/editPurchaser/${id}`)}><FormattedMessage id="editPurchaser" /></Button>
      </div>
      <div>
        <div>
          <Purchasersummary purchaser={purchaser}></Purchasersummary>
        </div>
        <div></div>
      </div>
      <div className="text-center">
        <Button className="font-10" color="success" onClick={e => handleButtonclick(`/purchaserCreditForm/${id}/add`)}>
            <FormattedMessage id="purchaserPaymentEntryButtonText" />
        </Button>
      </div>
      <h3 className="text-center mt-4 font-13">
        <FormattedMessage id="transactionDetailsTitle" />
      </h3>
      <div className="p-3 font-10">
        <Purchasertransactiontable purchaser={customPurchaserTransaction} purchaserDetails={purchaser}/>
      </div>
    </div>
  );
}

export default Purchaserdetails;
