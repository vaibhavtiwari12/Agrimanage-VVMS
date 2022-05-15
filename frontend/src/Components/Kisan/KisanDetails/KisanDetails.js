import { useEffect, useRef, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import { Breadcrumb, BreadcrumbItem, Button } from "reactstrap";
import { getKisanByID } from "../../../Utility/utility";
import Kisanmoneysummary from "./KisanMoneySummary";
import Kisantransactionstable from "./kisanTransactionsTable";
import { Link } from "react-router-dom";
import { FormattedMessage } from "react-intl";

const Kisandetails = () => {
  const { id } = useParams();
  const [kisan, setKisan] = useState({});
  const history = useHistory();
  useEffect(() => {
    console.log(id);
    try {
      const fetchData = async () => {
        setKisan(await getKisanByID(id));
      };
      fetchData();
    } catch (e) {
      throw new Error("Something Went Wrong ", e);
    }
  }, []);
  const updateKisan = () => {
    try {
      const fetchData = async () => {
        setKisan(await getKisanByID(id));
      };
      fetchData();
    } catch (e) {
      throw new Error("Something Went Wrong ", e);
    }
  }
  useEffect(() => {
    console.log("KISAN ", kisan);
    if (kisan.name) {
      document.title = "VVMS - Kisan - " + kisan.name;
    }
  }, [kisan]);

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
          <Link className="link-no-decoration-black text-primary" to="/kisan">
            Kisan
          </Link>
        </BreadcrumbItem>
        <BreadcrumbItem active>Details</BreadcrumbItem>
      </Breadcrumb>
      <h2 className="d-flex justify-content-center mt-2 capitalize font-14">
        <FormattedMessage id="kisanDetailsTitle" />
      </h2>
      <div className="text-center">
        <Button color="primary" onClick={e => handleButtonclick(`/editKisan/${id}`)}><FormattedMessage id="editKisan"/></Button>
      </div>
      <div>
        <div>
          <Kisanmoneysummary kisan={kisan}></Kisanmoneysummary>
        </div>
        <div></div>
      </div>
      <div className="text-center mt-3">
        <Button className="font-10" color="danger" onClick={e => handleButtonclick(`/kisanDebitForm/${id}/add`)}>
            <FormattedMessage id="giveAdvanceKisanButtonText" />
        </Button>
        <Button color="success" className="ms-3 font-10" onClick={e => handleButtonclick(`/kisanAdvanceSettlement/${id}/add`)}>
            <FormattedMessage id="depositAdvanceKisanButtonText" />
        </Button>
        <Button color="primary" className="ms-5 font-10" onClick={e => handleButtonclick(`/kisanCreditForm/${id}/add`)}>
            <FormattedMessage id="createBillKisanButtonText" />
        </Button>
      </div>
      <h3 className="text-center mt-5 font-14">
        <FormattedMessage id="transactionDetailsTitle" />
      </h3>
      <div className="p-3 font-10">
        <Kisantransactionstable kisan={kisan} updateKisan={updateKisan} />
      </div>
    </div>
  );
};

export default Kisandetails;
