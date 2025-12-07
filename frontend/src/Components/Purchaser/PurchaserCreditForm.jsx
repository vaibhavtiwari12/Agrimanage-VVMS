import { getPurchaserById } from '../../Utility/utility';
import Purchasersummary from './PurchaserSummary';
import React, { useEffect } from 'react';
import {
  Form,
  Input,
  Button,
  Alert,
  Breadcrumb,
  Spin,
  DatePicker,
  message,
  Switch,
  Card,
  Row,
  Col,
  Typography,
  Space,
  Divider,
  Modal,
} from 'antd';
import {
  CalendarOutlined,
  DollarOutlined,
  CommentOutlined,
  SaveOutlined,
  ReloadOutlined,
  CreditCardOutlined,
  UserOutlined,
  PhoneOutlined,
  HomeOutlined,
  InfoCircleOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons';

import { useState } from 'react';
import { Link, useHistory, useParams } from 'react-router-dom';
import { FormattedMessage, useIntl } from 'react-intl';
import { DetailPageShimmer } from '../Common';
import moment from 'moment';

const { Title, Text } = Typography;
const { TextArea } = Input;

const Purchasercreditform = () => {
  const { id, type, transactionNumber } = useParams();
  const [form] = Form.useForm();
  const intlA = useIntl();
  const [comment, setComment] = useState('');
  const [amount, setAmount] = useState('');
  const [isCommentValid, setIsCommentValid] = useState('PRISTINE');
  const [isAmountValid, setIsAmountValid] = useState('PRISTINE');
  const [purchaser, setPurchaser] = useState({});
  const [hasError, setHasError] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [isNegativeAmountEntry, setIsNegativeAmountEntry] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const history = useHistory();

  // Check if device is mobile or tablet - make it responsive
  const [isMobileOrTablet, setIsMobileOrTablet] = useState(window.innerWidth <= 900);

  // Handle window resize for responsive behavior
  useEffect(() => {
    const handleResize = () => {
      setIsMobileOrTablet(window.innerWidth <= 900);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    try {
      console.log(id, type, transactionNumber);
      const fetchData = async () => {
        setPurchaser(await getPurchaserById(id));
        setIsLoading(false);
      };
      fetchData();
    } catch (e) {
      setIsLoading(false);
      throw new Error('Something Went Wrong ', e);
    }
  }, []);

  useEffect(() => {
    if (transactionNumber && Object.keys(purchaser).length > 0) {
      const transactionToedit = purchaser.transactions?.filter(
        transac => transac._id === transactionNumber.toString()
      )[0];
      if (transactionToedit) {
        setAmount(transactionToedit.transactionAmount);
        setComment(transactionToedit.comment);
      }
    }
  }, [purchaser, transactionNumber]);

  const isFormValid = () => {
    let isInvalid = false;
    if (amount.length <= 0) {
      setIsAmountValid('');
      isInvalid = true;
    }
    if (comment.length <= 0) {
      setIsCommentValid('');
      isInvalid = true;
    }
    if (parseInt(amount) === 0) {
      setIsAmountValid('');
      isInvalid = true;
    }
    return isInvalid ? false : true;
  };

  const commentChange = e => {
    setComment(e.target.value);
    setIsCommentValid('');
  };

  const amountChange = e => {
    setAmount(e.target.value);
    setIsAmountValid('');
  };

  const clear = () => {
    form.resetFields();
    setAmount('');
    setComment('');
    setHasError(false);
    setIsCommentValid('PRISTINE');
    setIsAmountValid('PRISTINE');
  };

  const checkAmountValidity = values => {
    if (isFormValid()) {
      if (parseInt(amount) < 0) {
        setIsNegativeAmountEntry(true);
      } else {
        submit();
      }
    } else {
      setHasError(true);
    }
  };

  const agree = () => {
    submit();
  };

  const submit = async () => {
    setIsSubmitting(true);
    try {
      const formData = {
        transaction: {
          transactionAmount: parseInt(amount),
          type: 'CREDIT',
          comment,
        },
      };

      const response = await fetch(`/purchaser/AddCreditTransaction/${id}`, {
        method: 'POST',
        body: JSON.stringify(formData),
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        message.success(
          type === 'add'
            ? intlA.formatMessage({ id: 'entryAddSuccessMsg' })
            : intlA.formatMessage({ id: 'entryEditSuccessMsg' })
        );
        clear();
        setTimeout(() => {
          history.push(`/purchaserDetails/${id}`);
        }, 1000);
      } else {
        message.error('Failed to process transaction');
      }
    } catch (error) {
      message.error('Something went wrong');
    } finally {
      setIsSubmitting(false);
      setIsNegativeAmountEntry(false);
    }
  };

  const handleEdit = () => {
    if (isFormValid()) {
      setIsSubmitting(true);
      const formData = {
        transactionNumber,
        comment,
      };
      fetch(`/purchaser/editTransaction/${id}`, {
        method: 'POST',
        body: JSON.stringify(formData),
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      })
        .then(res => res.json())
        .then(res => {
          message.success('Entry updated successfully');
          clear();
          setTimeout(() => {
            history.push(`/purchaserDetails/${id}`);
          }, 1000);
          setIsSubmitting(false);
        })
        .catch(error => {
          setIsSubmitting(false);
          message.error('Something Went Wrong');
        });
    } else {
      setHasError(true);
    }
  };

  return (
    <div style={{ padding: '24px 12px 32px 12px' }}>
      {isLoading ? (
        <DetailPageShimmer />
      ) : (
        <>
          {/* Breadcrumb */}
          <Breadcrumb style={{ marginBottom: 16 }}>
            <Breadcrumb.Item>
              <Link to="/" style={{ color: '#1677ff' }}>
                <FormattedMessage id="home" defaultMessage="Home" />
              </Link>
            </Breadcrumb.Item>
            <Breadcrumb.Item>
              <Link to="/purchaser" style={{ color: '#1677ff' }}>
                <FormattedMessage id="purchaser" defaultMessage="Purchaser" />
              </Link>
            </Breadcrumb.Item>
            <Breadcrumb.Item>
              <Link to={`/purchaserDetails/${purchaser._id}`} style={{ color: '#1677ff' }}>
                <FormattedMessage id="details" defaultMessage="Details" />
              </Link>
            </Breadcrumb.Item>
            <Breadcrumb.Item>
              <FormattedMessage id="purchaserCreditForm" defaultMessage="Credit Transaction" />
            </Breadcrumb.Item>
          </Breadcrumb>

          {/* Header Card - Similar to AdvanceSettlementForm */}
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
                  <CreditCardOutlined
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
                  <FormattedMessage
                    id="purchaserPaymentEntryButtonText"
                    defaultMessage="Purchaser Payment Entry"
                  />
                </Title>
                <Text
                  style={{
                    fontSize: window.innerWidth <= 768 ? 12 : 16,
                    marginTop: 8,
                    color: 'rgba(255, 255, 255, 0.9)',
                  }}
                >
                  {type === 'edit'
                    ? 'Edit credit transaction'
                    : 'Add new payment entry for purchaser'}
                </Text>
              </Col>
            </Row>
          </Card>

          {/* Purchaser Information Card - Similar to AdvanceSettlementForm */}
          <Card
            style={{
              borderRadius: 12,
              marginBottom: 24,
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            }}
            title={
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <UserOutlined style={{ fontSize: 20, color: '#1677ff' }} />
                <span style={{ fontWeight: 700, fontSize: 18 }}>
                  <FormattedMessage
                    id="purchaserInformation"
                    defaultMessage="Purchaser Information"
                  />
                </span>
              </div>
            }
          >
            <Row gutter={[24, 16]}>
              <Col xs={24} sm={12} lg={6}>
                <div>
                  <div style={{ color: '#666', fontSize: 14, marginBottom: 4 }}>
                    <FormattedMessage id="fullName" defaultMessage="Full Name" />
                  </div>
                  <div style={{ fontSize: 16, fontWeight: 500, color: '#1677ff' }}>
                    {purchaser.name || '-'}
                  </div>
                </div>
              </Col>
              <Col xs={24} sm={12} lg={6}>
                <div>
                  <div style={{ color: '#666', fontSize: 14, marginBottom: 4 }}>
                    <FormattedMessage id="fatherNameLabel" defaultMessage="Father's Name" />
                  </div>
                  <div style={{ fontSize: 16, fontWeight: 500 }}>{purchaser.fatherName || '-'}</div>
                </div>
              </Col>
              <Col xs={24} sm={12} lg={6}>
                <div>
                  <div style={{ color: '#666', fontSize: 14, marginBottom: 4 }}>
                    <FormattedMessage id="phoneNumber" defaultMessage="Phone Number" />
                  </div>
                  <div style={{ fontSize: 16, fontWeight: 500 }}>{purchaser.phone || '-'}</div>
                </div>
              </Col>
              <Col xs={24} sm={12} lg={6}>
                <div>
                  <div style={{ color: '#666', fontSize: 14, marginBottom: 4 }}>
                    <FormattedMessage id="currentBalance" defaultMessage="Current Balance" />
                  </div>
                  <div
                    style={{
                      fontSize: 16,
                      fontWeight: 600,
                      color: purchaser.balance < 0 ? '#ff4d4f' : '#52c41a',
                    }}
                  >
                    ₹{(purchaser.balance || 0).toLocaleString('en-IN')}
                  </div>
                </div>
              </Col>
            </Row>
          </Card>

          {/* Form Card - Similar to AdvanceSettlementForm */}
          <Card
            style={{
              borderRadius: 12,
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            }}
          >
            <Form
              form={form}
              layout="vertical"
              onFinish={checkAmountValidity}
              size="large"
              initialValues={{
                amount: amount,
                comment: comment,
              }}
            >
              <Row gutter={[16, 16]}>
                {/* Amount Field */}
                <Col xs={24} sm={12}>
                  <Form.Item
                    label={
                      <Text strong>
                        <FormattedMessage id="paymentAmount" defaultMessage="Payment Amount" /> (₹)
                      </Text>
                    }
                    name="amount"
                    rules={[
                      { required: true, message: intlA.formatMessage({ id: 'amountIsRequired' }) },
                      {
                        validator: (_, value) => {
                          if (value && parseInt(value) === 0) {
                            return Promise.reject(new Error('Amount cannot be zero'));
                          }
                          return Promise.resolve();
                        },
                      },
                    ]}
                  >
                    <Input
                      disabled={type === 'edit'}
                      type="number"
                      placeholder="Enter amount"
                      prefix={<DollarOutlined style={{ color: '#bfbfbf' }} />}
                      onChange={amountChange}
                      value={amount}
                    />
                  </Form.Item>
                </Col>

                {/* Comment Field */}
                <Col xs={24} sm={12}>
                  <Form.Item
                    label={
                      <Text strong>
                        <FormattedMessage id="comment" defaultMessage="Comment" />
                      </Text>
                    }
                    name="comment"
                    rules={[
                      { required: true, message: intlA.formatMessage({ id: 'commentIsRequired' }) },
                    ]}
                  >
                    <Input
                      placeholder="Enter comment"
                      prefix={<CommentOutlined style={{ color: '#bfbfbf' }} />}
                      onChange={commentChange}
                      value={comment}
                    />
                  </Form.Item>
                </Col>
              </Row>

              <Divider />

              {/* Action Buttons - Similar to AdvanceSettlementForm */}
              <Row gutter={16} justify="start">
                <Col>
                  <Button
                    type="primary"
                    htmlType="submit"
                    loading={isSubmitting}
                    icon={<SaveOutlined />}
                    size="large"
                    style={{ minWidth: 120 }}
                  >
                    {type === 'add' ? (
                      <FormattedMessage id="createEntryButtonText" defaultMessage="Create Entry" />
                    ) : (
                      <FormattedMessage id="editButtonText" defaultMessage="Update Entry" />
                    )}
                  </Button>
                </Col>
                <Col>
                  <Button
                    type="default"
                    onClick={clear}
                    icon={<ReloadOutlined />}
                    size="large"
                    style={{ minWidth: 100 }}
                  >
                    <FormattedMessage id="resetButtonText" defaultMessage="Reset" />
                  </Button>
                </Col>
              </Row>

              {/* Info Note - Similar to AdvanceSettlementForm */}
              <div
                style={{
                  marginTop: 24,
                  padding: 16,
                  background: '#f0f8ff',
                  borderRadius: 8,
                  borderLeft: '4px solid #1890ff',
                }}
              >
                <Space>
                  <InfoCircleOutlined style={{ color: '#1890ff' }} />
                  <Text type="secondary">
                    {type === 'edit'
                      ? 'You are editing an existing credit transaction.'
                      : "This will add a new payment entry and update the purchaser's balance accordingly."}
                  </Text>
                </Space>
              </div>
            </Form>
          </Card>

          {/* Negative Amount Confirmation Modal */}
          <Modal
            title={
              <Space>
                <ExclamationCircleOutlined style={{ color: '#faad14' }} />
                <FormattedMessage
                  id="negativePaymentPopupHeading"
                  defaultMessage="Confirm Negative Payment"
                />
              </Space>
            }
            open={isNegativeAmountEntry}
            onOk={agree}
            onCancel={() => setIsNegativeAmountEntry(false)}
            okText={<FormattedMessage id="confirm" defaultMessage="Confirm" />}
            cancelText={<FormattedMessage id="cancel" defaultMessage="Cancel" />}
            okButtonProps={{ danger: true }}
          >
            <div style={{ padding: '16px 0' }}>
              <Text>
                <FormattedMessage
                  id="negativePaymentPopupContent"
                  defaultMessage="Are you sure you want to enter a negative payment amount of"
                />
                <Text strong style={{ color: '#ff4d4f', marginLeft: '8px' }}>
                  ₹{amount}
                </Text>
                ?
              </Text>
            </div>
          </Modal>
        </>
      )}
    </div>
  );
};

export default Purchasercreditform;
