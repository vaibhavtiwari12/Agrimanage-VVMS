import {
  Card,
  Row,
  Col,
  Form as AntForm,
  Input as AntInput,
  Button as AntButton,
  Typography,
  message,
  Breadcrumb,
  Divider,
} from 'antd';
import { PlusOutlined, SaveOutlined, ReloadOutlined, AppstoreAddOutlined } from '@ant-design/icons';
import { useState, useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { FormattedMessage, useIntl } from 'react-intl';

const { Title, Text } = Typography;

const AddInventoryType = () => {
  const [form] = AntForm.useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const intlA = useIntl();
  const history = useHistory();

  useEffect(() => {
    document.title = 'VVMS - Add Commodity';

    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const clear = () => {
    form.resetFields();
  };

  const onFinish = async values => {
    setIsSubmitting(true);
    try {
      const formData = {
        name: values.name,
      };

      const response = await fetch('/inventory/add', {
        method: 'POST',
        body: JSON.stringify(formData),
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      });

      const result = await response.json();

      if (response.ok) {
        message.success(
          intlA.formatMessage({
            id: 'inventory_addSuccessful',
            defaultMessage: 'Commodity added successfully',
          })
        );
        clear();
        setTimeout(() => {
          history.push('/inventory');
        }, 1000);
      } else {
        message.error(
          intlA.formatMessage({ id: 'common.error', defaultMessage: 'Failed to add commodity' })
        );
      }
    } catch (error) {
      message.error(
        intlA.formatMessage({ id: 'common.error', defaultMessage: 'Something went wrong' })
      );
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
        <Breadcrumb.Item href="/inventory">
          <FormattedMessage id="inventory" defaultMessage="Inventory" />
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          <FormattedMessage id="addCommodity" defaultMessage="Add Commodity" />
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
          boxShadow: '0 4px 16px rgba(102, 126, 234, 0.3)',
        }}
      >
        <Row align="middle" gutter={16}>
          <Col>
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.2)',
                padding: isMobile ? 8 : 12,
                borderRadius: 12,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <AppstoreAddOutlined style={{ fontSize: isMobile ? 18 : 24, color: '#fff' }} />
            </div>
          </Col>
          <Col flex={1}>
            <Title
              level={isMobile ? 4 : 3}
              style={{
                margin: 0,
                fontSize: isMobile ? 16 : 20,
                fontWeight: 600,
                color: '#fff',
                marginBottom: 4,
              }}
            >
              <FormattedMessage id="inventoryAddHeading" defaultMessage="Add New Commodity" />
            </Title>
            <Text
              style={{
                fontSize: isMobile ? 12 : 14,
                color: 'rgba(255, 255, 255, 0.9)',
                display: 'block',
              }}
            >
              <FormattedMessage
                id="addCommodityDescription"
                defaultMessage="Add a new commodity to the inventory system"
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
            <Col xs={24}>
              <AntForm.Item
                label={
                  <Text strong>
                    <FormattedMessage id="inventory_itemName" defaultMessage="Commodity Name" />
                  </Text>
                }
                name="name"
                rules={[
                  {
                    required: true,
                    message: intlA.formatMessage({
                      id: 'inventory_itemError',
                      defaultMessage: 'Commodity name is required',
                    }),
                  },
                ]}
              >
                <AntInput
                  placeholder={intlA.formatMessage({
                    id: 'inventory_itemName',
                    defaultMessage: 'Enter commodity name',
                  })}
                  prefix={<AppstoreAddOutlined style={{ color: '#bfbfbf' }} />}
                />
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
                <FormattedMessage id="createEntryButtonText" defaultMessage="Create Entry" />
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
                <FormattedMessage id="resetButtonText" defaultMessage="Reset" />
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
                id="addCommodityFormInfoNote"
                defaultMessage="Add commodities that will be traded in your system. Once added, farmers and purchasers can use these commodities for transactions."
              />
            </Text>
          </div>
        </AntForm>
      </Card>
    </div>
  );
};

export default AddInventoryType;
