import React from "react";
import { Table } from "reactstrap";
import { FormattedMessage } from "react-intl";

const Purchasersummary = ({purchaser}) => {
    return (
        <div className="p-3 font-10">
          <Table bordered responsive className="p-3 kisan-detail">
            <tbody>
              <tr>
                <th><FormattedMessage id="purchaserName"/></th>
                <td className="capitalize">{purchaser.name}</td>
              </tr>
              <tr>
                <th><FormattedMessage id="companyName"/></th>
                <td className="capitalize">{purchaser.companyName}</td>
              </tr>
              <tr>
                <th><FormattedMessage id="phone"/></th>
                <td>{purchaser.phone}</td>
              </tr>
              <tr>
                <th><FormattedMessage id="address"/></th>
                <td className="capitalize">{purchaser.address}</td>
              </tr>
              <tr>
                <th><FormattedMessage id="outstandingPayment"/></th>
                <td>{purchaser.balance}</td>
              </tr>
            </tbody>
          </Table>
        </div>
      );
}

export default Purchasersummary;
