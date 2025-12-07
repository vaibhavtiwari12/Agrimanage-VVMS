import React, { useEffect, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { useHistory, useParams } from 'react-router-dom';
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
import {
  EditOutlined,
  SaveOutlined,
  ReloadOutlined,
  UserOutlined,
  PhoneOutlined,
  BankOutlined,
  ShopOutlined,
} from '@ant-design/icons';
import { getPurchaserById } from '../../Utility/utility';
import { Shimmer } from '../Common';
import axios from 'axios';

const { Title, Text } = Typography;
const { TextArea } = AntInput;
const { Option } = Select;
const EditPurchaser = () => {
  const { id } = useParams();
  const [form] = AntForm.useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [transactions, setTransactions] = useState([]);
  const [inventory, setInventory] = useState([]);
  const intl = useIntl();
  const history = useHistory();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const details = await getPurchaserById(id);
        if (Object.keys(details).length > 0) {
          // Set form values
          form.setFieldsValue({
            name: details.name,
            companyName: details.companyName,
            phone: details.phone,
            address: details.address,
            itemType: details.purchaserCommodity,
          });
          setTransactions(details.transactions);
        }

        const inventoryData = await axios.get('/inventory/get');
        if (inventoryData.data.length <= 0) {
          history.push('/inventory');
        } else {
          setInventory(inventoryData.data);
        }

        setIsLoading(false);
      } catch (e) {
        setIsLoading(false);
        message.error(intl.formatMessage({ id: 'failedToLoadPurchaserDetails' }));
        console.error('Something Went Wrong ', e);
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
        companyName: values.companyName,
        phone: values.phone,
        address: values.address,
        id,
        purchaserCommodity: values.itemType,
      };

      const response = await fetch('/purchaser/edit', {
        method: 'POST',
        body: JSON.stringify(formData),
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      });

      const result = await response.json();

      if (response.ok) {
        message.success(intl.formatMessage({ id: 'purchaser_editSuccessful' }));
        setTimeout(() => {
          history.push('/purchaser');
        }, 1000);
      } else {
        message.error(intl.formatMessage({ id: 'failedToUpdatePurchaser' }));
      }
    } catch (error) {
      message.error(intl.formatMessage({ id: 'somethingWentWrong' }));
      console.error('Error updating purchaser:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <div style={{ padding: '24px 12px 32px 12px' }}>
      {isLoading ? (
        <>
          {/* Breadcrumb Shimmer */}
          <div style={{ marginBottom: 16 }}>
            <Shimmer width={200} height={16} style={{ marginBottom: 8 }} />
          </div>

          {/* Header Card Shimmer */}
          <Card
            style={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              marginBottom: 24,
              border: 'none',
              borderRadius: 12,
            }}
          >
            <Row align="middle" gutter={16}>
              <Col>
                <div
                  style={{
                    background: 'rgba(255,255,255,0.2)',
                    padding: 16,
                    borderRadius: 8,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <EditOutlined style={{ fontSize: 24, color: 'white' }} />
                </div>
              </Col>
              <Col flex={1}>
                <Shimmer
                  width={180}
                  height={24}
                  style={{ background: 'rgba(255,255,255,0.3)', marginBottom: 8 }}
                />
                <Shimmer width={250} height={16} style={{ background: 'rgba(255,255,255,0.2)' }} />
              </Col>
            </Row>
          </Card>

          {/* Form Card Shimmer */}
          <Card
            style={{
              borderRadius: 12,
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            }}
          >
            <Row gutter={[16, 16]}>
              {/* Name Field Shimmer */}
              <Col xs={24} sm={12}>
                <div style={{ marginBottom: 24 }}>
                  <Shimmer width={80} height={16} style={{ marginBottom: 8 }} />
                  <Shimmer width="100%" height={40} />
                </div>
              </Col>

              {/* Company Name Field Shimmer */}
              <Col xs={24} sm={12}>
                <div style={{ marginBottom: 24 }}>
                  <Shimmer width={120} height={16} style={{ marginBottom: 8 }} />
                  <Shimmer width="100%" height={40} />
                </div>
              </Col>

              {/* Phone Field Shimmer */}
              <Col xs={24} sm={12}>
                <div style={{ marginBottom: 24 }}>
                  <Shimmer width={100} height={16} style={{ marginBottom: 8 }} />
                  <Shimmer width="100%" height={40} />
                </div>
              </Col>

              {/* Commodity Field Shimmer */}
              <Col xs={24} sm={12}>
                <div style={{ marginBottom: 24 }}>
                  <Shimmer width={140} height={16} style={{ marginBottom: 8 }} />
                  <Shimmer width="100%" height={40} />
                </div>
              </Col>

              {/* Address Field Shimmer */}
              <Col xs={24}>
                <div style={{ marginBottom: 24 }}>
                  <Shimmer width={70} height={16} style={{ marginBottom: 8 }} />
                  <Shimmer width="100%" height={80} />
                </div>
              </Col>
            </Row>

            <Divider />

            {/* Action Buttons Shimmer */}
            <Row gutter={16} justify="start">
              <Col>
                <Shimmer width={120} height={40} style={{ borderRadius: 6 }} />
              </Col>
              <Col>
                <Shimmer width={100} height={40} style={{ borderRadius: 6 }} />
              </Col>
            </Row>

            {/* Info Note Shimmer */}
            <div
              style={{
                marginTop: 24,
                padding: 16,
                background: '#f0f8ff',
                borderRadius: 8,
                borderLeft: '4px solid #1890ff',
              }}
            >
              <Shimmer width="80%" height={16} style={{ marginBottom: 4 }} />
              <Shimmer width="60%" height={16} />
            </div>
          </Card>
        </>
      ) : (
        <>
          {/* Breadcrumb */}
          <Breadcrumb style={{ marginBottom: 16 }}>
            <Breadcrumb.Item href="/">
              <FormattedMessage id="home" defaultMessage="Home" />
            </Breadcrumb.Item>
            <Breadcrumb.Item href="/purchaser">
              <FormattedMessage id="purchaser" defaultMessage="Purchaser" />
            </Breadcrumb.Item>
            <Breadcrumb.Item>
              <FormattedMessage id="editPurchaser" />
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
                  <FormattedMessage id="editPurchaser" />
                </Title>
                <Text
                  style={{
                    fontSize: window.innerWidth <= 768 ? 12 : 16,
                    marginTop: 8,
                    color: 'rgba(255, 255, 255, 0.9)',
                  }}
                >
                  <FormattedMessage
                    id="updatePurchaserDescription"
                    defaultMessage="Update purchaser information in the system"
                  />
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
                      { required: true, message: intl.formatMessage({ id: 'nameIsRequired' }) },
                    ]}
                  >
                    <AntInput
                      placeholder={intl.formatMessage({ id: 'name' })}
                      prefix={<UserOutlined style={{ color: '#bfbfbf' }} />}
                    />
                  </AntForm.Item>
                </Col>

                {/* Company Name Field */}
                <Col xs={24} sm={12}>
                  <AntForm.Item
                    label={
                      <Text strong>
                        <FormattedMessage id="companyName" />
                      </Text>
                    }
                    name="companyName"
                    rules={[
                      {
                        required: true,
                        message: intl.formatMessage({ id: 'companyNameIsRequired' }),
                      },
                    ]}
                  >
                    <AntInput
                      placeholder={intl.formatMessage({ id: 'companyName' })}
                      prefix={<BankOutlined style={{ color: '#bfbfbf' }} />}
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
                      { required: true, message: intl.formatMessage({ id: 'phoneIsRequired' }) },
                      { max: 10, message: intl.formatMessage({ id: 'phoneNumberMaxLength' }) },
                    ]}
                  >
                    <AntInput
                      placeholder={intl.formatMessage({ id: 'phone' })}
                      type="number"
                      maxLength={10}
                      prefix={<PhoneOutlined style={{ color: '#bfbfbf' }} />}
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
                        message: intl.formatMessage({ id: 'inventory_itemError' }),
                      },
                    ]}
                  >
                    <Select
                      placeholder={intl.formatMessage({ id: 'selectTradingType' })}
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
                        <FormattedMessage id="commodityChangeNotAllowedPurchaserText" />
                      </Text>
                    </div>
                  )}
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
                      { required: true, message: intl.formatMessage({ id: 'addressIsRequired' }) },
                    ]}
                  >
                    <TextArea placeholder={intl.formatMessage({ id: 'address' })} rows={3} />
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
                  <FormattedMessage
                    id="addPurchaserFormInfoNote"
                    defaultMessage="Fields marked with * are required. Once updated, you can manage transactions and view detailed reports for this purchaser."
                  />
                </Text>
              </div>
            </AntForm>
          </Card>
        </>
      )}
    </div>
  );
};

export default EditPurchaser;
