import React from 'react';
import { Card, Typography, Divider, Table, Descriptions, Row, Col } from 'antd';
import './KisanCreditReceipt.css';
const { Title, Text } = Typography;

const Kisancreditreceipt = React.forwardRef((props, ref) => {
  const { data } = props;
  // Table data for trading details
  const tradingColumns = [
    { title: `नग/बोरा (${data.txn_itemType})`, dataIndex: 'bags', key: 'bags' },
    { title: 'कुल वजन', dataIndex: 'weight', key: 'weight' },
    { title: 'रेट', dataIndex: 'rate', key: 'rate' },
    { title: 'टोटल', dataIndex: 'total', key: 'total' },
  ];
  const tradingData = [
    {
      bags: data.txn_numberofBags,
      weight: data.txn_totalWeight,
      rate: data.txn_rate,
      total: data.txn_grossTotal,
    },
  ];

  // Table data for deductions
  const deductionColumns = [
    { title: 'कमीशन', dataIndex: 'commission', key: 'commission' },
    { title: 'हम्माली', dataIndex: 'hammali', key: 'hammali' },
    { title: 'भाड़ा', dataIndex: 'bhada', key: 'bhada' },
    { title: 'टोटल', dataIndex: 'total', key: 'total' },
  ];
  const deductionData = [
    {
      commission: (data.txn_commission / 100) * data.txn_grossTotal,
      hammali: data.txn_hammali,
      bhada: data.txn_bhada,
      total: -(data.txn_grossTotal - data.txn_netTotal),
    },
  ];

  return (
    <Card ref={ref} className="print-card" style={{ margin: '24px auto' }}>
      <div style={{ textAlign: 'center' }}>
        <Text strong style={{ color: '#389e0d', marginBottom: 0, display: 'block' }}>
          || श्री गुरु कृपा ||
        </Text>
        <Title level={5} style={{ color: '#e53935', marginBottom: 0 }}>
          IM
        </Title>
        <Title level={2} style={{ color: '#e53935', margin: '0px 0 8px 0' }}>
          <u>महाराज वेजिटेबल कंपनी</u>
        </Title>
        <Text style={{ color: '#389e0d' }}>धनिया, टमाटर, मटर एवं सब्जी के आढ़ती</Text>
        <br />
        <Text strong style={{ color: '#e53935' }}>
          दु. न. 35 कृषि उपज मंडी, जबलपुर (म. प्र.) | मो. 9300933117
        </Text>
      </div>
      <Divider style={{ marginBottom: '5px' }} />
      {data.type !== 'ADVANCESETTLEMENT' ? (
        <>
          <Row gutter={16} style={{ margin: '5px 0' }}>
            <Col xs={24} sm={14} md={14} lg={14} xl={14}>
              <Descriptions column={1} size="small" bordered={false} style={{ margin: '5px 0' }}>
                <Descriptions.Item label="नाम">{data.name}</Descriptions.Item>
                <Descriptions.Item label="फ़ोन">{data.phone}</Descriptions.Item>
                <Descriptions.Item label="पता">{data.address}</Descriptions.Item>
              </Descriptions>
            </Col>
            <Col xs={24} sm={10} md={10} lg={10} xl={10} style={{ textAlign: 'right' }}>
              <Descriptions column={1} size="small" bordered={false} style={{ margin: '5px 0' }}>
                <Descriptions.Item label="बिल क्र.">{data.txn_id}</Descriptions.Item>
                <Descriptions.Item label="दिनांक">{data.txn_date}</Descriptions.Item>
              </Descriptions>
            </Col>
          </Row>
          <Divider style={{ marginTop: '5px' }} />
          {data.txn_grossTotal > 0 ? (
            <>
              <Title level={5} style={{ textAlign: 'center', margin: '0' }}>
                ** बिल **
              </Title>
              <Divider style={{ margin: '0' }} />
              <Text strong>1. ट्रेडिंग का विवरण</Text>
              <Table
                columns={tradingColumns}
                dataSource={tradingData}
                pagination={false}
                size="small"
                style={{ margin: '0 0 8px 0' }}
                bordered
                rowClassName={() => 'compact-table-row'}
              />
              <Row justify="end" style={{ marginBottom: 8 }}>
                <Col>
                  <Text strong>ट्रेडिंग टोटल (उपज का कुल मूल्य) (₹): </Text>
                  <Text strong>{data.txn_grossTotal}</Text>
                </Col>
              </Row>
              <Divider style={{ margin: '8px 0' }} />
              <Text strong>2. कटौती</Text>
              <Table
                columns={deductionColumns}
                dataSource={deductionData}
                pagination={false}
                size="small"
                style={{ margin: '0 0 8px 0' }}
                bordered
                rowClassName={() => 'compact-table-row'}
              />

              <Row justify="end" style={{ marginBottom: 8 }}>
                <Col>
                  <Text strong>बिल टोटल (कटौती के बाद) (₹): </Text>
                  <Text strong>{data.txn_netTotal}</Text>
                </Col>
              </Row>
              <Divider style={{ margin: '8px 0' }} />
              <Text strong>3. समायोजन/हिसाब</Text>
              <Descriptions column={1} size="small" bordered style={{ marginBottom: 8 }}>
                <Descriptions.Item label="एडवांस चुकाया (₹)">
                  {data.txn_advanceSettlement}
                </Descriptions.Item>
                <Descriptions.Item label="नगद भुगतान (₹)">{data.txn_paidToKisan}</Descriptions.Item>
                <Descriptions.Item label="इस बिल का बकाया भुगतान (₹)">
                  {data.txn_carryForwardFromThisEntry - data.txn_previousBillSettlementAmount}
                </Descriptions.Item>
              </Descriptions>
              <Divider style={{ margin: '8px 0' }} />
              <ul style={{ marginLeft: 16 }}>
                <li>कुल बकाया एडवांस = ₹ {-1 * data.balance}</li>
                <li>पिछले बिल तक का बकाया भुगतान = ₹ {data.txn_previousBillSettlementAmount}</li>
                <li>
                  कुल बकाया भुगतान = ({data.txn_previousBillSettlementAmount} +{' '}
                  {data.txn_carryForwardFromThisEntry - data.txn_previousBillSettlementAmount}) = ₹{' '}
                  {data.txn_carryForwardFromThisEntry}
                </li>
              </ul>
            </>
          ) : (
            <>
              <Title level={5} style={{ textAlign: 'center', marginBottom: 0 }}>
                ** पेमेंट बिल **
              </Title>
              <Divider style={{ margin: '8px 0' }} />
              <Text strong>बकाया एडवांस</Text>
              <Descriptions column={1} size="small" bordered style={{ marginBottom: 8 }}>
                <Descriptions.Item label="इस बिल से पहले का कुल बकाया एडवांस (₹)">
                  {-1 * (data.balance - data.txn_advanceSettlement)}
                </Descriptions.Item>
              </Descriptions>
              <Text strong>बकाया पेमेंट</Text>
              <Descriptions column={1} size="small" bordered style={{ marginBottom: 8 }}>
                <Descriptions.Item label="इस बिल से पहले की कुल बकाया पेमेंट (₹)">
                  {data.txn_previousBillSettlementAmount}
                </Descriptions.Item>
              </Descriptions>
              <Text strong>समायोजन/हिसाब</Text>
              <Descriptions column={1} size="small" bordered style={{ marginBottom: 8 }}>
                <Descriptions.Item label="एडवांस चुकाया (₹)">
                  {data.txn_advanceSettlement}
                </Descriptions.Item>
                <Descriptions.Item label="नगद भुगतान (₹)">{data.txn_paidToKisan}</Descriptions.Item>
                <Descriptions.Item label="इस बिल की कुल पेमेंट (₹)">
                  {data.txn_advanceSettlement + data.txn_paidToKisan}
                </Descriptions.Item>
              </Descriptions>
              <ul style={{ marginLeft: 16 }}>
                <li>
                  अगले बिल के लिए बकाया एडवांस = ({-1 * (data.balance - data.txn_advanceSettlement)}{' '}
                  - {data.txn_advanceSettlement}) = ₹ {-1 * data.balance}
                </li>
                <li>
                  अगले बिल के लिए बकाया पेमेंट = ({data.txn_previousBillSettlementAmount} -{' '}
                  {data.txn_paidToKisan}) = ₹ {data.txn_carryForwardFromThisEntry}
                </li>
              </ul>
            </>
          )}
          <Divider />
          <Row justify="end">
            <Col>
              <Text strong>हस्ताक्षर</Text>
            </Col>
          </Row>
        </>
      ) : (
        <div style={{ textAlign: 'center', margin: 32 }}>
          <Title level={4}>** एडवांस वापसी की रसीद **</Title>
          <div style={{ textAlign: 'left', margin: 32 }}>
            <Text>
              महाराज वेजिटेबल कंपनी द्वारा,आज दिनांक___
              <u>
                <b>{data.date}</b>
              </u>
              ___ को श्री ___
              <u>
                <b>{data.name}</b>
              </u>
              ___ वल्द श्री ___
              <u>
                <b>{data.fatherName}</b>
              </u>
              ___ से ___
              <u>
                <b>₹{data.transactionAmount}/-</b>
              </u>
              ___ की राशि, ___<u>नक़द/चैक/UPI</u>___ के माध्यम से प्राप्त की गयी।
            </Text>
          </div>
          <Divider style={{ margin: '16px 0' }} />
          <Row justify="end" style={{ marginTop: 32 }}>
            <Col>
              <Text strong>हस्ताक्षर</Text>
            </Col>
          </Row>
        </div>
      )}
    </Card>
  );
});

export default Kisancreditreceipt;
