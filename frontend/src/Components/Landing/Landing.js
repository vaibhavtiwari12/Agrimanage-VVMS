import { useEffect, useState } from "react";
import { FormattedMessage } from "react-intl";
import { Card, CardBody, CardTitle, Spinner } from "reactstrap";
import Dashline1 from "./DashBoardLine1/DashLine1";
import DashLine1Item2 from "./DashBoardLine1/DashLine1Item2";
import DashLine1Item3 from "./DashBoardLine1/DashLine1Item3";
import QuantitySold from "./DashboardLine2/TopSoldItem";
import Topkisandefaulters from "./DashboardLine2/TopKisanDefaulters";
import TopPurchaserDefaulter from "./DashboardLine2/TopPurchaserDefaulter";
import TopSoldItem from "./DashboardLine2/TopSoldItem";
import TopSellerKisans from "./DashboardLine2/TopSellerKisans";
import TopBuyingPurchaser from "./DashboardLine2/TopBuyingPurchaser";
import axios from "axios";
import { Fragment } from "react";

const Landing = () => {
   const [dashBoardData, setDashBoardData] = useState({});
   const [isLoading, setIsLoading] = useState(true);
   useEffect(() => {
      document.title = "VVMS - Home";
      const fetchData = async () => {
         const fetchedData = await axios.get("/dashboardinfo");
         console.log("Dashboard", fetchedData.data);
         setDashBoardData(fetchedData.data);
         setIsLoading(false)
      };
      fetchData();
   }, []);
   return (
      <div>
         <h5 className="text-center text-muted mt-5 text-capitalize font-12">
            <FormattedMessage id="welcomeMsg" />
         </h5>
         <h3 className="text-center text-primary mb-5 mt-1 text-capitalize">
            <FormattedMessage id="brandName" />
         </h3>
         {isLoading ? (
            <div className="text-center mt-5 text-primary">
               <Spinner />
            </div>
         ) : (
            <Fragment>
               <div className="d-flex mt-4 details-card-container font-10">
                  <Card className="flex-even details-card shadow">
                     <CardBody>
                        <CardTitle className="text-gray">
                           {" "}
                           <h5 className="font-11"> <FormattedMessage id="totalAdvacePendingWithKisan" /></h5>
                        </CardTitle>
                        <div>
                           <h4 className="text-danger font-14">
                              {dashBoardData.totalAdvancePending}
                           </h4>
                        </div>
                     </CardBody>
                  </Card>
                  <Card className="flex-even details-card  shadow">
                     <CardBody>
                        <CardTitle className="text-gray">
                           {" "}
                           <h5 className="font-11"> <FormattedMessage id="totalPurchaserOutstanding" /></h5>
                        </CardTitle>
                        <div>
                           <h4 className="text-danger font-14">{dashBoardData.totalPurchaserPending}</h4>
                        </div>
                     </CardBody>
                  </Card>
                  <Card className="flex-even details-card shadow">
                     <CardBody className="text-gray">
                        <CardTitle>
                           {" "}
                           <h5 className="font-11"> <FormattedMessage id="totalItemweight" /></h5>
                        </CardTitle>
                        <div>
                           <h4 className="text-primary font-14">
                              {dashBoardData.totalItemWeight}
                           </h4>
                        </div>
                     </CardBody>
                  </Card>
                  <Card className="flex-even details-card shadow">
                     <CardBody className="text-gray">
                        <CardTitle>
                           {" "}
                           <h5 className="font-11"><FormattedMessage id="totalBagsSoldToday" /></h5>
                        </CardTitle>
                        <div>
                           <h4 className="text-primary font-14">
                              {dashBoardData.totalBagsSold}
                           </h4>
                        </div>
                     </CardBody>
                  </Card>
               </div>

               <div className="d-flex mt-4 details-card-container">
                  <Card className="flex-even shadow  details-card">
                     <CardBody>
                        <CardTitle className="text-gray">
                           <h6>Commissions</h6>
                        </CardTitle>
                        <div>
                           {dashBoardData.commissions && (
                              <Dashline1
                                 commissions={dashBoardData.commissions}
                              />
                           )}
                        </div>
                     </CardBody>
                  </Card>
                  <Card className="flex-even shadow details-card">
                     <CardBody>
                        <CardTitle className="text-gray">
                           <h6>Cash Paid</h6>
                        </CardTitle>
                        <div>
                           <DashLine1Item2 kisan={dashBoardData.advanceDataGivenAndTakenConsolidated} purchaser={dashBoardData.purchaserData}/>
                        </div>
                     </CardBody>
                  </Card>
                  <Card className="flex-even shadow details-card">
                     <CardBody>
                        <CardTitle className="text-gray">
                           <h6>Advance</h6>
                        </CardTitle>
                        <div>
                           {dashBoardData.advanceDataGivenAndTakenConsolidated && (
                              <DashLine1Item3
                                 advanceData={
                                    dashBoardData.advanceDataGivenAndTakenConsolidated
                                 }
                              />
                           )}
                        </div>
                     </CardBody>
                  </Card>
               </div>
               <div className="d-flex mt-4 details-card-container">
                  <Card className="flex-even shadow details-card">
                     <CardBody>
                        <CardTitle className="text-gray">
                           <h6>Top Kisan Defaulters</h6>
                        </CardTitle>
                        <div>
                           <Topkisandefaulters defaulters={dashBoardData.topKisanDefaulters}/>
                        </div>
                     </CardBody>
                  </Card>
                  <Card className="flex-even shadow details-card">
                     <CardBody>
                        <CardTitle className="text-gray">
                           <h6>Top Purchaser Defaulters</h6>
                        </CardTitle>
                        <div>
                           <TopPurchaserDefaulter defaulters={dashBoardData.topPurchaserDefaulters}/>
                        </div>
                     </CardBody>
                  </Card>
                  <Card className="flex-even shadow details-card">
                     <CardBody>
                        <CardTitle className="text-gray">
                           <h6>Top Sold Item (In KGs)</h6>
                        </CardTitle>
                        <div>
                           <TopSoldItem items={dashBoardData.topSoldItems}/>
                        </div>
                     </CardBody>
                  </Card>
                  <Card className="flex-even shadow details-card">
                     <CardBody>
                        <CardTitle className="text-gray">
                           <h6>Top Seller Kisan (In &#x20B9;)</h6>
                        </CardTitle>
                        <div>
                           <TopSellerKisans kisans={dashBoardData.topSellingKisans}/>
                        </div>
                     </CardBody>
                  </Card>
                  <Card className="flex-even shadow details-card">
                     <CardBody>
                        <CardTitle className="text-gray">
                           <h6>Top Buying Purchaser</h6>
                        </CardTitle>
                        <div>
                           <TopBuyingPurchaser purchasers={dashBoardData.topBuyingPurchaser}/>
                        </div>
                     </CardBody>
                  </Card>
               </div>
            </Fragment>
         )}
      </div>
   );
};

export default Landing;
