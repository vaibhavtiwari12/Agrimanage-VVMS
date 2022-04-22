import { Table } from "reactstrap";
import { Link } from "react-router-dom";
import { FormattedMessage } from "react-intl";
import { dateConverter } from "../../Utility/utility";

const InventoryTable = ({ transactions }) => {
  return (
    <div className="">
      {transactions.length > 0 ? (
        <Table striped size="sm" className="mt-3" responsive>
          <thead>
            <tr>
              <th>#</th>
              <th><FormattedMessage id="kisanDetailsTitle" /></th>
              <th><FormattedMessage id="purchaserName" /></th>
              <th><FormattedMessage id="date" /></th>
              <th><FormattedMessage id="totalWeight" /></th>
              <th><FormattedMessage id="numberOfBags" /></th>
              <th><FormattedMessage id="ratePerKg" /></th>
            </tr>
          </thead>
          <tbody>
            {transactions.sort((a,b) => new Date(b.date) - new Date(a.date)).map((transaction, index) => {
              return (
                <tr key={transaction._id}>
                  <th scope="row">{index + 1}</th>
                  <td className="capitalize">
                    <Link to={"/kisanDetails/"+transaction.kisanID}>{transaction.kisanName}</Link>
                  </td>
                  <td className="capitalize">
                    <Link to={"/purchaserDetails/"+transaction.purchaserId}>{transaction.purchaserName}</Link>
                  </td>
                  <td className="capitalize">
                    {dateConverter(transaction.date)}
                  </td>
                  <td className="capitalize">{transaction.totalweight}</td>
                  <td className="capitalize">{transaction.numberofBags}</td>
                  <td className="capitalize">{transaction.rate}</td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      ) : (
        <div className="text-center pt-3 text-danger">
          <h5><th><FormattedMessage id="noInventoryForThisItem" /></th></h5>
        </div>
      )}
    </div>
  );
};

export default InventoryTable;
