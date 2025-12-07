import React, { useEffect, useState } from 'react';
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
} from 'antd';
import { Link, useHistory, useParams } from 'react-router-dom';
import { formatDate, getKisanByID, getTodaysFormattedDate } from '../../../Utility/utility';
import { FormShimmer } from '../../Common';
import Kisanmoneysummary from './KisanMoneySummary';
import { FormattedMessage, useIntl } from 'react-intl';
import dayjs from 'dayjs';
import {
  CalendarOutlined,
  DollarOutlined,
  CommentOutlined,
  SaveOutlined,
  ReloadOutlined,
  MinusCircleOutlined,
  UserOutlined,
  PhoneOutlined,
  HomeOutlined,
  InfoCircleOutlined,
} from '@ant-design/icons';

const { Title, Text } = Typography;
const { TextArea } = Input;

const Debitform = () => {
  const { id, type, transactionNumber } = useParams();
  const [form] = Form.useForm();
  const intlA = useIntl();
  const [comment, setComment] = useState('');
  const [amount, setAmount] = useState('');
  const [isCommentValid, setIsCommentValid] = useState('PRISTINE');
  const [isAmountValid, setIsAmountValid] = useState('PRISTINE');
  const [kisan, setKisan] = useState({});
  const [hasError, setHasError] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [backDate, setBackDate] = useState('');
  const [creationDate, setCreationDate] = useState('');
  const [billDate, setBillDate] = useState(formatDate(new Date()));
  const [isDateEditable, setIsDateEditable] = useState(false);
  const [isBillDateValid, setIsBillDateValid] = useState('PRISTINE');
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
        setKisan(await getKisanByID(id));
        setIsLoading(false);
      };
      fetchData();
    } catch (e) {
      setIsLoading(false);
      throw new Error('Something Went Wrong ', e);
    }
  }, []);

  useEffect(() => {
    if (!isDateEditable) {
      billDateChange(getTodaysFormattedDate());
    }
    if (isDateEditable) {
      setBillDate(formatDate(new Date(), 1));
    }
  }, [isDateEditable]);

  useEffect(() => {
    if (transactionNumber && Object.keys(kisan).length > 0) {
      const transactionToedit = kisan.transactions?.filter(
        transac => transac._id === transactionNumber.toString()
      )[0];
      if (transactionToedit) {
        setAmount(transactionToedit.transactionAmount);
        setComment(transactionToedit.comment);
        if (transactionToedit.backDate) {
          setCreationDate(transactionToedit.creationDate);
          setBackDate(transactionToedit.backDate);
        }
        setBillDate(formatDate(transactionToedit.date));
      }
    }
  }, [kisan, transactionNumber]);

  const billDateChange = value => {
    if (type === 'edit') {
      setBillDate(value);
      setIsBillDateValid('');
    } else {
      if (value !== getTodaysFormattedDate()) {
        let hasError = false;
        if (hasError === false) {
          if (kisan.transactions && kisan.transactions.length > 0) {
            const latestKisanTransactionDate = getLatestKisanTransactionDate();
            if (new Date(latestKisanTransactionDate) > new Date(value)) {
              setIsBillDateValid('HASKISANTRANSACTIONPOSTTHISDATE');
              setBillDate(value);
            } else {
              setBillDate(value);
              setIsBillDateValid('');
            }
          } else {
            setBillDate(value);
            setIsBillDateValid('');
          }
        }
      }
      if (value === getTodaysFormattedDate()) {
        setBillDate(value);
        setIsBillDateValid('');
      }
    }
  };

  const getLatestKisanTransactionDate = () => {
    let lastTransactionIndex = kisan.transactions.length - 1;
    let lastTransaction = kisan.transactions[lastTransactionIndex];
    let lastTransactionDate = lastTransaction.date;
    let jsdateString = new Date(lastTransactionDate);
    let kisanLatestTransactionDate = jsdateString.toISOString().split('T')[0];
    return kisanLatestTransactionDate;
  };

  const handleEditDateEnabler = checked => {
    setIsDateEditable(checked);
  };
  const isFormValid = () => {
    let isInvalid = false;

    // Skip amount validation in edit mode since amount field is disabled
    if (type !== 'edit') {
      if (amount.length <= 0) {
        setIsAmountValid('');
        isInvalid = true;
      }
    }

    if (comment.length <= 0) {
      setIsCommentValid('');
      isInvalid = true;
    }
    if (isBillDateValid !== '' && isBillDateValid !== 'PRISTINE') {
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
    setIsBillDateValid('PRISTINE');
  };

  const submit = async values => {
    setIsSubmitting(true);
    try {
      const formData = {
        transaction: {
          balanceAfterThisTransaction: kisan.balance + (amount - amount * 2),
          transactionAmount: amount - amount * 2,
          type: 'DEBIT',
          comment: values.comment || comment,
        },
      };
      if (
        (isBillDateValid === '' || isBillDateValid === 'PRISTINE') &&
        billDate !== getTodaysFormattedDate() &&
        isDateEditable
      ) {
        const backDateHours = new Date().getHours();
        const backDateMinutes = new Date().getMinutes();
        const backDateSeconds = new Date().getSeconds();
        formData.transaction['backDateHours'] = backDateHours;
        formData.transaction['backDateMinutes'] = backDateMinutes;
        formData.transaction['backDateSeconds'] = backDateSeconds;
        formData.transaction['backDate'] = billDate;
      }

      const response = await fetch(`/kisan/AddTransaction/${id}`, {
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
          history.push(`/kisanDetails/${id}`);
        }, 1000);
      } else {
        message.error('Failed to process transaction');
      }
    } catch (error) {
      message.error('Something went wrong');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = () => {
    if (isFormValid()) {
      setIsSubmitting(true);
      const formData = {
        transactionNumber,
        comment,
      };
      fetch(`/kisan/editTransaction/${id}`, {
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
            history.push(`/kisanDetails/${id}`);
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
        <FormShimmer />
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
              <Link to="/kisan" style={{ color: '#1677ff' }}>
                <FormattedMessage id="kisan" defaultMessage="Kisan" />
              </Link>
            </Breadcrumb.Item>
            <Breadcrumb.Item>
              <Link to={`/kisanDetails/${kisan._id}`} style={{ color: '#1677ff' }}>
                <FormattedMessage id="details" defaultMessage="Details" />
              </Link>
            </Breadcrumb.Item>
            <Breadcrumb.Item>
              <FormattedMessage id="debitForm" defaultMessage="Debit Form" />
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
                  <MinusCircleOutlined
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
                    id="giveAdvanceKisanButtonText"
                    defaultMessage="Give Advance to Farmer"
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
                    ? 'Edit debit transaction'
                    : 'Create new advance payment for farmer'}
                </Text>
              </Col>
            </Row>
          </Card>

          {/* Farmer Information Card - Similar to AdvanceSettlementForm */}
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
                  <FormattedMessage id="farmerInformation" defaultMessage="Farmer Information" />
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
                    {kisan.name || '-'}
                  </div>
                </div>
              </Col>
              <Col xs={24} sm={12} lg={6}>
                <div>
                  <div style={{ color: '#666', fontSize: 14, marginBottom: 4 }}>
                    <FormattedMessage id="fatherNameLabel" defaultMessage="Father's Name" />
                  </div>
                  <div style={{ fontSize: 16, fontWeight: 500 }}>{kisan.fatherName || '-'}</div>
                </div>
              </Col>
              <Col xs={24} sm={12} lg={6}>
                <div>
                  <div style={{ color: '#666', fontSize: 14, marginBottom: 4 }}>
                    <FormattedMessage id="phoneNumber" defaultMessage="Phone Number" />
                  </div>
                  <div style={{ fontSize: 16, fontWeight: 500 }}>{kisan.phone || '-'}</div>
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
                      color: kisan.balance < 0 ? '#ff4d4f' : '#52c41a',
                    }}
                  >
                    ₹{(kisan.balance || 0).toLocaleString('en-IN')}
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
              onFinish={type === 'add' ? submit : undefined}
              size="large"
              initialValues={{
                amount: amount,
                comment: comment,
              }}
            >
              <Row gutter={[16, 16]}>
                {/* Date Section */}
                <Col xs={24}>
                  <Card
                    size="small"
                    style={{ backgroundColor: '#f8f9fa', border: '1px solid #e9ecef' }}
                    title={
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <CalendarOutlined style={{ color: '#1677ff' }} />
                        <span style={{ fontSize: 16 }}>
                          {type === 'edit' && backDate !== '' ? (
                            <FormattedMessage
                              id="backDatedEntryMsg"
                              defaultMessage="Back Dated Entry"
                            />
                          ) : type === 'edit' && backDate === '' ? (
                            <FormattedMessage
                              id="billDateSectionTitle"
                              defaultMessage="Bill Date"
                            />
                          ) : (
                            <FormattedMessage id="entryDateSection" defaultMessage="Entry Date" />
                          )}
                        </span>
                      </div>
                    }
                  >
                    {type === 'edit' && backDate !== '' && (
                      <div
                        style={{
                          marginBottom: 16,
                          padding: 12,
                          background: '#e6f4ff',
                          borderRadius: 6,
                        }}
                      >
                        <div style={{ color: '#666', fontSize: 14, marginBottom: 4 }}>
                          <FormattedMessage
                            id="actualBillCreationDateMsg"
                            defaultMessage="Actual Bill Creation Date"
                          />
                        </div>
                        <div style={{ color: '#1677ff', fontWeight: 500 }}>
                          {formatDate(creationDate).split('-').reverse().join('-')}
                        </div>
                      </div>
                    )}

                    {type !== 'edit' && (
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          marginBottom: 16,
                        }}
                      >
                        <Text strong>
                          <FormattedMessage
                            id="backDatedEntryMsg"
                            defaultMessage="Back Dated Entry"
                          />
                          ?
                        </Text>
                        <Switch
                          checked={isDateEditable}
                          onChange={handleEditDateEnabler}
                          checkedChildren="Yes"
                          unCheckedChildren="No"
                        />
                      </div>
                    )}

                    <Form.Item
                      label={
                        <Text strong>
                          <FormattedMessage id="entryDateLabel" defaultMessage="Entry Date" />
                        </Text>
                      }
                      validateStatus={
                        isBillDateValid !== 'PRISTINE' && isBillDateValid !== '' ? 'error' : ''
                      }
                      help={
                        isBillDateValid === 'HASPURCHASERTRANSACTIONPOSTTHISDATE' ? (
                          <FormattedMessage
                            id="purchaserHasTxnAfterThisDateMsg"
                            defaultMessage="Purchaser has transaction after this date"
                          />
                        ) : isBillDateValid === 'HASKISANTRANSACTIONPOSTTHISDATE' ? (
                          <FormattedMessage
                            id="kisanHasTxnAfterThisDateMsgForEntry"
                            defaultMessage="Kisan has transaction after this date"
                          />
                        ) : null
                      }
                    >
                      <DatePicker
                        value={billDate ? dayjs(billDate, 'YYYY-MM-DD') : null}
                        format="YYYY-MM-DD"
                        disabled={!isDateEditable && type !== 'edit'}
                        onChange={(date, dateString) => billDateChange(dateString)}
                        style={{ width: '100%' }}
                        disabledDate={current => current && current.isAfter(dayjs(), 'day')}
                        allowClear={false}
                      />
                    </Form.Item>
                  </Card>
                </Col>

                {/* Amount Field */}
                <Col xs={24} sm={12}>
                  <Form.Item
                    label={
                      <Text strong>
                        <FormattedMessage id="advanceDebited" defaultMessage="Advance Debited" />{' '}
                        (₹)
                      </Text>
                    }
                    name="amount"
                    rules={
                      type === 'edit'
                        ? [] // No validation in edit mode since field is disabled
                        : [
                            { required: true, message: intlA.formatMessage({ id: 'amountSBGTZ' }) },
                            {
                              validator: (_, value) => {
                                if (value && parseInt(value) <= 0) {
                                  return Promise.reject(
                                    new Error('Amount should be greater than zero')
                                  );
                                }
                                return Promise.resolve();
                              },
                            },
                          ]
                    }
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
                    htmlType={type === 'add' ? 'submit' : 'button'}
                    onClick={type === 'edit' ? handleEdit : undefined}
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
                      ? 'You are editing an existing debit transaction.'
                      : 'This will create an advance payment to the farmer and update their balance accordingly.'}
                  </Text>
                </Space>
              </div>
            </Form>
          </Card>
        </>
      )}
    </div>
  );
};

export default Debitform;
