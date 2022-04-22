import React from "react";
import { Table } from "reactstrap";
import { FormattedMessage } from "react-intl";
const Kisanmoneysummary = ({ kisan }) => {
  return (
    <div className="p-3 font-10">
      <Table bordered responsive className="p-3 kisan-detail">
        <tbody>
          <tr>
            <th><FormattedMessage id="name"/></th>
            <td className="capitalize">{kisan.name}</td>
          </tr>
          <tr>
            <th><FormattedMessage id="fatherName"/></th>
            <td className="capitalize">{kisan.fatherName}</td>
          </tr>
          <tr>
            <th><FormattedMessage id="phone"/></th>
            <td>{kisan.phone}</td>
          </tr>
          <tr>
            <th><FormattedMessage id="address"/></th>
            <td className="capitalize">{kisan.address}</td>
          </tr>
          <tr>
            <th><FormattedMessage id="balance"/></th>
            <td>{kisan.balance}</td>
          </tr>
          <tr>
            <th><FormattedMessage id="carryForwardAmount"/></th>
            <td>{kisan.carryForwardAmount}</td>
          </tr>
        </tbody>
      </Table>
    </div>
  );
};

export default Kisanmoneysummary;
