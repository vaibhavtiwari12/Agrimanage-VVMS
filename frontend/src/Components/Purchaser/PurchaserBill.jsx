import React, { useEffect, useState } from 'react';
import { Card, Typography, Divider, Table, Descriptions, Row, Col } from 'antd';

const { Title, Text } = Typography;

const PurchaserBill = React.forwardRef((props, ref) => {
  console.log('PROPS ', props);
  const [purchaser, setPurchaser] = useState({});

  useEffect(() => {
    setPurchaser(props.data);
  }, [props.data]);

  // Table columns for purchase details
  const purchaseColumns = [
    { title: 'नग/बोरा', dataIndex: 'bags', key: 'bags', align: 'right' },
    { title: 'कुल वजन', dataIndex: 'weight', key: 'weight', align: 'right' },
    { title: 'रेट', dataIndex: 'rate', key: 'rate', align: 'right' },
    { title: 'टोटल', dataIndex: 'total', key: 'total', align: 'right' },
  ];

  // Prepare purchase data
  const purchaseData = props.data.transaction
    ? props.data.transaction
        .filter(txn => txn.type === 'DEBIT')
        .map((txn, index) => ({
          key: index,
          bags: txn.numberofBags,
          weight: txn.totalweight,
          rate: txn.rate,
          total: txn.transactionAmount,
        }))
    : [];

  return (
    <Card ref={ref} className="print-card" style={{ margin: '24px auto' }}>
      {/* Header  */}
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
        <Text style={{ color: '#389e0d' }}>धनिया, टमाटर, मटर एवं सब्जी के आढ़ती</Text>
        <br />
        <Text strong style={{ color: '#e53935' }}>
          दु. न. 35 कृषि उपज मंडी, जबलपुर (म. प्र.) | मो. 9300933117
        </Text>
      </div>
      <Divider style={{ marginBottom: '5px' }} />

      {/* Purchaser Details */}
      <Row gutter={16} style={{ margin: '5px 0' }}>
        <Col xs={24} sm={14} md={14} lg={14} xl={14}>
          <Descriptions column={1} size="small" bordered={false} style={{ margin: '5px 0' }}>
            <Descriptions.Item label="नाम">{props.data.name}</Descriptions.Item>
            <Descriptions.Item label="कंपनी का नाम">{props.data.companyName}</Descriptions.Item>
            <Descriptions.Item label="पता">{props.data.address}</Descriptions.Item>
            <Descriptions.Item label="फ़ोन">{props.data.phone}</Descriptions.Item>
          </Descriptions>
        </Col>
        <Col xs={24} sm={10} md={10} lg={10} xl={10} style={{ textAlign: 'right' }}>
          <Descriptions column={1} size="small" bordered={false} style={{ margin: '5px 0' }}>
            <Descriptions.Item label="बिल क्र.">{props.data.billId}</Descriptions.Item>
            <Descriptions.Item label="दिनांक">{props.data.date}</Descriptions.Item>
          </Descriptions>
        </Col>
      </Row>
      <Divider style={{ marginTop: '5px' }} />

      {/* Old Balance */}
      <Row justify="space-between" style={{ marginBottom: 8 }}>
        <Col>
          <Text strong>पुराना बचा बैलेंस</Text>
        </Col>
        <Col>
          <Text strong>₹ {props.data.oldBalance}</Text>
        </Col>
      </Row>
      <Divider style={{ margin: '8px 0' }} />

      {/* Purchase Details */}
      <Title level={5} style={{ textAlign: 'center', margin: '0' }}>
        ** खरीदी का बिल **
      </Title>
      <Divider style={{ margin: '0' }} />
      <Text strong>खरीदी का बेयौरा - दिनांक: {props.data.date}</Text>
      <Table
        columns={purchaseColumns}
        dataSource={purchaseData}
        pagination={false}
        size="small"
        style={{ margin: '8px 0' }}
        bordered
        summary={() => (
          <Table.Summary>
            <Table.Summary.Row style={{ backgroundColor: '#fafafa' }}>
              <Table.Summary.Cell colSpan={3} align="right">
                <Text strong>कुल योग</Text>
              </Table.Summary.Cell>
              <Table.Summary.Cell align="right">
                <Text strong>₹ {props.data.debitSum}</Text>
              </Table.Summary.Cell>
            </Table.Summary.Row>
          </Table.Summary>
        )}
      />

      <Divider style={{ margin: '8px 0' }} />

      {/* Financial Summary */}
      <Text strong>वित्तीय सारांश</Text>
      <Descriptions column={1} size="small" bordered style={{ marginBottom: 8 }}>
        <Descriptions.Item label="खरीदी का कुल योग + पुराना बचा बैलेंस (कुल देनदारी) (₹)">
          {Math.abs(props.data.debitSum - props.data.debitSum * 2 + props.data.oldBalance)}
        </Descriptions.Item>
        <Descriptions.Item label="कैश जमा किया गया (-) (₹)">
          {props.data.creditSum}
        </Descriptions.Item>
        <Descriptions.Item label="आज तक की कुल बाक़ाया देनदारी (₹)">
          <Text strong style={{ color: '#e53935' }}>
            {Math.abs(
              props.data.debitSum -
                props.data.debitSum * 2 +
                props.data.oldBalance +
                props.data.creditSum
            )}
          </Text>
        </Descriptions.Item>
      </Descriptions>

      <Divider />

      {/* Signature */}
      <Row justify="end">
        <Col>
          <Text strong>हस्ताक्षर</Text>
        </Col>
      </Row>
    </Card>
  );
});

export default PurchaserBill;
