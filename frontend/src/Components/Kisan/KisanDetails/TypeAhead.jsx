import React, { useEffect, useState } from 'react';
import { AutoComplete, Form } from 'antd';
import { FormattedMessage, useIntl } from 'react-intl';

const TypeAhead = ({
  purchaserData,
  selectedPurchaser,
  isDisabled,
  editedValue,
  type,
  isInvalid = true,
}) => {
  const [value, setValue] = useState('');
  const [options, setOptions] = useState([]);
  const intlA = useIntl();

  const isNumber = function isNumber(value) {
    return typeof value === 'number' && isFinite(value);
  };

  // Convert purchaserData to AutoComplete options format
  useEffect(() => {
    if (purchaserData && purchaserData.length > 0) {
      const formattedOptions = purchaserData.map((purchaser, index) => ({
        value: purchaser.name || purchaser.toString(),
        label: purchaser.name || purchaser.toString(),
        data: purchaser,
        index: index,
      }));
      setOptions(formattedOptions);
    }
  }, [purchaserData]);

  // Handle edit mode initialization
  useEffect(() => {
    if (type === 'edit' && isNumber(editedValue) && purchaserData[editedValue]) {
      setValue(purchaserData[editedValue].name || purchaserData[editedValue].toString());
    }
  }, [editedValue, purchaserData, type]);

  // Handle selection change
  const handleSelect = (selectedValue, option) => {
    setValue(selectedValue);
    if (type !== 'edit' && selectedPurchaser) {
      selectedPurchaser(option.data);
    }
  };

  // Handle input change for filtering
  const handleSearch = searchText => {
    setValue(searchText);

    if (!searchText || searchText.length === 0) {
      setOptions(
        purchaserData.map((purchaser, index) => ({
          value: purchaser.name || purchaser.toString(),
          label: purchaser.name || purchaser.toString(),
          data: purchaser,
          index: index,
        }))
      );
    } else {
      const filteredOptions = purchaserData
        .map((purchaser, index) => ({
          value: purchaser.name || purchaser.toString(),
          label: purchaser.name || purchaser.toString(),
          data: purchaser,
          index: index,
        }))
        .filter(option => option.value.toLowerCase().includes(searchText.toLowerCase()));
      setOptions(filteredOptions);
    }
  };

  return (
    <Form.Item
      label={
        <span style={{ fontWeight: 500, color: '#2c3e50' }}>
          <FormattedMessage id="purchaserName" />
        </span>
      }
      validateStatus={isInvalid ? 'error' : ''}
      help={isInvalid ? <FormattedMessage id="selectingPurchaserIsRequired" /> : null}
    >
      <AutoComplete
        value={value}
        options={options}
        onSelect={handleSelect}
        onSearch={handleSearch}
        placeholder={intlA.formatMessage({ id: 'selectPurchaser' })}
        disabled={isDisabled}
        size="large"
        style={{ width: '100%' }}
        filterOption={false} // We handle filtering manually for better control
        allowClear
      />
    </Form.Item>
  );
};

export default TypeAhead;
