import React, { useState } from "react";
import {
  TabContent,
  TabPane,
  Nav,
  NavItem,
  NavLink,
  Row,
  Col,
  CardTitle,
  CardText,
  Card,
  Button,
} from "reactstrap";
import classnames from "classnames";
import InventoryTable from "./InventoryTable";
import Inventorysummary from "./InventorySummary";

const InventoryTabs = ({ inventory }) => {
  const [activeTab, setActiveTab] = useState(1);

  const toggle = (tab) => {
    if (activeTab !== tab) {
      setActiveTab(tab);
    }
  };

  return (
    <div className="font-10">
      {inventory.length > 0 ? (
        <div className="pt-5">
          <Nav tabs>
            {inventory.map((inv, index) => {
              return (
                <NavItem key={index}>
                  <NavLink
                    className={classnames({ active: activeTab === index + 1 })}
                    onClick={() => toggle(index + 1)}
                  >
                    <b>{inv.itemName}</b>
                  </NavLink>
                </NavItem>
              );
            })}
          </Nav>
          <TabContent activeTab={activeTab}>
            {inventory.map((inv, index) => {
              return (
                <TabPane tabId={index + 1}>
                  <Inventorysummary inventory={inv} />
                  <InventoryTable
                    transactions={inv.transactions}
                  ></InventoryTable>
                </TabPane>
              );
            })}
          </TabContent>
        </div>
      ) : (
        <div className="text-center text-danger pt-5">
          <h5>Please Add the Item to do CREDIT ENTRY or to see the INVENTORY.</h5>
        </div>
      )}
    </div>
  );
};
export default InventoryTabs;
