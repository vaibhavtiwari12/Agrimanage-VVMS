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
} from 'antd';
import {
  ShopOutlined,
  SaveOutlined,
  ReloadOutlined,
  HomeOutlined,
  UserOutlined,
  PhoneOutlined,
  BankOutlined,
} from '@ant-design/icons';
import { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { FormattedMessage, useIntl } from 'react-intl';
import axios from 'axios';

const { Title, Text } = Typography;
const { TextArea } = AntInput;
const { Option } = Select;

const AddPurchaser = () => {
  const [form] = AntForm.useForm();
  const [name, setName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [inventory, setInventory] = useState([]);
  const [itemType, setItemType] = useState('');
  const intlA = useIntl();
  const history = useHistory();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const inventoryData = await axios.get('/inventory/get');
        if (inventoryData.data.length <= 0) {
          history.push('/inventory');
        } else {
          setInventory(inventoryData.data);
        }
      } catch (error) {
        message.error('Failed to fetch inventory data');
      }
    };
    fetchData();
  }, [history]);

  const clear = () => {
    form.resetFields();
    setName('');
    setCompanyName('');
    setPhone('');
    setAddress('');
    setItemType('');
  };

  const onFinish = async values => {
    setIsSubmitting(true);
    try {
      const formData = {
        name: values.name,
        companyName: values.companyName,
        phone: values.phone,
        address: values.address,
        purchaserCommodity: values.itemType,
      };

      const response = await fetch('/purchaser/add', {
        method: 'POST',
        body: JSON.stringify(formData),
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      });

      const result = await response.json();

      if (response.ok) {
        message.success(intlA.formatMessage({ id: 'purchaser_addSuccessful' }));
        clear();
        setTimeout(() => {
          history.push('/purchaser');
        }, 1000);
      } else {
        message.error('Failed to add purchaser');
      }
    } catch (error) {
      message.error('Something went wrong');
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <div style={{ padding: '24px 12px 32px 12px' }}>
      {/* Breadcrumb */}
      <Breadcrumb style={{ marginBottom: 16 }}>
        <Breadcrumb.Item href="/">
          <FormattedMessage id="home" defaultMessage="Home" />
        </Breadcrumb.Item>
        <Breadcrumb.Item href="/purchaser">
          <FormattedMessage id="purchaser" defaultMessage="Purchaser" />
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          <FormattedMessage id="newPurchaserDeatils" />
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
        <Row align="middle" gutter={16}>
          <Col>
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.2)',
                padding: window.innerWidth <= 768 ? 8 : 12,
                borderRadius: 12,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <ShopOutlined
                style={{ fontSize: window.innerWidth <= 768 ? 18 : 24, color: '#fff' }}
              />
            </div>
          </Col>
          <Col flex={1}>
            <Title
              level={window.innerWidth <= 768 ? 4 : 3}
              style={{
                margin: 0,
                fontSize: window.innerWidth <= 768 ? 16 : 20,
                fontWeight: 600,
                color: '#fff',
                marginBottom: 4,
              }}
            >
              <FormattedMessage id="newPurchaserDeatils" />
            </Title>
            <Text
              style={{
                fontSize: window.innerWidth <= 768 ? 12 : 14,
                color: 'rgba(255, 255, 255, 0.9)',
                display: 'block',
              }}
            >
              Add a new purchaser to the system
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
                rules={[{ required: true, message: intlA.formatMessage({ id: 'nameIsRequired' }) }]}
              >
                <AntInput
                  placeholder={intlA.formatMessage({ id: 'name' })}
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
                  { required: true, message: intlA.formatMessage({ id: 'companyNameIsRequired' }) },
                ]}
              >
                <AntInput
                  placeholder={intlA.formatMessage({ id: 'companyName' })}
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
                  { required: true, message: intlA.formatMessage({ id: 'phoneIsRequired' }) },
                  { max: 10, message: 'Phone number cannot exceed 10 digits' },
                ]}
              >
                <AntInput
                  placeholder={intlA.formatMessage({ id: 'phone' })}
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
                  { required: true, message: intlA.formatMessage({ id: 'inventory_itemError' }) },
                ]}
              >
                <Select
                  placeholder={intlA.formatMessage({ id: 'selectTradingType' })}
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
                <FormattedMessage id="addPurchaserButtonText" />
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
                defaultMessage="All fields marked with * are required. Please ensure all information is accurate before submitting."
              />
            </Text>
          </div>
        </AntForm>
      </Card>
    </div>
  );
};
export default AddPurchaser;
