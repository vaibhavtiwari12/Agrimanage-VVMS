import React, { useState } from 'react';
import { Tabs } from 'antd';
import { UserOutlined, TeamOutlined } from '@ant-design/icons';
import { FormattedMessage } from 'react-intl';
import KisanReportLegacy from './KisanReportLegacy';
import PurchaserReportLegacy from './PurchaserReportLegacy';

const ReportTabLegacy = ({ inventory }) => {
  const [activeTab, setActiveTab] = useState('1');

  const tabItems = [
    {
      key: '1',
      label: (
        <span>
          <UserOutlined style={{ marginRight: 8 }} />
          <FormattedMessage id="report.kisan" defaultMessage="Kisan" /> (Legacy)
        </span>
      ),
      children: <KisanReportLegacy />,
    },
    {
      key: '2',
      label: (
        <span>
          <TeamOutlined style={{ marginRight: 8 }} />
          <FormattedMessage id="report.purchaser" defaultMessage="Purchaser" /> (Legacy)
        </span>
      ),
      children: <PurchaserReportLegacy />,
    },
  ];

  return (
    <div style={{ margin: 0, padding: 0 }}>
      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        size="default"
        type="line"
        items={tabItems}
        style={{ margin: 0 }}
        tabBarStyle={{
          margin: 0,
          paddingLeft: 24,
          paddingRight: 24,
          background: '#f5f5f5',
          borderBottom: '1px solid #d9d9d9',
        }}
      />
    </div>
  );
};

export default ReportTabLegacy;
