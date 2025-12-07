import {
  Card,
  Row,
  Col,
  Form as AntForm,
  Input as AntInput,
  Button as AntButton,
  Select,
  Typography,
  Space,
  message,
  Breadcrumb,
  Divider,
  Spin,
} from 'antd';
import { EditOutlined, SaveOutlined, ReloadOutlined, UserOutlined } from '@ant-design/icons';
import { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { FormattedMessage, useIntl } from 'react-intl';
import { getKisanByID } from '../../../Utility/utility';
import { FormShimmer } from '../../Common';
import axios from 'axios';

const { Title, Text } = Typography;
const { TextArea } = AntInput;
const { Option } = Select;

const EditKisan = () => {
  const { id } = useParams();
  const [form] = AntForm.useForm();
  const [transactions, setTransactions] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [identificationTypes, setIdentificationTypes] = useState([]);
  const [identificationType, setIdentificationType] = useState('');
  const [identificationValue, setIdentificationValue] = useState('');
  const [showAddIdentificationType, setShowAddIdentificationType] = useState(false);
  const [newIdentificationType, setNewIdentificationType] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const intlA = useIntl();
  const history = useHistory();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [details, inventoryData, idTypesData] = await Promise.all([
          getKisanByID(id),
          axios.get('/inventory/get'),
          axios.get('/identificationTypes'),
        ]);

        if (Object.keys(details).length > 0) {
          setTransactions(details.transactions || []);
          setIdentificationType(details.identificationType || '');
          setIdentificationValue(details.identificationValue || '');

          // Set form fields for Ant Design
          form.setFieldsValue({
            name: details.name,
            fatherName: details.fatherName,
            phone: details.phone,
            address: details.address,
            itemType: details.kisanCommodity,
            identificationType: details.identificationType,
            identificationValue: details.identificationValue,
          });
        }

        if (inventoryData.data.length <= 0) {
          history.push('/inventory');
        } else {
          setInventory(inventoryData.data);
        }

        setIdentificationTypes(idTypesData.data || []);

        setIsLoading(false);
      } catch (e) {
        setIsLoading(false);
        message.error('Something went wrong while fetching farmer details');
      }
    };

    fetchData();
  }, [id, form, history]);

  const clear = () => {
    form.resetFields();
  };

  const onFinish = async values => {
    setIsSubmitting(true);
    try {
      const formData = {
        name: values.name,
        fatherName: values.fatherName,
        phone: values.phone,
        address: values.address,
        id,
        kisanCommodity: values.itemType,
        identificationType: values.identificationType,
        identificationValue: values.identificationValue,
      };

      const response = await fetch('/kisan/edit', {
        method: 'POST',
        body: JSON.stringify(formData),
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      });

      const result = await response.json();

      if (response.ok) {
        message.success(intlA.formatMessage({ id: 'editKisanSuccessful' }));
        setTimeout(() => {
          history.push('/kisan');
        }, 1000);
      } else {
        message.error('Failed to update farmer');
      }
    } catch (error) {
      message.error('Something went wrong');
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <div style={{ padding: '24px 12px 32px 12px' }}>
      {isLoading ? (
        <FormShimmer />
      ) : (
        <>
          {/* Breadcrumb */}
          <Breadcrumb style={{ marginBottom: 16 }}>
            <Breadcrumb.Item href="/">
              <FormattedMessage id="home" defaultMessage="Home" />
            </Breadcrumb.Item>
            <Breadcrumb.Item href="/kisan">
              <FormattedMessage id="kisan" defaultMessage="Kisan" />
            </Breadcrumb.Item>
            <Breadcrumb.Item>
              <FormattedMessage id="editKisan" />
            </Breadcrumb.Item>
          </Breadcrumb>

          {/* Header Card */}
          <Card
            className="mobile-consistent-card"
            style={{
              marginBottom: 24,
              borderRadius: 12,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: '#fff',
              border: 'none',
              boxShadow: '0 4px 16px rgba(33, 150, 243, 0.3)',
            }}
          >
            <Row align="middle" gutter={24}>
              <Col>
                <div
                  style={{
                    background: 'rgba(255, 255, 255, 0.2)',
                    padding: window.innerWidth <= 768 ? 12 : 20,
                    borderRadius: 12,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <EditOutlined
                    style={{ fontSize: window.innerWidth <= 768 ? 18 : 24, color: '#fff' }}
                  />
                </div>
              </Col>
              <Col flex={1} className="mobile-header-text">
                <Title
                  level={window.innerWidth <= 768 ? 4 : 2}
                  style={{
                    margin: 0,
                    fontSize: window.innerWidth <= 768 ? 16 : 24,
                    fontWeight: 600,
                    color: '#fff',
                  }}
                >
                  <FormattedMessage id="editKisan" />
                </Title>
                <Text
                  style={{
                    fontSize: window.innerWidth <= 768 ? 12 : 16,
                    marginTop: 8,
                    color: 'rgba(255, 255, 255, 0.9)',
                  }}
                >
                  Edit farmer information in the system
                </Text>
              </Col>
            </Row>
          </Card>

          {/* Form Card */}
          <Card
            style={{
              borderRadius: 12,
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            }}
          >
            <AntForm form={form} layout="vertical" onFinish={onFinish} size="large">
              <Row gutter={[16, 16]}>
                {/* Name Field */}
                <Col xs={24} sm={12}>
                  <AntForm.Item
                    label={
                      <Text strong>
                        <FormattedMessage id="name" />
                      </Text>
                    }
                    name="name"
                    rules={[
                      { required: true, message: intlA.formatMessage({ id: 'nameIsRequired' }) },
                    ]}
                  >
                    <AntInput
                      placeholder={intlA.formatMessage({ id: 'name' })}
                      prefix={<UserOutlined style={{ color: '#bfbfbf' }} />}
                    />
                  </AntForm.Item>
                </Col>

                {/* Father Name Field */}
                <Col xs={24} sm={12}>
                  <AntForm.Item
                    label={
                      <Text strong>
                        <FormattedMessage id="fatherName" />
                      </Text>
                    }
                    name="fatherName"
                    rules={[
                      {
                        required: true,
                        message: intlA.formatMessage({ id: 'fatherNameIsRequired' }),
                      },
                    ]}
                  >
                    <AntInput
                      placeholder={intlA.formatMessage({ id: 'fatherName' })}
                      prefix={<UserOutlined style={{ color: '#bfbfbf' }} />}
                    />
                  </AntForm.Item>
                </Col>

                {/* Phone Field */}
                <Col xs={24} sm={12}>
                  <AntForm.Item
                    label={
                      <Text strong>
                        <FormattedMessage id="phone" />
                      </Text>
                    }
                    name="phone"
                    rules={[
                      { required: true, message: intlA.formatMessage({ id: 'phoneIsRequired' }) },
                      { max: 10, message: 'Phone number cannot exceed 10 digits' },
                    ]}
                  >
                    <AntInput
                      placeholder={intlA.formatMessage({ id: 'phone' })}
                      type="number"
                      maxLength={10}
                    />
                  </AntForm.Item>
                </Col>

                {/* Commodity Field */}
                <Col xs={24} sm={12}>
                  <AntForm.Item
                    label={
                      <Text strong>
                        <FormattedMessage id="whatAreYouBuyingText" />
                      </Text>
                    }
                    name="itemType"
                    rules={[
                      {
                        required: true,
                        message: intlA.formatMessage({ id: 'inventory_itemError' }),
                      },
                    ]}
                  >
                    <Select
                      placeholder={intlA.formatMessage({ id: 'selectTradingType' })}
                      disabled={transactions.length > 0}
                      showSearch
                      filterOption={(input, option) =>
                        option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                      }
                    >
                      {inventory.map(item => (
                        <Option key={item._id} value={item.itemName}>
                          {item.itemName}
                        </Option>
                      ))}
                    </Select>
                  </AntForm.Item>
                  {transactions.length > 0 && (
                    <div
                      style={{
                        padding: 8,
                        background: '#fff2e8',
                        border: '1px solid #ffbb96',
                        borderRadius: 4,
                        marginTop: -16,
                        marginBottom: 16,
                      }}
                    >
                      <Text type="warning" style={{ fontSize: 12 }}>
                        <FormattedMessage id="commodityChangeNotAllowedKisanText" />
                      </Text>
                    </div>
                  )}
                </Col>

                {/* Identification Type Field */}
                <Col xs={24} sm={12}>
                  <AntForm.Item
                    label={
                      <Text strong>
                        <FormattedMessage id="identificationType" />
                      </Text>
                    }
                    name="identificationType"
                  >
                    {!showAddIdentificationType ? (
                      <Select
                        placeholder={intlA.formatMessage({ id: 'selectIdentificationType' })}
                        onChange={value => {
                          if (value === 'ADD_NEW') {
                            setShowAddIdentificationType(true);
                            form.setFieldsValue({ identificationType: undefined });
                          } else {
                            setIdentificationType(value);
                          }
                        }}
                        allowClear
                      >
                        {identificationTypes.map(type => (
                          <Option key={type._id} value={type.typeName}>
                            {type.typeName}
                          </Option>
                        ))}
                        <Option
                          value="ADD_NEW"
                          style={{ borderTop: '1px solid #d9d9d9', marginTop: 4, paddingTop: 4 }}
                        >
                          + <FormattedMessage id="addIdentificationType" />
                        </Option>
                      </Select>
                    ) : (
                      <Space.Compact style={{ width: '100%' }}>
                        <AntInput
                          placeholder={intlA.formatMessage({ id: 'enterNewIdentificationType' })}
                          value={newIdentificationType}
                          onChange={e => setNewIdentificationType(e.target.value)}
                          onPressEnter={async () => {
                            if (newIdentificationType.trim()) {
                              try {
                                const response = await axios.post('/identificationTypes', {
                                  typeName: newIdentificationType.trim(),
                                });
                                const updatedTypes = await axios.get('/identificationTypes');
                                setIdentificationTypes(updatedTypes.data);
                                form.setFieldsValue({ identificationType: response.data.typeName });
                                setIdentificationType(response.data.typeName);
                                setShowAddIdentificationType(false);
                                setNewIdentificationType('');
                                message.success(
                                  intlA.formatMessage({ id: 'identificationTypeAdded' })
                                );
                              } catch (error) {
                                message.error(
                                  error.response?.data?.error || 'Failed to add identification type'
                                );
                              }
                            }
                          }}
                        />
                        <AntButton
                          type="primary"
                          onClick={async () => {
                            if (newIdentificationType.trim()) {
                              try {
                                const response = await axios.post('/identificationTypes', {
                                  typeName: newIdentificationType.trim(),
                                });
                                const updatedTypes = await axios.get('/identificationTypes');
                                setIdentificationTypes(updatedTypes.data);
                                form.setFieldsValue({ identificationType: response.data.typeName });
                                setIdentificationType(response.data.typeName);
                                setShowAddIdentificationType(false);
                                setNewIdentificationType('');
                                message.success(
                                  intlA.formatMessage({ id: 'identificationTypeAdded' })
                                );
                              } catch (error) {
                                message.error(
                                  error.response?.data?.error || 'Failed to add identification type'
                                );
                              }
                            }
                          }}
                        >
                          <FormattedMessage id="add" defaultMessage="Add" />
                        </AntButton>
                        <AntButton
                          onClick={() => {
                            setShowAddIdentificationType(false);
                            setNewIdentificationType('');
                          }}
                        >
                          <FormattedMessage id="cancel" defaultMessage="Cancel" />
                        </AntButton>
                      </Space.Compact>
                    )}
                  </AntForm.Item>
                </Col>

                {/* Identification Value Field */}
                <Col xs={24} sm={12}>
                  <AntForm.Item
                    label={
                      <Text strong>
                        <FormattedMessage id="identificationValue" />
                      </Text>
                    }
                    name="identificationValue"
                  >
                    <AntInput
                      placeholder={intlA.formatMessage({ id: 'enterIdentificationNumber' })}
                      disabled={!identificationType && !form.getFieldValue('identificationType')}
                    />
                  </AntForm.Item>
                </Col>

                {/* Address Field */}
                <Col xs={24}>
                  <AntForm.Item
                    label={
                      <Text strong>
                        <FormattedMessage id="address" />
                      </Text>
                    }
                    name="address"
                    rules={[
                      { required: true, message: intlA.formatMessage({ id: 'addressIsRequired' }) },
                    ]}
                  >
                    <TextArea placeholder={intlA.formatMessage({ id: 'address' })} rows={3} />
                  </AntForm.Item>
                </Col>
              </Row>

              <Divider />

              {/* Action Buttons */}
              <Row gutter={16} justify="start">
                <Col>
                  <AntButton
                    type="primary"
                    htmlType="submit"
                    loading={isSubmitting}
                    icon={<SaveOutlined />}
                    size="large"
                    style={{ minWidth: 120 }}
                  >
                    <FormattedMessage id="editButtonText" />
                  </AntButton>
                </Col>
                <Col>
                  <AntButton
                    type="default"
                    onClick={clear}
                    icon={<ReloadOutlined />}
                    size="large"
                    style={{ minWidth: 100 }}
                  >
                    <FormattedMessage id="resetButtonText" />
                  </AntButton>
                </Col>
              </Row>

              {/* Info Note */}
              <div
                style={{
                  marginTop: 24,
                  padding: 16,
                  background: '#f0f8ff',
                  borderRadius: 8,
                  borderLeft: '4px solid #1890ff',
                }}
              >
                <Text type="secondary">
                  Update farmer information. Note: Commodity cannot be changed if there are existing
                  transactions.
                </Text>
              </div>
            </AntForm>
          </Card>
        </>
      )}
    </div>
  );
};

export default EditKisan;
