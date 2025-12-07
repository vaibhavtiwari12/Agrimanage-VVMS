import { useEffect, useRef, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { Breadcrumb, Button, Card, Tag, Row, Col, Statistic, Divider, Tooltip, Modal } from 'antd';
import { Link } from 'react-router-dom';
import { FormattedMessage, useIntl } from 'react-intl';
import {
  fetchCustomTransactionsForPurchaser,
  getPurchaserById,
  dateConverter,
  toFixed,
  getPurchaserLastActivity,
} from '../../Utility/utility';
import {
  PlusCircleOutlined,
  SwapOutlined,
  FileAddOutlined,
  EditOutlined,
  WarningFilled,
  ArrowRightOutlined,
  UnorderedListOutlined,
  ClockCircleFilled,
  UserOutlined,
  TransactionOutlined,
  PhoneFilled,
  TableOutlined,
  AppstoreOutlined,
  PrinterOutlined,
  DeleteOutlined,
  ShopOutlined,
} from '@ant-design/icons';
import { Shimmer } from '../Common';
import Purchasertransactiontable from './PurchaserTransactionTable';

const Purchaserdetails = () => {
  const { id } = useParams();
  const [purchaser, setPurchaser] = useState({});
  const [customPurchaserTransaction, setCustomPurchaserTransaction] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [mobileTransactionView, setMobileTransactionView] = useState('card');
  const [isMobileOrTablet, setIsMobileOrTablet] = useState(window.innerWidth <= 900);
  const history = useHistory();
  const intlA = useIntl();

  // Handle window resize for responsive behavior
  useEffect(() => {
    const handleResize = () => {
      setIsMobileOrTablet(window.innerWidth <= 900);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const purchaserData = await getPurchaserById(id);
        const transactionData = await fetchCustomTransactionsForPurchaser(id);

        setPurchaser(purchaserData);
        setCustomPurchaserTransaction(transactionData);
        setIsLoading(false);
      } catch (e) {
        setIsLoading(false);
        console.error('Something Went Wrong ', e);
      }
    };

    fetchData();
  }, [id]);

  const updatePurchaser = async () => {
    try {
      const purchaserData = await getPurchaserById(id);
      const transactionData = await fetchCustomTransactionsForPurchaser(id);

      setPurchaser(purchaserData);
      setCustomPurchaserTransaction(transactionData);
    } catch (e) {
      console.error('Something Went Wrong ', e);
    }
  };
  useEffect(() => {
    if (purchaser.name) {
      document.title = 'VVMS - Purchaser - ' + purchaser.name;
    }
  }, [purchaser]);

  const handleButtonclick = link => {
    history.push(link);
  };

  const isLoadingData = !purchaser || !purchaser.name;
  return (
    <div style={{ minHeight: '100vh', padding: '0 0 32px 0' }}>
      {isLoading ? (
        <div style={{ padding: isMobileOrTablet ? '24px 12px' : '24px 24px' }}>
          {/* Breadcrumb shimmer */}
          <div style={{ margin: '16px 0 0 16px' }}>
            <Shimmer width={200} height={16} />
          </div>

          {/* Header card shimmer */}
          <div
            style={{
              margin: isMobileOrTablet ? '24px 12px 0 12px' : '24px 24px 0 24px',
              background: '#f5f5f5',
              borderRadius: 12,
              padding: isMobileOrTablet ? 16 : 24,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <Shimmer
                width={isMobileOrTablet ? 48 : 56}
                height={isMobileOrTablet ? 48 : 56}
                borderRadius="50%"
              />
              <div style={{ flex: 1 }}>
                <Shimmer
                  width={200}
                  height={isMobileOrTablet ? 20 : 26}
                  style={{ marginBottom: 8 }}
                />
                <Shimmer
                  width={160}
                  height={isMobileOrTablet ? 15 : 17}
                  style={{ marginBottom: 4 }}
                />
                <Shimmer width={120} height={isMobileOrTablet ? 15 : 17} />
              </div>
              <Shimmer width={100} height={32} borderRadius={6} />
            </div>
          </div>

          {/* Summary cards shimmer */}
          <div
            style={{
              margin: isMobileOrTablet ? '24px 12px 0 12px' : '24px 24px 0 24px',
              display: 'grid',
              gridTemplateColumns: isMobileOrTablet ? '1fr' : 'repeat(3, 1fr)',
              gap: 16,
            }}
          >
            {[...Array(3)].map((_, idx) => (
              <div
                key={idx}
                style={{
                  background: '#fff',
                  borderRadius: 12,
                  padding: 20,
                  border: '1px solid #f0f0f0',
                }}
              >
                <div
                  style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                >
                  <div style={{ flex: 1 }}>
                    <Shimmer width={140} height={16} style={{ marginBottom: 8 }} />
                    <Shimmer width={80} height={28} />
                  </div>
                  <Shimmer width={48} height={48} borderRadius="50%" />
                </div>
              </div>
            ))}
          </div>

          {/* Information card shimmer */}
          <div
            style={{
              margin: isMobileOrTablet ? '24px 12px 0 12px' : '24px 24px 0 24px',
              background: '#fff',
              borderRadius: 12,
              padding: 24,
              border: '1px solid #f0f0f0',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24 }}>
              <Shimmer width={20} height={20} />
              <Shimmer width={180} height={20} />
            </div>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: isMobileOrTablet ? '1fr' : 'repeat(3, 1fr)',
                gap: '24px 16px',
              }}
            >
              {[...Array(6)].map((_, idx) => (
                <div key={idx}>
                  <Shimmer width={120} height={15} style={{ marginBottom: 4 }} />
                  <Shimmer width={100} height={18} />
                </div>
              ))}
            </div>
          </div>

          {/* Quick actions shimmer */}
          <div
            style={{
              margin: isMobileOrTablet ? '24px 12px 0 12px' : '24px 24px 0 24px',
              background: '#fff',
              borderRadius: 12,
              padding: 24,
              border: '1px solid #f0f0f0',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24 }}>
              <Shimmer width={20} height={20} />
              <Shimmer width={120} height={20} />
            </div>
            <Shimmer width={isMobileOrTablet ? '100%' : '50%'} height={48} borderRadius={8} />
          </div>

          {/* Transaction history shimmer */}
          <div
            style={{
              margin: isMobileOrTablet ? '24px 12px 24px 12px' : '24px 24px 24px 24px',
              background: '#fff',
              borderRadius: 12,
              padding: 24,
              border: '1px solid #f0f0f0',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24 }}>
              <Shimmer width={20} height={20} />
              <Shimmer width={160} height={20} />
            </div>

            {/* Toggle buttons shimmer for mobile */}
            {isMobileOrTablet && (
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 16 }}>
                <Shimmer width={120} height={32} borderRadius={6} />
              </div>
            )}

            {/* Transaction table shimmer */}
            <div>
              {!isMobileOrTablet ? (
                <div>
                  {/* Table header shimmer */}
                  <div
                    style={{
                      display: 'flex',
                      gap: 16,
                      padding: '16px 0',
                      borderBottom: '2px solid #f1f3f4',
                      marginBottom: 16,
                    }}
                  >
                    {[40, 80, 120, 90, 80, 80, 80, 90, 80, 100, 80].map((width, idx) => (
                      <Shimmer key={idx} width={width} height={16} />
                    ))}
                  </div>
                  {/* Date group and rows */}
                  <Shimmer width={120} height={20} borderRadius={6} style={{ marginBottom: 8 }} />
                  {[...Array(4)].map((_, idx) => (
                    <div
                      key={idx}
                      style={{
                        display: 'flex',
                        gap: 16,
                        padding: '12px 0',
                        borderBottom: '1px solid #f8f9fa',
                      }}
                    >
                      {[30, 80, 100, 80, 70, 70, 70, 80, 60, 90, 60].map((width, cellIdx) => (
                        <Shimmer key={cellIdx} width={width} height={16} />
                      ))}
                    </div>
                  ))}
                </div>
              ) : (
                <div>
                  {/* Mobile cards shimmer */}
                  <Shimmer width={120} height={20} borderRadius={6} style={{ marginBottom: 16 }} />
                  {[...Array(3)].map((_, idx) => (
                    <div
                      key={idx}
                      style={{
                        background: '#f8f9fa',
                        borderRadius: 8,
                        padding: 16,
                        marginBottom: 12,
                        border: '1px solid #f0f0f0',
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          marginBottom: 12,
                        }}
                      >
                        <Shimmer width={100} height={18} />
                        <Shimmer width={60} height={16} borderRadius={12} />
                      </div>
                      <div style={{ display: 'grid', gap: 8 }}>
                        {[...Array(4)].map((_, rowIdx) => (
                          <div
                            key={rowIdx}
                            style={{ display: 'flex', justifyContent: 'space-between' }}
                          >
                            <Shimmer width={60 + rowIdx * 10} height={14} />
                            <Shimmer width={80 + rowIdx * 10} height={14} />
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <>
          {/* Breadcrumb */}
          <Breadcrumb style={{ margin: '16px 0 0 16px' }}>
            <Breadcrumb.Item href="/">
              <FormattedMessage id="home" defaultMessage="Home" />
            </Breadcrumb.Item>
            <Breadcrumb.Item href="/purchaser">
              <FormattedMessage id="purchaser" defaultMessage="Purchaser" />
            </Breadcrumb.Item>
            <Breadcrumb.Item>
              <FormattedMessage id="details" defaultMessage="Details" />
            </Breadcrumb.Item>
          </Breadcrumb>

          {/* Header Card with Purchaser Profile */}
          <Card
            style={{
              margin: isMobileOrTablet ? '16px 12px 0 12px' : '16px 24px 0 24px',
              borderRadius: 12,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: '#fff',
            }}
            bodyStyle={{ padding: isMobileOrTablet ? 16 : 24 }}
          >
            <Row gutter={[16, 16]} align="middle">
              <Col xs={24} sm={18} md={20} lg={20}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                  <div
                    style={{
                      width: isMobileOrTablet ? 48 : 56,
                      height: isMobileOrTablet ? 48 : 56,
                      borderRadius: '50%',
                      background: 'rgba(255, 255, 255, 0.2)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: isMobileOrTablet ? 20 : 24,
                      color: '#fff',
                    }}
                  >
                    <ShopOutlined />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div
                      style={{
                        fontSize: isMobileOrTablet ? 20 : 26,
                        fontWeight: 700,
                        color: '#fff',
                        lineHeight: isMobileOrTablet ? 1.3 : 1.4,
                        marginBottom: 4,
                      }}
                    >
                      {isLoadingData ? (
                        <Shimmer
                          width={180}
                          height={22}
                          style={{ background: 'rgba(255,255,255,0.3)' }}
                        />
                      ) : (
                        purchaser.name || '-'
                      )}
                    </div>
                    <div
                      style={{
                        fontSize: isMobileOrTablet ? 15 : 17,
                        color: '#e3f2fd',
                        lineHeight: 1.4,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 8,
                        marginBottom: 4,
                      }}
                    >
                      {isLoadingData ? (
                        <Shimmer
                          width={140}
                          height={18}
                          style={{ background: 'rgba(255,255,255,0.25)' }}
                        />
                      ) : (
                        `${purchaser.purchaserCommodity ? purchaser.purchaserCommodity : '-'} | ${purchaser.companyName || '-'}`
                      )}
                    </div>
                    <div
                      style={{
                        fontSize: isMobileOrTablet ? 15 : 17,
                        color: '#e3f2fd',
                        lineHeight: 1.4,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 6,
                      }}
                    >
                      <PhoneFilled style={{ fontSize: 16 }} />
                      {isLoadingData ? (
                        <Shimmer
                          width={100}
                          height={18}
                          style={{ background: 'rgba(255,255,255,0.25)' }}
                        />
                      ) : (
                        purchaser.phone || '-'
                      )}
                    </div>
                  </div>
                </div>
              </Col>
              <Col xs={24} sm={6} md={4} lg={4}>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                    marginTop: isMobileOrTablet ? 8 : 0,
                  }}
                >
                  {isLoadingData ? (
                    <Shimmer
                      width={100}
                      height={32}
                      style={{ background: 'rgba(255,255,255,0.3)', borderRadius: 6 }}
                    />
                  ) : (
                    <Button
                      type="primary"
                      icon={<EditOutlined />}
                      size={isMobileOrTablet ? 'middle' : 'large'}
                      style={{
                        fontWeight: 600,
                        borderRadius: 6,
                        backgroundColor: '#fff',
                        borderColor: '#fff',
                        color: '#667eea',
                        fontSize: 16,
                      }}
                      onClick={e => handleButtonclick(`/editPurchaser/${id}`)}
                    >
                      <FormattedMessage id="editPurchaser" defaultMessage="Edit Purchaser" />
                    </Button>
                  )}
                </div>
              </Col>
            </Row>
          </Card>

          {/* Summary Statistics Cards */}
          <Row
            gutter={isMobileOrTablet ? [0, 16] : [16, 16]}
            style={{
              margin: isMobileOrTablet ? '16px 12px 0 12px' : '16px 24px 0 24px',
            }}
          >
            <Col xs={24} sm={12} lg={8}>
              <Card style={{ borderRadius: 12 }} bodyStyle={{ padding: 20 }}>
                <div
                  style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                >
                  <div style={{ flex: 1 }}>
                    <div style={{ color: '#666', fontSize: 16, marginBottom: 8 }}>
                      <FormattedMessage
                        id="outstandingPayment"
                        defaultMessage="Outstanding Payment"
                      />
                    </div>
                    <div
                      style={{
                        fontSize: 22,
                        fontWeight: 700,
                        color: isLoadingData
                          ? '#000'
                          : purchaser.balance < 0
                            ? '#ff4d4f'
                            : '#52c41a',
                      }}
                    >
                      {isLoadingData ? (
                        <Shimmer width={80} height={24} />
                      ) : (
                        `₹${(purchaser.balance || 0).toLocaleString('en-IN')}`
                      )}
                    </div>
                  </div>
                  <div
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: '50%',
                      background: '#fff1f0',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <WarningFilled style={{ color: '#ff4d4f', fontSize: 16 }} />
                  </div>
                </div>
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={8}>
              <Card style={{ borderRadius: 12 }} bodyStyle={{ padding: 20 }}>
                <div
                  style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                >
                  <div style={{ flex: 1 }}>
                    <div style={{ color: '#666', fontSize: 16, marginBottom: 8 }}>
                      <FormattedMessage
                        id="totalTransactions"
                        defaultMessage="Total Transactions"
                      />
                    </div>
                    <div style={{ fontSize: 22, fontWeight: 700, color: '#000' }}>
                      {isLoadingData ? (
                        <Shimmer width={40} height={24} />
                      ) : (
                        customPurchaserTransaction?.length || 0
                      )}
                    </div>
                  </div>
                  <div
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: '50%',
                      background: '#f6ffed',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <UnorderedListOutlined style={{ color: '#52c41a', fontSize: 16 }} />
                  </div>
                </div>
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={8}>
              <Card style={{ borderRadius: 12 }} bodyStyle={{ padding: 20 }}>
                <div
                  style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                >
                  <div style={{ flex: 1 }}>
                    <div style={{ color: '#666', fontSize: 16, marginBottom: 8 }}>
                      <FormattedMessage id="lastActivity" defaultMessage="Last Activity" />
                    </div>
                    <div style={{ fontSize: 22, fontWeight: 700, color: '#000' }}>
                      {isLoadingData ? (
                        <Shimmer width={80} height={24} />
                      ) : (
                        getPurchaserLastActivity(customPurchaserTransaction)
                      )}
                    </div>
                  </div>
                  <div
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: '50%',
                      background: '#fffbe6',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <ClockCircleFilled style={{ color: '#faad14', fontSize: 16 }} />
                  </div>
                </div>
              </Card>
            </Col>
          </Row>

          {/* Purchaser Information Card */}
          <Card
            style={{
              margin: isMobileOrTablet ? '16px 12px 0 12px' : '16px 24px 0 24px',
              borderRadius: 12,
            }}
            title={
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <ShopOutlined style={{ fontSize: 20, color: '#1677ff' }} />
                <span style={{ fontWeight: 700, fontSize: 20 }}>
                  <FormattedMessage
                    id="purchaserInformation"
                    defaultMessage="Purchaser Information"
                  />
                </span>
              </div>
            }
          >
            <Row gutter={[24, 16]}>
              <Col xs={24} sm={12} lg={8}>
                <div>
                  <div style={{ color: '#666', fontSize: 15, marginBottom: 4 }}>
                    <FormattedMessage id="purchaserName" defaultMessage="Purchaser Name" />
                  </div>
                  <div style={{ fontSize: 17, fontWeight: 500 }}>
                    {isLoadingData ? <Shimmer width={120} height={18} /> : purchaser.name || '-'}
                  </div>
                </div>
              </Col>
              <Col xs={24} sm={12} lg={8}>
                <div>
                  <div style={{ color: '#666', fontSize: 15, marginBottom: 4 }}>
                    <FormattedMessage id="commodity" defaultMessage="Commodity" />
                  </div>
                  <div style={{ fontSize: 17, fontWeight: 500 }}>
                    {isLoadingData ? (
                      <Shimmer width={80} height={18} />
                    ) : purchaser.purchaserCommodity ? (
                      <Tag color="#ff7875" style={{ borderRadius: 8, padding: '2px 12px' }}>
                        {purchaser.purchaserCommodity}
                      </Tag>
                    ) : (
                      '-'
                    )}
                  </div>
                </div>
              </Col>
              <Col xs={24} sm={12} lg={8}>
                <div>
                  <div style={{ color: '#666', fontSize: 15, marginBottom: 4 }}>
                    <FormattedMessage id="companyName" defaultMessage="Company Name" />
                  </div>
                  <div style={{ fontSize: 17, fontWeight: 500 }}>
                    {isLoadingData ? (
                      <Shimmer width={120} height={18} />
                    ) : (
                      purchaser.companyName || '-'
                    )}
                  </div>
                </div>
              </Col>
              <Col xs={24} sm={12} lg={8}>
                <div>
                  <div style={{ color: '#666', fontSize: 15, marginBottom: 4 }}>
                    <FormattedMessage id="phoneNumber" defaultMessage="Phone Number" />
                  </div>
                  <div style={{ fontSize: 17, fontWeight: 500 }}>
                    {isLoadingData ? <Shimmer width={90} height={18} /> : purchaser.phone || '-'}
                  </div>
                </div>
              </Col>
              <Col xs={24} sm={12} lg={8}>
                <div>
                  <div style={{ color: '#666', fontSize: 15, marginBottom: 4 }}>
                    <FormattedMessage id="address" defaultMessage="Address" />
                  </div>
                  <div style={{ fontSize: 17, fontWeight: 500 }}>
                    {isLoadingData ? <Shimmer width={160} height={18} /> : purchaser.address || '-'}
                  </div>
                </div>
              </Col>
              <Col xs={24} sm={12} lg={8}>
                <div>
                  <div style={{ color: '#666', fontSize: 15, marginBottom: 4 }}>
                    <FormattedMessage id="paymentStatus" defaultMessage="Payment Status" />
                  </div>
                  <div style={{ fontSize: 17, fontWeight: 500 }}>
                    {isLoadingData ? (
                      <Shimmer width={90} height={18} />
                    ) : purchaser.balance < 0 ? (
                      <Tag
                        color="red"
                        style={{ fontWeight: 600, borderRadius: 8, padding: '4px 12px' }}
                      >
                        <FormattedMessage id="pendingPayment" defaultMessage="Pending Payment" />
                      </Tag>
                    ) : (
                      <Tag
                        color="green"
                        style={{ fontWeight: 600, borderRadius: 8, padding: '4px 12px' }}
                      >
                        <FormattedMessage id="settled" defaultMessage="Settled" />
                      </Tag>
                    )}
                  </div>
                </div>
              </Col>
            </Row>
          </Card>

          {/* Quick Actions Card */}
          <Card
            style={{
              margin: isMobileOrTablet ? '16px 12px 0 12px' : '16px 24px 0 24px',
              borderRadius: 12,
            }}
            title={
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <PlusCircleOutlined style={{ fontSize: 20, color: '#1677ff' }} />
                <span style={{ fontWeight: 700, fontSize: 20 }}>
                  <FormattedMessage id="quickActions" defaultMessage="Quick Actions" />
                </span>
              </div>
            }
          >
            <Row gutter={[12, 12]}>
              <Col xs={24} sm={12}>
                <Button
                  type="primary"
                  size="large"
                  icon={<FileAddOutlined />}
                  ghost
                  {...(isMobileOrTablet ? { block: true } : {})}
                  style={{
                    height: 48,
                    height: 48,
                    borderRadius: 8,
                    fontWeight: 600,
                    color: '#52c41a',
                    borderColor: '#52c41a',
                    background: 'transparent',
                    maxWidth: isMobileOrTablet ? '100%' : 300,
                    width: isMobileOrTablet ? '100%' : '300px',
                    minWidth: isMobileOrTablet ? undefined : 120,
                  }}
                  onClick={e => handleButtonclick(`/purchaserCreditForm/${id}/add`)}
                >
                  <FormattedMessage
                    id="purchaserPaymentEntryButtonText"
                    defaultMessage="Record Payment"
                  />
                </Button>
              </Col>
            </Row>
          </Card>

          {/* Transaction History Section */}
          <Card
            style={{
              margin: isMobileOrTablet ? '16px 12px 24px 12px' : '16px 24px 24px 24px',
              borderRadius: 12,
            }}
            title={
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <TransactionOutlined style={{ fontSize: 20, color: '#1677ff' }} />
                <span style={{ fontWeight: 700, fontSize: 20 }}>
                  <FormattedMessage id="transactionHistory" defaultMessage="Transaction History" />
                </span>
              </div>
            }
          >
            {/* Mobile View Toggle - only show on mobile/tablet */}
            {isMobileOrTablet && (
              <div
                style={{
                  marginBottom: 16,
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  padding: '0 8px',
                  gap: 16,
                  width: '100%',
                }}
              >
                <Button.Group>
                  <Button
                    type={mobileTransactionView === 'table' ? 'primary' : 'default'}
                    icon={<TableOutlined />}
                    onClick={() => setMobileTransactionView('table')}
                    size="small"
                  >
                    <FormattedMessage id="table" defaultMessage="Table" />
                  </Button>
                  <Button
                    type={mobileTransactionView === 'card' ? 'primary' : 'default'}
                    icon={<AppstoreOutlined />}
                    onClick={() => setMobileTransactionView('card')}
                    size="small"
                  >
                    <FormattedMessage id="cards" defaultMessage="Cards" />
                  </Button>
                </Button.Group>
              </div>
            )}

            {/* Transaction table with mobile view mode */}
            <Purchasertransactiontable
              purchaser={customPurchaserTransaction}
              purchaserDetails={purchaser}
              updatePurchaser={updatePurchaser}
              mobileTransactionView={mobileTransactionView}
              isMobileOrTablet={isMobileOrTablet}
            />
          </Card>
        </>
      )}
    </div>
  );
};

export default Purchaserdetails;
