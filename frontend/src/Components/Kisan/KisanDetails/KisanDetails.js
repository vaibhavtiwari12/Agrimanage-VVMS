import { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { Breadcrumb, Button, Card, Tag, Row, Col, Statistic, Divider, Tooltip, Modal } from 'antd';
import {
  getKisanByID,
  dateConverter,
  toFixed,
  getKisanLastActivity,
} from '../../../Utility/utility';
import Kisantransactionstable from './kisanTransactionsTable.jsx';
import KisanTransactionTableExport from './kisanTransactionTableExport';
import { Link } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
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
} from '@ant-design/icons';
import { Shimmer, EllipsisText } from '../../Common';
import './kisanDetailsClean.css';

const Kisandetails = () => {
  const { id } = useParams();
  const [kisan, setKisan] = useState({});
  const history = useHistory();

  // Check if device is mobile or tablet - make it responsive
  const [isMobileOrTablet, setIsMobileOrTablet] = useState(window.innerWidth <= 900);

  // Mobile view mode state for transaction cards/table toggle
  const [mobileTransactionView, setMobileTransactionView] = useState('card');

  // Handle window resize for responsive behavior
  useEffect(() => {
    const handleResize = () => {
      setIsMobileOrTablet(window.innerWidth <= 900);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    console.log(id);
    try {
      const fetchData = async () => {
        setKisan(await getKisanByID(id));
      };
      fetchData();
    } catch (e) {
      throw new Error('Something Went Wrong ', e);
    }
  }, []);

  const updateKisan = () => {
    try {
      const fetchData = async () => {
        setKisan(await getKisanByID(id));
      };
      fetchData();
    } catch (e) {
      throw new Error('Something Went Wrong ', e);
    }
  };

  useEffect(() => {
    console.log('KISAN ', kisan);
    if (kisan.name) {
      document.title = 'VVMS - Kisan - ' + kisan.name;
    }
  }, [kisan]);

  const handleButtonclick = link => {
    history.push(link);
  };

  const isLoading = !kisan || !kisan.name;

  return (
    <div className="kisan-details-container" style={{ minHeight: '100vh', padding: '0 0 32px 0' }}>
      {/* Breadcrumb */}
      <Breadcrumb style={{ margin: '16px 0 0 16px' }}>
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
          <FormattedMessage id="details" defaultMessage="Details" />
        </Breadcrumb.Item>
      </Breadcrumb>

      {/* Header Card with Farmer Profile */}
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
                <UserOutlined />
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
                  {isLoading ? (
                    <Shimmer
                      width={180}
                      height={22}
                      style={{ background: 'rgba(255,255,255,0.3)' }}
                    />
                  ) : (
                    kisan.name || '-'
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
                  {isLoading ? (
                    <Shimmer
                      width={140}
                      height={18}
                      style={{ background: 'rgba(255,255,255,0.25)' }}
                    />
                  ) : (
                    `${kisan.kisanCommodity ? kisan.kisanCommodity : '-'} | ${kisan.fatherName || '-'}`
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
                  {isLoading ? (
                    <Shimmer
                      width={100}
                      height={18}
                      style={{ background: 'rgba(255,255,255,0.25)' }}
                    />
                  ) : (
                    kisan.phone || '-'
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
              {isLoading ? (
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
                  onClick={e => handleButtonclick(`/editKisan/${id}`)}
                >
                  <FormattedMessage id="editKisan" defaultMessage="Edit Kisan" />
                </Button>
              )}
            </div>
          </Col>
        </Row>
      </Card>

      {/* Summary Statistics Cards */}
      <Row
        gutter={[16, 16]}
        className="kisan-summary-stats-row"
        style={{ margin: isMobileOrTablet ? '16px 12px 0 12px' : '16px 24px 0 24px' }}
      >
        <Col xs={24} sm={12} lg={6}>
          <Card style={{ borderRadius: 12 }} bodyStyle={{ padding: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ flex: 1 }}>
                <div
                  style={{ color: '#666', fontSize: isMobileOrTablet ? 14 : 16, marginBottom: 8 }}
                >
                  <FormattedMessage id="outstandingAdvance" defaultMessage="Outstanding Advance" />
                </div>
                <div
                  style={{
                    fontSize: isMobileOrTablet ? 22 : 28,
                    fontWeight: 700,
                    color: isLoading ? '#000' : kisan.balance < 0 ? '#ff4d4f' : '#52c41a',
                  }}
                >
                  {isLoading ? (
                    <Shimmer width={80} height={24} />
                  ) : (
                    `₹${(kisan.balance || 0).toLocaleString('en-IN')}`
                  )}
                </div>
              </div>
              <div
                style={{
                  width: 48,
                  height: 48,
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
        <Col xs={24} sm={12} lg={6}>
          <Card style={{ borderRadius: 12 }} bodyStyle={{ padding: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ flex: 1 }}>
                <div
                  style={{ color: '#666', fontSize: isMobileOrTablet ? 14 : 16, marginBottom: 8 }}
                >
                  <FormattedMessage id="totalCarryForward" defaultMessage="Total Carry Forward" />
                </div>
                <div
                  style={{ fontSize: isMobileOrTablet ? 22 : 28, fontWeight: 700, color: '#000' }}
                >
                  {isLoading ? (
                    <Shimmer width={80} height={24} />
                  ) : (
                    `₹${(kisan.totalCarryForward || 0).toLocaleString('en-IN')}`
                  )}
                </div>
              </div>
              <div
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: '50%',
                  background: '#e6f4ff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <ArrowRightOutlined style={{ color: '#1890ff', fontSize: 16 }} />
              </div>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card style={{ borderRadius: 12 }} bodyStyle={{ padding: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ flex: 1 }}>
                <div
                  style={{ color: '#666', fontSize: isMobileOrTablet ? 14 : 16, marginBottom: 8 }}
                >
                  <FormattedMessage id="totalTransactions" defaultMessage="Total Transactions" />
                </div>
                <div
                  style={{ fontSize: isMobileOrTablet ? 22 : 28, fontWeight: 700, color: '#000' }}
                >
                  {isLoading ? <Shimmer width={40} height={24} /> : kisan.transactions?.length || 0}
                </div>
              </div>
              <div
                style={{
                  width: 48,
                  height: 48,
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
        <Col xs={24} sm={12} lg={6}>
          <Card style={{ borderRadius: 12 }} bodyStyle={{ padding: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ flex: 1 }}>
                <div
                  style={{ color: '#666', fontSize: isMobileOrTablet ? 14 : 16, marginBottom: 8 }}
                >
                  <FormattedMessage id="lastActivity" defaultMessage="Last Activity" />
                </div>
                <div
                  style={{ fontSize: isMobileOrTablet ? 22 : 28, fontWeight: 700, color: '#000' }}
                >
                  {isLoading ? (
                    <Shimmer width={80} height={24} />
                  ) : (
                    getKisanLastActivity(kisan.transactions)
                  )}
                </div>
              </div>
              <div
                style={{
                  width: 48,
                  height: 48,
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

      {/* Farmer Information Card */}
      <Card
        style={{
          margin: isMobileOrTablet ? '16px 12px 0 12px' : '16px 24px 0 24px',
          borderRadius: 12,
        }}
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, width: '100%' }}>
            <UserOutlined
              style={{ fontSize: isMobileOrTablet ? 18 : 20, color: '#1677ff', flexShrink: 0 }}
            />
            <EllipsisText
              style={{
                fontWeight: 700,
                fontSize: isMobileOrTablet ? 16 : 20,
                flex: 1,
              }}
            >
              <FormattedMessage id="farmerInformation" defaultMessage="Farmer Information" />
            </EllipsisText>
          </div>
        }
      >
        <Row gutter={[24, 16]}>
          <Col xs={24} sm={12} lg={8}>
            <div>
              <div style={{ color: '#666', fontSize: isMobileOrTablet ? 14 : 15, marginBottom: 4 }}>
                <FormattedMessage id="fullName" defaultMessage="Full Name" />
              </div>
              <div style={{ fontSize: isMobileOrTablet ? 16 : 17, fontWeight: 500 }}>
                {isLoading ? <Shimmer width={120} height={18} /> : kisan.name || '-'}
              </div>
            </div>
          </Col>
          <Col xs={24} sm={12} lg={8}>
            <div>
              <div style={{ color: '#666', fontSize: isMobileOrTablet ? 14 : 15, marginBottom: 4 }}>
                <FormattedMessage id="commodity" defaultMessage="Commodity" />
              </div>
              <div style={{ fontSize: isMobileOrTablet ? 16 : 17, fontWeight: 500 }}>
                {isLoading ? (
                  <Shimmer width={80} height={18} />
                ) : kisan.kisanCommodity ? (
                  <Tag color="#52c41a" style={{ borderRadius: 8, padding: '2px 12px' }}>
                    {kisan.kisanCommodity}
                  </Tag>
                ) : (
                  '-'
                )}
              </div>
            </div>
          </Col>
          <Col xs={24} sm={12} lg={8}>
            <div>
              <div style={{ color: '#666', fontSize: isMobileOrTablet ? 14 : 15, marginBottom: 4 }}>
                <FormattedMessage id="fatherNameLabel" defaultMessage="Father's Name" />
              </div>
              <div style={{ fontSize: isMobileOrTablet ? 16 : 17, fontWeight: 500 }}>
                {isLoading ? <Shimmer width={120} height={18} /> : kisan.fatherName || '-'}
              </div>
            </div>
          </Col>
          <Col xs={24} sm={12} lg={8}>
            <div>
              <div style={{ color: '#666', fontSize: isMobileOrTablet ? 14 : 15, marginBottom: 4 }}>
                <FormattedMessage id="phoneNumber" defaultMessage="Phone Number" />
              </div>
              <div style={{ fontSize: isMobileOrTablet ? 16 : 17, fontWeight: 500 }}>
                {isLoading ? <Shimmer width={90} height={18} /> : kisan.phone || '-'}
              </div>
            </div>
          </Col>
          <Col xs={24} sm={12} lg={8}>
            <div>
              <div style={{ color: '#666', fontSize: isMobileOrTablet ? 14 : 15, marginBottom: 4 }}>
                <FormattedMessage id="address" defaultMessage="Address" />
              </div>
              <div style={{ fontSize: isMobileOrTablet ? 16 : 17, fontWeight: 500 }}>
                {isLoading ? <Shimmer width={160} height={18} /> : kisan.address || '-'}
              </div>
            </div>
          </Col>
          <Col xs={24} sm={12} lg={8}>
            <div>
              <div style={{ color: '#666', fontSize: isMobileOrTablet ? 14 : 15, marginBottom: 4 }}>
                <FormattedMessage id="accountStatus" defaultMessage="Account Status" />
              </div>
              <div style={{ fontSize: isMobileOrTablet ? 16 : 17, fontWeight: 500 }}>
                {isLoading ? (
                  <Shimmer width={90} height={18} />
                ) : kisan.balance < 0 ? (
                  <Tag
                    color="red"
                    style={{ fontWeight: 600, borderRadius: 8, padding: '4px 12px' }}
                  >
                    <FormattedMessage id="outstandingDues" defaultMessage="Outstanding Dues" />
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
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, width: '100%' }}>
            <PlusCircleOutlined
              style={{ fontSize: isMobileOrTablet ? 18 : 20, color: '#1677ff', flexShrink: 0 }}
            />
            <EllipsisText
              style={{
                fontWeight: 700,
                fontSize: isMobileOrTablet ? 16 : 20,
                flex: 1,
              }}
            >
              <FormattedMessage id="quickActions" defaultMessage="Quick Actions" />
            </EllipsisText>
          </div>
        }
      >
        <Row gutter={[12, 12]} justify={isMobileOrTablet ? 'start' : 'center'}>
          <Col xs={24} sm={8} md={6} lg={6} xl={5}>
            <Button
              type="default"
              size="large"
              icon={<PlusCircleOutlined />}
              block
              style={{
                height: 48,
                borderRadius: 8,
                fontWeight: 600,
                color: '#1677ff',
                borderColor: '#1677ff',
              }}
              onClick={e => handleButtonclick(`/kisanDebitForm/${id}/add`)}
            >
              <FormattedMessage id="giveAdvanceKisanButtonText" defaultMessage="Give Advance" />
            </Button>
          </Col>
          <Col xs={24} sm={8} md={6} lg={6} xl={5}>
            <Button
              type="default"
              size="large"
              icon={<SwapOutlined />}
              block
              style={{
                height: 48,
                borderRadius: 8,
                fontWeight: 600,
                color: '#faad14',
                borderColor: '#faad14',
              }}
              onClick={e => handleButtonclick(`/kisanAdvanceSettlement/${id}/add`)}
            >
              <FormattedMessage
                id="depositAdvanceKisanButtonText"
                defaultMessage="Settle Advance"
              />
            </Button>
          </Col>
          <Col xs={24} sm={8} md={6} lg={6} xl={5}>
            <Button
              type="default"
              size="large"
              icon={<FileAddOutlined />}
              block
              style={{
                height: 48,
                borderRadius: 8,
                fontWeight: 600,
                color: '#52c41a',
                borderColor: '#52c41a',
              }}
              onClick={e => handleButtonclick(`/kisanCreditForm/${id}/add`)}
            >
              <FormattedMessage id="createBillKisanButtonText" defaultMessage="Create Bill" />
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
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, width: '100%' }}>
            <TransactionOutlined
              style={{ fontSize: isMobileOrTablet ? 18 : 20, color: '#1677ff', flexShrink: 0 }}
            />
            <EllipsisText
              style={{
                fontWeight: 700,
                fontSize: isMobileOrTablet ? 16 : 20,
                flex: 1,
              }}
            >
              <FormattedMessage id="transactionHistory" defaultMessage="Transaction History" />
            </EllipsisText>
          </div>
        }
        extra={
          <KisanTransactionTableExport
            transactions={kisan.transactions || []}
            kisanName={kisan.name || ''}
            buttonText={
              <FormattedMessage id="exportTransactions" defaultMessage="Export Transactions" />
            }
          />
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
        <Kisantransactionstable
          kisan={kisan}
          updateKisan={updateKisan}
          mobileTransactionView={mobileTransactionView}
          isMobileOrTablet={isMobileOrTablet}
        />
      </Card>
    </div>
  );
};

export default Kisandetails;
