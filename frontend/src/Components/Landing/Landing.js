import { useEffect, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { Card, Row, Col, Spin, Typography, Statistic, Space, Divider } from 'antd';
import {
  UserOutlined,
  ShoppingCartOutlined,
  DollarOutlined,
  InboxOutlined,
} from '@ant-design/icons';
import Dashline1 from './DashBoardLine1/DashLine1';
import DashLine1Item2 from './DashBoardLine1/DashLine1Item2';
import DashLine1Item3 from './DashBoardLine1/DashLine1Item3';
import QuantitySold from './DashboardLine2/TopSoldItem';
import Topkisandefaulters from './DashboardLine2/TopKisanDefaulters';
import TopPurchaserDefaulter from './DashboardLine2/TopPurchaserDefaulter';
import TopSoldItem from './DashboardLine2/TopSoldItem';
import TopSellerKisans from './DashboardLine2/TopSellerKisans';
import TopBuyingPurchaser from './DashboardLine2/TopBuyingPurchaser';
import { DashboardShimmer } from '../Common';
import axios from 'axios';

const { Title, Text } = Typography;

const Landing = () => {
  const [dashBoardData, setDashBoardData] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    document.title = 'VVMS - Home';
    const fetchData = async () => {
      const fetchedData = await axios.get('/dashboardinfo');
      console.log('Dashboard', fetchedData.data);
      setDashBoardData(fetchedData.data);
      setIsLoading(false);
    };
    fetchData();
  }, []);

  if (isLoading) {
    return <DashboardShimmer />;
  }

  return (
    <div style={{ padding: '24px', paddingBottom: '40px' }}>
      {/* Header Section */}
      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <Text type="secondary" style={{ fontSize: '14px' }}>
          <FormattedMessage id="welcomeMsg" />
        </Text>
        <Title
          level={2}
          style={{
            margin: '8px 0 0 0',
            color: '#1890ff',
            fontWeight: 600,
          }}
        >
          <FormattedMessage id="brandName" />
        </Title>
      </div>

      {/* Statistics Cards */}
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col xs={24} sm={12} lg={6}>
          <Card
            hoverable
            style={{
              borderRadius: '8px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              border: '1px solid #f0f0f0',
            }}
          >
            <Statistic
              title={<FormattedMessage id="totalAdvacePendingWithKisan" />}
              value={dashBoardData.totalAdvancePending}
              valueStyle={{ color: '#ff4d4f', fontSize: '24px', fontWeight: 'bold' }}
              prefix="₹"
              suffix=""
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card
            hoverable
            style={{
              borderRadius: '8px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              border: '1px solid #f0f0f0',
            }}
          >
            <Statistic
              title={<FormattedMessage id="totalPurchaserOutstanding" />}
              value={dashBoardData.totalPurchaserPending}
              valueStyle={{ color: '#ff4d4f', fontSize: '24px', fontWeight: 'bold' }}
              prefix="₹"
              suffix=""
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card
            hoverable
            style={{
              borderRadius: '8px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              border: '1px solid #f0f0f0',
            }}
          >
            <Statistic
              title={<FormattedMessage id="totalItemweight" />}
              value={dashBoardData.totalItemWeight}
              valueStyle={{ color: '#1890ff', fontSize: '24px', fontWeight: 'bold' }}
              suffix="KG"
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card
            hoverable
            style={{
              borderRadius: '8px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              border: '1px solid #f0f0f0',
            }}
          >
            <Statistic
              title={<FormattedMessage id="totalBagsSoldToday" />}
              value={dashBoardData.totalBagsSold}
              valueStyle={{ color: '#52c41a', fontSize: '24px', fontWeight: 'bold' }}
              suffix="Packs"
            />
          </Card>
        </Col>
      </Row>

      {/* Charts Section */}
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col xs={24} lg={8}>
          <Card
            title={<span style={{ fontSize: '16px', fontWeight: '600' }}>Commissions</span>}
            hoverable
            style={{
              height: '320px',
              borderRadius: '8px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              border: '1px solid #f0f0f0',
            }}
            bodyStyle={{ height: 'calc(100% - 57px)', padding: '16px' }}
            headStyle={{ borderBottom: '1px solid #f0f0f0' }}
          >
            {dashBoardData.commissions && <Dashline1 commissions={dashBoardData.commissions} />}
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card
            title={<span style={{ fontSize: '16px', fontWeight: '600' }}>Cash Paid</span>}
            hoverable
            style={{
              height: '320px',
              borderRadius: '8px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              border: '1px solid #f0f0f0',
            }}
            bodyStyle={{ height: 'calc(100% - 57px)', padding: '16px' }}
            headStyle={{ borderBottom: '1px solid #f0f0f0' }}
          >
            <DashLine1Item2
              kisan={dashBoardData.advanceDataGivenAndTakenConsolidated}
              purchaser={dashBoardData.purchaserData}
            />
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card
            title={<span style={{ fontSize: '16px', fontWeight: '600' }}>Advance</span>}
            hoverable
            style={{
              height: '320px',
              borderRadius: '8px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              border: '1px solid #f0f0f0',
            }}
            bodyStyle={{ height: 'calc(100% - 57px)', padding: '16px' }}
            headStyle={{ borderBottom: '1px solid #f0f0f0' }}
          >
            {dashBoardData.advanceDataGivenAndTakenConsolidated && (
              <DashLine1Item3 advanceData={dashBoardData.advanceDataGivenAndTakenConsolidated} />
            )}
          </Card>
        </Col>
      </Row>

      {/* Analytics Section */}
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col xs={24} lg={8}>
          <Card
            hoverable
            style={{
              height: '400px',
              borderRadius: '8px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              border: '1px solid #f0f0f0',
            }}
            bodyStyle={{ height: '100%', padding: '16px' }}
          >
            <Topkisandefaulters defaulters={dashBoardData.topKisanDefaulters} />
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card
            hoverable
            style={{
              height: '400px',
              borderRadius: '8px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              border: '1px solid #f0f0f0',
            }}
            bodyStyle={{ height: '100%', padding: '16px' }}
          >
            <TopPurchaserDefaulter defaulters={dashBoardData.topPurchaserDefaulters} />
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card
            title={
              <span style={{ fontSize: '16px', fontWeight: '600' }}>Top Sold Item (In KGs)</span>
            }
            hoverable
            style={{
              height: '400px',
              borderRadius: '8px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              border: '1px solid #f0f0f0',
            }}
            bodyStyle={{ height: 'calc(100% - 57px)', padding: '16px' }}
            headStyle={{ borderBottom: '1px solid #f0f0f0' }}
          >
            <TopSoldItem items={dashBoardData.topSoldItems} />
          </Card>
        </Col>
      </Row>

      {/* Bottom Analytics Section */}
      <Row gutter={[16, 16]} style={{ marginBottom: '32px' }}>
        <Col xs={24} lg={12}>
          <Card
            title={
              <span style={{ fontSize: '16px', fontWeight: '600' }}>Top Seller Kisan (In ₹)</span>
            }
            hoverable
            style={{
              height: '400px',
              borderRadius: '8px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              border: '1px solid #f0f0f0',
            }}
            bodyStyle={{ height: 'calc(100% - 57px)', padding: '16px' }}
            headStyle={{ borderBottom: '1px solid #f0f0f0' }}
          >
            <TopSellerKisans kisans={dashBoardData.topSellingKisans} />
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card
            title={
              <span style={{ fontSize: '16px', fontWeight: '600' }}>Top Buying Purchaser</span>
            }
            hoverable
            style={{
              height: '400px',
              borderRadius: '8px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              border: '1px solid #f0f0f0',
            }}
            bodyStyle={{ height: 'calc(100% - 57px)', padding: '16px' }}
            headStyle={{ borderBottom: '1px solid #f0f0f0' }}
          >
            <TopBuyingPurchaser purchasers={dashBoardData.topBuyingPurchaser} />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Landing;
