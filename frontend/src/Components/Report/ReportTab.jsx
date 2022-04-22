import React, { useState } from "react";
import {
  TabContent,
  TabPane,
  Nav,
  NavItem,
  NavLink,
} from "reactstrap";
import classnames from "classnames";
import Kisanreport from "./KisanReport";
import PurchaserReport from "./PurchaserReport";

const ReportTab = ({ inventory }) => {
  const [activeTab, setActiveTab] = useState("1");

  const toggle = (tab) => {
    if (activeTab !== tab) {
      setActiveTab(tab);
    }
  };

  return (
    <div>
        <div className="pt-2 font-10">
          <Nav tabs>
                <NavItem >
                  <NavLink
                    className={classnames({ active: activeTab === "1"})}
                    onClick={() => toggle("1")}
                  >
                    <b>Kisan</b>
                  </NavLink>
                </NavItem>
                <NavItem >
                  <NavLink
                    className={classnames({ active: activeTab === "2"})}
                    onClick={() => toggle("2")}
                  >
                    <b>Purchaser</b>
                  </NavLink>
                </NavItem>
          </Nav>
          <TabContent activeTab={activeTab}>
                <TabPane tabId='1'>
                {/*   <Inventorysummary inventory={inv} />
                  <InventoryTable
                    transactions={inv.transactions}
                  ></InventoryTable> */}
                  <Kisanreport/>
                </TabPane>
                <TabPane tabId='2'>
                  {/* <Inventorysummary inventory={inv} />
                  <InventoryTable
                    transactions={inv.transactions}
                  ></InventoryTable> */}
                  <PurchaserReport/>
                </TabPane>
          </TabContent>
        </div>
    </div>
  );
};
export default ReportTab;
