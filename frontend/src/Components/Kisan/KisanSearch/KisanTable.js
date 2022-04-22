import { Table } from "reactstrap";
import { Link } from "react-router-dom";
import { FormattedMessage } from "react-intl";
const KisanTable = ({ kisans, term, type }) => {
  return (
    <div>
      <Table striped size="sm" className="mt-3 font-10" responsive >
        <thead>
          <tr>
            <th>#</th>
            <th><FormattedMessage id="name"/></th>
            <th><FormattedMessage id="fatherName"/></th>
            <th><FormattedMessage id="phone"/></th>
            <th><FormattedMessage id="address"/></th>
            <th><FormattedMessage id="balance"/></th>
          </tr>
        </thead>
        <tbody>
          {kisans
            .filter((kisan) => {
              if (type.toLowerCase() === "name") {
                return kisan.name.toLowerCase().includes(term.toLowerCase());
              } else if (type.toLowerCase() === "fathername") {
                return kisan.fatherName
                  .toLowerCase()
                  .includes(term.toLowerCase());
              } else {
                return kisan.phone.toString().includes(term);
              }
            })
            .map((kisan, index) => {
              return (
                <tr key={kisan._id}>
                  <th scope="row">{index + 1}</th>
                  <td className="capitalize">
                    <Link to={`kisanDetails/${kisan._id}`}>{kisan.name}</Link>
                  </td>
                  <td className="capitalize">{kisan.fatherName}</td>
                  <td>{kisan.phone}</td>
                  <td className="capitalize">{kisan.address}</td>
                  <td>
                    {kisan.balance < 0 ? (
                      <span className="text-danger">{kisan.balance}</span>
                    ) : (
                      <span className="text-primary">{kisan.balance}</span>
                    )}
                  </td>
                </tr>
              );
            })}
        </tbody>
      </Table>
    </div>
  );
};

export default KisanTable;
