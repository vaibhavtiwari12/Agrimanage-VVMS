import { Table } from "reactstrap";
import { Link } from "react-router-dom";
import { FormattedMessage } from "react-intl";

const Purchasertable = ({ purchasers, term, type }) => {
  return (
    <div>
      {purchasers.length > 0 ? (
        <Table striped size="sm" className="mt-3 font-10" responsive >
          <thead>
            <tr>
              <th>#</th>
              <th>
                <FormattedMessage id="nameOfPurchase" />
              </th>
              <th><FormattedMessage id="companyName" /></th>
              <th>
                <FormattedMessage id="phone" />
              </th>
              <th>
                <FormattedMessage id="address" />
              </th>
              <th>
                <FormattedMessage id="outstandingPayment" />
              </th>
            </tr>
          </thead>
          <tbody>
            {purchasers
              .filter((purchaser) => {
                if (type.toLowerCase() === "name") {
                  return purchaser.name
                    .toLowerCase()
                    .includes(term.toLowerCase());
                } else if (type.toLowerCase() === "companyName") {
                  return purchaser.fatherName
                    .toLowerCase()
                    .includes(term.toLowerCase());
                } else {
                  return purchaser.phone.toString().includes(term);
                }
              })
              .map((purchaser, index) => {
                return (
                  <tr key={purchaser._id}>
                    <th scope="row">{index + 1}</th>
                    <td className="capitalize">
                      <Link to={`purchaserDetails/${purchaser._id}`}>
                        {purchaser.name}
                      </Link>
                    </td>
                    <td className="capitalize">{purchaser.companyName}</td>
                    <td>{purchaser.phone}</td>
                    <td className="capitalize">{purchaser.address}</td>
                    <td>
                      {purchaser.balance < 0 ? (
                        <span className="text-danger">{purchaser.balance}</span>
                      ) : (
                        <span className="text-primary">
                          {purchaser.balance}
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </Table>
        ) : <div className="pt-5 text-center">
            <h3 className="text-danger">No Purchasers Found.</h3>
            <h6>Please add a purchaser to continue.</h6>
        </div> 
      }
    </div>
  );
};

export default Purchasertable;
