import React from 'react';
import './KisanReceipt.css';
import { Card, Typography, Row, Col, Divider } from 'antd';
const { Title, Text } = Typography;

const Kisanreceipt = React.forwardRef((props, ref) => {
  const { data } = props;
  return (
    <Card
      ref={ref}
      className="print-card"
      style={{ maxWidth: 800, margin: '24px auto', padding: '24px' }}
    >
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
      <Text style={{ display: 'block', fontSize: 16, margin: '16px 0' }}>
        मैं,{' '}
        <u>
          <b>{data.name}</b>
        </u>{' '}
        वल्द श्री{' '}
        <u>
          <b>{data.fatherName}</b>
        </u>{' '}
        पता{' '}
        <u>
          <b>{data.address}</b>
        </u>
        , आज दिनांक {data.date} को महाराज वेजिटेबल कंपनी के मालिक (प्रोप्राइटर){' '}
        <b>श्री इंद्रेश दुबे</b> जी से मटर/टमाटर/अन्य उपज की खेती से संबंधित कार्यों
        (बीज/खाद/उर्वरक) के लिए एडवांस राशि ₹<b>{Math.abs(data.transactionAmount)}</b> (शब्दों में){' '}
        <u>_____________________________________________</u> लेकर जा रहा हूँ ।
      </Text>
      <Text style={{ display: 'block', fontSize: 16, margin: '8px 0' }}>
        मैं यह वचन देता हूँ की मटर/टमाटर/अन्य उपज की जो भी उपज मेरे खेत में निकलेगी, वह पूरा महाराज
        वेजिटेबल कंपनी में ही बिकेगी, साथ ही मेरे द्वारा लिया हुआ पैसा भी उसी समय कटेगा ।
      </Text>
      <Row style={{ marginTop: 24 }} align="middle">
        <Col span={24}>
          <Text style={{ display: 'block', fontSize: 15 }}>
            <b>दिनांक:</b> {data.date}
          </Text>
          <Text style={{ display: 'block', fontSize: 15 }}>
            <b>फ़ोन:</b> {data.phone}
          </Text>
          <Text style={{ display: 'block', fontSize: 15 }}>
            <b>पता:</b> {data.address}
          </Text>
        </Col>
      </Row>
      <Divider style={{ margin: '16px 0' }} />
      <Row>
        <Col span={24} style={{ textAlign: 'right' }}>
          <Text strong style={{ fontSize: 15 }}>
            नाम एवं हस्ताक्षर
          </Text>
        </Col>
      </Row>
    </Card>
  );
});

export default Kisanreceipt;
