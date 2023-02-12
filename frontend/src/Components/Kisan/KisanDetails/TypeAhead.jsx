import React, { useEffect, useState } from 'react';
import { Fragment } from 'react';
import { Typeahead } from 'react-bootstrap-typeahead';
import 'react-bootstrap-typeahead/css/Typeahead.css';
import { FormFeedback, Label } from 'reactstrap';
import { FormattedMessage, useIntl } from "react-intl";
  const TypeAhead= ({purchaserData, selectedPurchaser, isDisabled, editedValue, type,isInvalid =true}) => {
    const [selected, setSelected] = useState([]);
    const intlA = useIntl();
    const  isNumber = function isNumber(value) {
      return typeof value === 'number' && isFinite(value);
    }
  useEffect(() => {
    if(type="edit" && isNumber(editedValue)){
      setSelected([purchaserData[editedValue]])
    }
  }, [editedValue]);


  useEffect(() => {
      if(selected.length>0 && type!=="edit"){
          selectedPurchaser(selected[0])
      }
  }, [selected]);
  return (
    <Fragment>
        <Label for="purchaserName" className='pt-2'><FormattedMessage id="purchaserName" /> :</Label>
        <Typeahead
          id="purchaserName"
          onChange={setSelected}
          options={purchaserData}
          placeholder= {intlA.formatMessage({ id: "selectPurchaser" })}
          selected={selected} 
          disabled = {isDisabled}
          isInvalid={isInvalid}
        />
        {isInvalid && <FormFeedback className={isInvalid? "display-block": ""}>
            <FormattedMessage id="selectingPurchaserIsRequired" />
        </FormFeedback>}
    </Fragment>
  );
};

export default TypeAhead
