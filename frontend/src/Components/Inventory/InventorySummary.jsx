import React from "react";
import { FormattedMessage } from "react-intl";
import { Table } from "reactstrap";

const Inventorysummary = ({inventory}) => {
  return (
    <div className="p-3">
      {inventory && 
      
      <Table bordered responsive className="p-3 kisan-detail">
        <tbody>
          <tr>
            <th>
              <FormattedMessage id="transacted" /><FormattedMessage id="totalWeight" />
            </th>
            <td className="capitalize">{inventory.totalWeight}</td>
          </tr>
          <tr>
            <th>
              <FormattedMessage id="transacted" /><FormattedMessage id="numberOfBags" />
            </th>
            <td className="capitalize">{inventory.totalBags}</td>
          </tr>
        </tbody>
      </Table>
      }
    </div>

  );
};
export default Inventorysummary;
