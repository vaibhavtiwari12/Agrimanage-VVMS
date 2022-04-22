import { Form, FormGroup, Label, Input, Button } from "reactstrap";
import { FormattedMessage,useIntl } from "react-intl";
import useSearch from "./useSearch";
const Search = ({ setSearchTermChange, setSearchTermType }) => {
  const intl = useIntl();
  const {
    handleChange,
    handleSubmit,
    handleSelectChange,
    searchType,
    searchTerm,
    handleReset,
  } = useSearch(setSearchTermChange, setSearchTermType);
  return (
    <div className="mx-3 mt-3 shadow px-3 py-4 font-10">
      <Form onSubmit={handleSubmit}>
        <FormGroup>
          <Label for="searchType"><FormattedMessage id="searchBy"/>:</Label>
          <Input
            type="select"
            name="select"
            id="searchType"
            className="font-10"
            value={
              searchType === "Name" || searchType === ""
                ? "Name"
                : searchType === "fatherName"
                ? "fatherName"
                : "phone"
            }
            onChange={(e) => handleSelectChange(e)}
          >
            <option value="Name">{intl.formatMessage({id:"name"})}</option>
            <option value="fatherName">{intl.formatMessage({id:"fatherName"})}</option>
            <option value="phone">{intl.formatMessage({id:"phone"})}</option>
          </Input>
        </FormGroup>
        <FormGroup className="mt-2">
          <Label for="search"><FormattedMessage id="searchValue"/>:</Label>
          <Input
            name="search"
            className="font-10"
            onChange={(e) => handleChange(e)}
            value={searchTerm}
          />
        </FormGroup>
        <FormGroup inline>
          <Button size="md" color="primary" className="mt-3 font-10" type="submit">
            <FormattedMessage id="searchButtonText"/>
          </Button>
          <Button
            size="md"
            color="danger"
            onClick={handleReset}
            className="mt-3 ms-2 font-10"
          >
            <FormattedMessage id="resetButtonText"/>
          </Button>
        </FormGroup>
      </Form>
    </div>
  );
};
export default Search;
