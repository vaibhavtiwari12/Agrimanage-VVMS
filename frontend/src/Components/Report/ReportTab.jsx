import React, { useState } from 'react';
import { Tabs } from 'antd';
import { UserOutlined, TeamOutlined } from '@ant-design/icons';
import { FormattedMessage } from 'react-intl';
import Kisanreport from './KisanReport';
import PurchaserReport from './PurchaserReport';

const ReportTab = ({ inventory }) => {
  const [activeTab, setActiveTab] = useState('1');

  const tabItems = [
    {
      key: '1',
      label: (
        <span>
          <UserOutlined style={{ marginRight: 8 }} />
          <FormattedMessage id="report.kisan" defaultMessage="Kisan" />
        </span>
      ),
      children: <Kisanreport />,
    },
    {
      key: '2',
      label: (
        <span>
          <TeamOutlined style={{ marginRight: 8 }} />
          <FormattedMessage id="report.purchaser" defaultMessage="Purchaser" />
        </span>
      ),
      children: <PurchaserReport />,
    },
  ];

  return (
    <div style={{ margin: 0, padding: 0 }}>
      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        size="large"
        type="line"
        items={tabItems}
        style={{ margin: 0 }}
        tabBarStyle={{
          margin: 0,
          paddingLeft: 24,
          paddingRight: 24,
          background: 'transparent',
          borderBottom: '1px solid #f0f0f0',
        }}
      />
    </div>
  );
};

export default ReportTab;
