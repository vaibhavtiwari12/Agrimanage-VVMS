import React from 'react';
import { Typography, Divider } from 'antd';
import './KisanCreditReceiptThermal.css';

const { Title, Text } = Typography;

const KisanCreditReceiptThermal = React.forwardRef((props, ref) => {
  const { data } = props;

  return (
    <div ref={ref} className="thermal-receipt">
      {/* Header */}
      <div className="thermal-header">
        <Text strong className="thermal-blessing">
          || श्री गुरु कृपा ||
        </Text>
        <Text strong className="thermal-company-code">
          IM
        </Text>
        <Title level={5} className="thermal-company-name">
          महाराज वेजिटेबल कंपनी
        </Title>
        <Text className="thermal-tagline">धनिया, टमाटर, मटर एवं सब्जी के आढ़ती</Text>
        <Text strong className="thermal-contact">
          दु. न. 35 कृषि उपज मंडी, जबलपुर
        </Text>
        <Text strong className="thermal-phone">
          मो. 9300933117
        </Text>
      </div>

      <Divider className="thermal-divider" />

      {data.type !== 'ADVANCESETTLEMENT' ? (
        <>
          {/* Kisan Details */}
          <div className="thermal-section">
            <div className="thermal-row">
              <Text strong>नाम:</Text>
              <Text>{data.name}</Text>
            </div>
            <div className="thermal-row">
              <Text strong>फ़ोन:</Text>
              <Text>{data.phone}</Text>
            </div>
            <div className="thermal-row">
              <Text strong>पता:</Text>
              <Text>{data.address}</Text>
            </div>
          </div>

          <Divider className="thermal-divider-sm" />

          {/* Bill Details */}
          <div className="thermal-section">
            <div className="thermal-row">
              <Text strong>बिल क्र.:</Text>
              <Text>{data.txn_id}</Text>
            </div>
            <div className="thermal-row">
              <Text strong>दिनांक:</Text>
              <Text>{data.txn_date}</Text>
            </div>
          </div>

          <Divider className="thermal-divider" />

          {data.txn_grossTotal > 0 ? (
            <>
              {/* Bill Title */}
              <Title level={5} className="thermal-section-title">
                ** बिल **
              </Title>
              <Divider className="thermal-divider-sm" />

              {/* Trading Details */}
              <Text strong className="thermal-subtitle">
                1. ट्रेडिंग का विवरण
              </Text>
              <div className="thermal-table">
                <div className="thermal-table-row">
                  <Text className="thermal-cell-label">नग/बोरा ({data.txn_itemType}):</Text>
                  <Text className="thermal-cell-value">{data.txn_numberofBags}</Text>
                </div>
                <div className="thermal-table-row">
                  <Text className="thermal-cell-label">कुल वजन:</Text>
                  <Text className="thermal-cell-value">{data.txn_totalWeight}</Text>
                </div>
                <div className="thermal-table-row">
                  <Text className="thermal-cell-label">रेट:</Text>
                  <Text className="thermal-cell-value">{data.txn_rate}</Text>
                </div>
                <div className="thermal-table-row thermal-total">
                  <Text strong className="thermal-cell-label">
                    टोटल:
                  </Text>
                  <Text strong className="thermal-cell-value">
                    ₹{data.txn_grossTotal}
                  </Text>
                </div>
              </div>

              <Divider className="thermal-divider-sm" />

              {/* Deductions */}
              <Text strong className="thermal-subtitle">
                2. कटौती
              </Text>
              <div className="thermal-table">
                <div className="thermal-table-row">
                  <Text className="thermal-cell-label">कमीशन:</Text>
                  <Text className="thermal-cell-value">
                    ₹{((data.txn_commission / 100) * data.txn_grossTotal).toFixed(2)}
                  </Text>
                </div>
                <div className="thermal-table-row">
                  <Text className="thermal-cell-label">हम्माली:</Text>
                  <Text className="thermal-cell-value">₹{data.txn_hammali}</Text>
                </div>
                <div className="thermal-table-row">
                  <Text className="thermal-cell-label">भाड़ा:</Text>
                  <Text className="thermal-cell-value">₹{data.txn_bhada}</Text>
                </div>
                <div className="thermal-table-row thermal-total">
                  <Text strong className="thermal-cell-label">
                    बिल टोटल:
                  </Text>
                  <Text strong className="thermal-cell-value">
                    ₹{data.txn_netTotal}
                  </Text>
                </div>
              </div>

              <Divider className="thermal-divider-sm" />

              {/* Adjustments */}
              <Text strong className="thermal-subtitle">
                3. समायोजन/हिसाब
              </Text>
              <div className="thermal-table">
                <div className="thermal-table-row">
                  <Text className="thermal-cell-label">एडवांस चुकाया:</Text>
                  <Text className="thermal-cell-value">₹{data.txn_advanceSettlement}</Text>
                </div>
                <div className="thermal-table-row">
                  <Text className="thermal-cell-label">नगद भुगतान:</Text>
                  <Text className="thermal-cell-value">₹{data.txn_paidToKisan}</Text>
                </div>
                <div className="thermal-table-row">
                  <Text className="thermal-cell-label">इस बिल का बकाया:</Text>
                  <Text className="thermal-cell-value">
                    ₹{data.txn_carryForwardFromThisEntry - data.txn_previousBillSettlementAmount}
                  </Text>
                </div>
              </div>

              <Divider className="thermal-divider-sm" />

              {/* Summary */}
              <div className="thermal-summary">
                <Text className="thermal-summary-text">
                  • कुल बकाया एडवांस = ₹{-1 * data.balance}
                </Text>
                <Text className="thermal-summary-text">
                  • पिछले बिल तक का बकाया = ₹{data.txn_previousBillSettlementAmount}
                </Text>
                <Text className="thermal-summary-text">
                  • कुल बकाया भुगतान = ₹{data.txn_carryForwardFromThisEntry}
                </Text>
              </div>
            </>
          ) : (
            <>
              {/* Payment Bill */}
              <Title level={5} className="thermal-section-title">
                ** पेमेंट बिल **
              </Title>
              <Divider className="thermal-divider-sm" />

              <Text strong className="thermal-subtitle">
                बकाया एडवांस
              </Text>
              <div className="thermal-table">
                <div className="thermal-table-row">
                  <Text className="thermal-cell-label">पहले का बकाया:</Text>
                  <Text className="thermal-cell-value">
                    ₹{-1 * (data.balance - data.txn_advanceSettlement)}
                  </Text>
                </div>
              </div>

              <Text strong className="thermal-subtitle">
                बकाया पेमेंट
              </Text>
              <div className="thermal-table">
                <div className="thermal-table-row">
                  <Text className="thermal-cell-label">कुल बकाया पेमेंट:</Text>
                  <Text className="thermal-cell-value">
                    ₹{data.txn_previousBillSettlementAmount}
                  </Text>
                </div>
              </div>

              <Text strong className="thermal-subtitle">
                समायोजन/हिसाब
              </Text>
              <div className="thermal-table">
                <div className="thermal-table-row">
                  <Text className="thermal-cell-label">एडवांस चुकाया:</Text>
                  <Text className="thermal-cell-value">₹{data.txn_advanceSettlement}</Text>
                </div>
                <div className="thermal-table-row">
                  <Text className="thermal-cell-label">नगद भुगतान:</Text>
                  <Text className="thermal-cell-value">₹{data.txn_paidToKisan}</Text>
                </div>
                <div className="thermal-table-row thermal-total">
                  <Text strong className="thermal-cell-label">
                    कुल पेमेंट:
                  </Text>
                  <Text strong className="thermal-cell-value">
                    ₹{data.txn_advanceSettlement + data.txn_paidToKisan}
                  </Text>
                </div>
              </div>

              <Divider className="thermal-divider-sm" />

              {/* Summary */}
              <div className="thermal-summary">
                <Text className="thermal-summary-text">
                  • अगले के लिए बकाया एडवांस = ₹{-1 * data.balance}
                </Text>
                <Text className="thermal-summary-text">
                  • अगले के लिए बकाया पेमेंट = ₹{data.txn_carryForwardFromThisEntry}
                </Text>
              </div>
            </>
          )}

          <Divider className="thermal-divider" />

          {/* Signature */}
          <div className="thermal-signature">
            <Text strong>हस्ताक्षर: _______________</Text>
          </div>
        </>
      ) : (
        <>
          {/* Advance Return Receipt */}
          <Title level={5} className="thermal-section-title">
            ** एडवांस वापसी की रसीद **
          </Title>
          <Divider className="thermal-divider-sm" />

          <div className="thermal-advance-text">
            <Text>
              महाराज वेजिटेबल कंपनी द्वारा, आज दिनांक <Text strong>{data.date}</Text> को श्री{' '}
              <Text strong>{data.name}</Text> वल्द श्री <Text strong>{data.fatherName}</Text> से{' '}
              <Text strong>₹{data.transactionAmount}/-</Text> की राशि, नक़द/चैक/UPI के माध्यम से
              प्राप्त की गयी।
            </Text>
          </div>

          <Divider className="thermal-divider" />

          {/* Signature */}
          <div className="thermal-signature">
            <Text strong>हस्ताक्षर: _______________</Text>
          </div>
        </>
      )}

      {/* Footer */}
      <Divider className="thermal-divider-sm" />
      <div className="thermal-footer">
        <Text className="thermal-footer-text">धन्यवाद</Text>
        <Text className="thermal-footer-text">फिर से पधारें</Text>
      </div>
    </div>
  );
});

export default KisanCreditReceiptThermal;
