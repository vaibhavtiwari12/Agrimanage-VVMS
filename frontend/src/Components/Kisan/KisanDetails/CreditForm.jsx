import React, { useEffect, useState } from 'react';
import {
  Form,
  Typography,
  Input,
  Select,
  message,
  Spin,
  Breadcrumb,
  Card,
  Row,
  Col,
  Tag,
  InputNumber,
  Switch,
  DatePicker,
  Divider,
  Button,
  Space,
  Alert,
} from 'antd';
import './kisanDetailsClean.css';
import { FormattedMessage, useIntl } from 'react-intl';
import { Link, useHistory, useParams } from 'react-router-dom';
import {
  formatDate,
  getKisanByID,
  getPurchaserByCommodity,
  getTodaysFormattedDate,
  toFixed,
} from '../../../Utility/utility';
import Kisanmoneysummary from './KisanMoneySummary';
import { DetailPageShimmer } from '../../Common';
import axios from 'axios';
import TypeAhead from './TypeAhead';
import dayjs from 'dayjs';
import {
  CalendarOutlined,
  DollarOutlined,
  CommentOutlined,
  SaveOutlined,
  ReloadOutlined,
  SwapOutlined,
  UserOutlined,
  PhoneOutlined,
  HomeOutlined,
  InfoCircleOutlined,
  ShoppingCartOutlined,
  ShopOutlined,
  CalculatorOutlined,
  WalletOutlined,
  CheckCircleOutlined,
} from '@ant-design/icons';

const { Title, Text } = Typography;
const { TextArea } = Input;
const { Option } = Select;

const CreditForm = () => {
  const { id, type, transactionNumber } = useParams();
  const [form] = Form.useForm();
  const intlA = useIntl();
  //Form States
  const [comment, setComment] = useState('');
  const [previousBillSettlementAmount, setPreviousBillSettlementAmount] = useState(0);
  const [numberofBags, setNumberOfBags] = useState(0);
  const [totalweight, setTotalweight] = useState(0);
  const [rate, setRate] = useState(0);
  const [grossTotal, setGrossTotal] = useState(0);
  const [commission, setCommission] = useState(5);
  const [hammali, setHammali] = useState(0);
  const [bhada, setBhada] = useState(0);
  const [netTotal, setNetTotal] = useState(0);
  const [paidToKisan, setPaidToKisan] = useState(0);
  const [advanceSettlement, setAdvanceSettlement] = useState(0);
  const [carryForwardFromThisEntry, setCarryForwardFromThisEntry] = useState(0);
  const [balanceAfterThisTransaction, setBalanceAfterThisTransaction] = useState(0);
  const [itemType, setItemType] = useState('');
  const [purchaser, setPurchaser] = useState('');
  const [selectedPurchaser, setSelectedPurchaser] = useState({});
  const [backDate, setBackDate] = useState('');
  const [creationDate, setCreationDate] = useState('');

  // Validity States
  const [isCommentValid, setIsCommentValid] = useState('PRISTINE');
  const [isPreviousBillSettlementAmountValid, setIsPreviousBillSettlementAmountValid] =
    useState('PRISTINE');
  const [isNumberofBagsValid, setIsNumberofBagsValid] = useState('PRISTINE');
  const [isTotalWeigthValid, setIsTotalWeigthValid] = useState('PRISTINE');
  const [isRateValid, setIsRateValid] = useState('PRISTINE');
  const [isCommissionValid, setIsCommissionValid] = useState('PRISTINE');
  const [isHammalivalid, setIsHammalivalid] = useState('PRISTINE');
  const [isBhadaValid, setIsBhadaValid] = useState('PRISTINE');
  const [isPaidToKisanValid, setIsPaidToKisanValid] = useState('PRISTINE');
  const [isAdvanceSettlementValid, setIsAdvanceSettlementValid] = useState('PRISTINE');
  const [isCarryForwardFromThisEntryValid, setIsCarryForwardFromThisEntryValid] =
    useState('PRISTINE');
  const [ispurchaserInvalid, setIsPurchaserinvalid] = useState('PRISTINE');
  const [isItemTypeInvalid, setIsItemTypeInvalid] = useState('PRISTINE');
  const [billDate, setBillDate] = useState(formatDate(new Date()));
  const [isDateEditable, setIsDateEditable] = useState(false);
  const [isBillDateValid, setIsBillDateValid] = useState('PRISTINE');

  //Misclaeneous
  const [kisan, setKisan] = useState({});
  const [inventory, setInventory] = useState([]);
  const [purchaserData, setPurchaserData] = useState([]);
  const [hasError, setHasError] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
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
        try {
          setIsLoading(true);
          setKisan(await getKisanByID(id));

          const inventoryData = await axios.get('/inventory/get');
          if (inventoryData.data.length <= 0) {
            history.push('/inventory');
          } else {
            setInventory(inventoryData.data);
          }

          const purchaserResponse = await axios.get('/purchaser/get');
          let data = purchaserResponse && purchaserResponse.data;
          if (!Array.isArray(data)) {
            if (data && typeof data === 'object') {
              data = Object.values(data);
            } else {
              data = [];
            }
          }
          const purchasersWithLabel = data.map(purchaser => {
            return {
              ...purchaser,
              label: `${purchaser.name}-${purchaser.companyName}`,
            };
          });
          setPurchaserData(purchasersWithLabel);
          setIsLoading(false);
        } catch (error) {
          console.error('Error fetching initial data:', error);
          setIsLoading(false);
          message.error('Failed to load initial data');
        }
      };
      fetchData();
    } catch (e) {
      setIsLoading(false);
      console.error('Error in initial useEffect:', e);
      message.error('Something went wrong while loading data');
    }
  }, []);

  const handleCreatePurchaser = () => {
    history.push('/addPurchaser');
  };

  // calculate gross total
  useEffect(() => {
    if (type === 'add') {
      setGrossTotal(toFixed(rate * totalweight));
    }
  }, [rate, totalweight]);

  useEffect(() => {
    if (type === 'add') {
      setNetTotal(toFixed(grossTotal - (commission / 100) * grossTotal - hammali - bhada));
    }
  }, [grossTotal, commission, hammali, bhada]);

  useEffect(() => {
    if (type === 'add') {
      setHammali(toFixed(numberofBags * 7));
    }
  }, [numberofBags]);

  useEffect(() => {
    if ((type === 'add') & (itemType === '')) {
      setNumberOfBags(0);
      setRate(0);
      setTotalweight(0);
      setHammali(0);
      setPurchaser('');
    }
  }, [itemType]);
  //itemType
  useEffect(() => {
    if (type === 'add') {
      setPaidToKisan(toFixed(netTotal - advanceSettlement + previousBillSettlementAmount));
    }
  }, [advanceSettlement, netTotal, previousBillSettlementAmount]);

  useEffect(() => {
    if (type === 'add') {
      setCarryForwardFromThisEntry(
        toFixed(netTotal - advanceSettlement - paidToKisan + previousBillSettlementAmount)
      );
    }
  }, [paidToKisan, advanceSettlement, netTotal]);

  useEffect(() => {
    if (Object.keys(kisan).length > 0) {
      setPreviousBillSettlementAmount(toFixed(kisan.carryForwardAmount));
    }
  }, [kisan]);
  useEffect(() => {
    if (purchaserData.length > 0) {
      if (billDate !== getTodaysFormattedDate()) {
        billDateChange({ target: { value: billDate } });
      }
    }
  }, [purchaser]);
  /*  useEffect(() => {
    if(inventory.length>0){
      console.log("INVENTORY ", inventory)
      setItemType(inventory[0].itemName)
    }
  }, [inventory]); */

  //EDIT
  useEffect(() => {
    if (transactionNumber && Object.keys(kisan).length > 0) {
      const transactionToedit = kisan.transactions.filter(
        transac => transac._id === transactionNumber.toString()
      )[0];
      if (purchaserData.length > 0) {
        let purchaserToPopulate = {};
        purchaserData.find((purchaser, index) => {
          if (transactionToedit.purchaserId === purchaser._id) {
            purchaserToPopulate = {
              ...purchaser,
              index,
              label: `${purchaser.name}-${purchaser.companyName}`,
            };
          }
        });
        setPurchaser(purchaserToPopulate.index);
        setSelectedPurchaser(purchaserToPopulate);
      }

      setPreviousBillSettlementAmount(toFixed(transactionToedit.previousBillSettlementAmount));
      setNumberOfBags(toFixed(transactionToedit.numberofBags));
      setTotalweight(toFixed(transactionToedit.totalweight));
      setRate(toFixed(transactionToedit.rate));
      setGrossTotal(toFixed(transactionToedit.grossTotal));
      setCommission(toFixed(transactionToedit.commission));
      setHammali(toFixed(transactionToedit.hammali));
      setBhada(toFixed(transactionToedit.bhada));
      setNetTotal(toFixed(transactionToedit.netTotal));
      setAdvanceSettlement(toFixed(transactionToedit.advanceSettlement));
      setPaidToKisan(toFixed(transactionToedit.paidToKisan));
      setComment(transactionToedit.comment);
      setCarryForwardFromThisEntry(toFixed(transactionToedit.carryForwardFromThisEntry));
      setBalanceAfterThisTransaction(toFixed(transactionToedit.balanceAfterThisTransaction));
      if (transactionToedit.backDate) {
        setCreationDate(transactionToedit.creationDate);
        setBackDate(transactionToedit.backDate);
      }
      setItemType(transactionToedit.itemType);
      setBillDate(formatDate(transactionToedit.date));
      setIsItemTypeInvalid('PRISTINE');
      setIsPurchaserinvalid('PRISTINE');
    }
  }, [kisan, purchaserData]);

  // Update form fields when state values change
  useEffect(() => {
    form.setFieldsValue({
      comment: comment,
      previousBillSettlementAmount: previousBillSettlementAmount,
      numberofBags: numberofBags,
      totalweight: totalweight,
      rate: rate,
      commission: commission,
      hammali: hammali,
      bhada: bhada,
      paidToKisan: paidToKisan,
      advanceSettlement: advanceSettlement,
      carryForwardFromThisEntry: carryForwardFromThisEntry,
      itemType: itemType,
      billDate: billDate ? dayjs(billDate) : null,
      // Edit mode fields
      advanceSettlement1: advanceSettlement,
      paidToKisan1: paidToKisan,
      carryForwardFromThisEntry1: carryForwardFromThisEntry - previousBillSettlementAmount,
      carryForwardAdvance: Math.abs(balanceAfterThisTransaction),
    });
  }, [
    form,
    comment,
    previousBillSettlementAmount,
    numberofBags,
    totalweight,
    rate,
    commission,
    hammali,
    bhada,
    paidToKisan,
    advanceSettlement,
    carryForwardFromThisEntry,
    itemType,
    billDate,
    balanceAfterThisTransaction,
  ]);

  const isFormValid = () => {
    let isInvalid = false;
    if (comment.length <= 0) {
      setIsCommentValid('');
      isInvalid = true;
    }
    if (numberofBags < 0) {
      setIsNumberofBagsValid('');
      isInvalid = true;
    }
    if (totalweight < 0) {
      setIsTotalWeigthValid('');
      isInvalid = true;
    }
    if (rate < 0) {
      setIsRateValid('');
      isInvalid = true;
    }
    if (commission <= 0) {
      setIsCommissionValid('');
      isInvalid = true;
    }
    if (hammali < 0) {
      setIsHammalivalid('');
      isInvalid = true;
    }
    if (bhada < 0) {
      setIsBhadaValid('');
      isInvalid = true;
    }
    if (advanceSettlement < 0) {
      setIsAdvanceSettlementValid('');
      isInvalid = true;
    }
    if (advanceSettlement > Math.abs(kisan.balance)) {
      setIsAdvanceSettlementValid('OUTSTANDINGEXCEEDED');
      isInvalid = true;
    }
    if (advanceSettlement > previousBillSettlementAmount + netTotal) {
      setIsAdvanceSettlementValid('TOTALEXCEEDED');
      isInvalid = true;
    }
    if (paidToKisan < 0) {
      setIsPaidToKisanValid('');
      isInvalid = true;
    }
    if (paidToKisan > previousBillSettlementAmount + netTotal) {
      setIsPaidToKisanValid('TOTALEXCEEDED');
      isInvalid = true;
    }
    if ((purchaser === '' && itemType !== '') || (purchaser !== '' && itemType === '')) {
      setIsPurchaserinvalid('TRUE');
      setIsItemTypeInvalid('TRUE');
      isInvalid = true;
    }
    if (isBillDateValid !== '' && isBillDateValid !== 'PRISTINE') {
      console.log('transaction is invalid becaise isBillDate --- ', isBillDateValid);
      isInvalid = true;
    }
    return isInvalid ? false : true;
  };

  const validateAdvanceSettlement = () => {
    setIsAdvanceSettlementValid('PRISTINE');
    if (advanceSettlement < 0) {
      setIsAdvanceSettlementValid('');
    } else if (
      previousBillSettlementAmount + netTotal > Math.abs(kisan.balance) &&
      advanceSettlement > Math.abs(kisan.balance)
    ) {
      setIsAdvanceSettlementValid('OUTSTANDINGEXCEEDED');
    } else if (advanceSettlement > previousBillSettlementAmount + netTotal) {
      setIsAdvanceSettlementValid('TOTALEXCEEDED');
    }
  };

  const validatePaidToKisan = () => {
    setIsPaidToKisanValid('PRISTINE');
    if (paidToKisan < 0) {
      setIsPaidToKisanValid('');
    } else if (paidToKisan > previousBillSettlementAmount + netTotal) {
      setIsPaidToKisanValid('TOTALEXCEEDED');
    }
  };

  // ------------------------------------------------Change Functions ------------------------------------------

  const commentChange = e => {
    setComment(e.target.value);
    setIsCommentValid('');
  };
  const getLatestPurchaserTransactionDate = () => {
    let lastTransactionIndex = purchaserData[purchaser].transactions.length - 1;
    let lastTransaction = purchaserData[purchaser].transactions[lastTransactionIndex];
    let lastTransactionDate = lastTransaction.date;
    let jsdateString = new Date(lastTransactionDate);
    let purchaserLatestTransactionDate = jsdateString.toISOString().split('T')[0];
    return purchaserLatestTransactionDate;
  };
  const getLatestKisanTransactionDate = () => {
    let lastTransactionIndex = kisan.transactions.length - 1;
    let lastTransaction = kisan.transactions[lastTransactionIndex];
    let lastTransactionDate = lastTransaction.date;
    let jsdateString = new Date(lastTransactionDate);
    let kisanLatestTransactionDate = jsdateString.toISOString().split('T')[0];
    return kisanLatestTransactionDate;
  };

  const billDateChange = e => {
    if (type === 'edit') {
      setBillDate(e.target.value);
      setIsBillDateValid('');
    } else {
      if (e.target.value !== getTodaysFormattedDate()) {
        let hasError = false;
        //check the kisan transaction post selected date.
        if (purchaserData[purchaser] && purchaserData[purchaser].name) {
          if (
            purchaserData[purchaser].transactions &&
            purchaserData[purchaser].transactions.length > 0
          ) {
            const latestPurchaserTransactionDate = getLatestPurchaserTransactionDate();
            if (new Date(latestPurchaserTransactionDate) > new Date(e.target.value)) {
              setBillDate(e.target.value);
              setIsBillDateValid('HASPURCHASERTRANSACTIONPOSTTHISDATE');
              hasError = true;
            } else {
              setBillDate(e.target.value);
              setIsBillDateValid('');
            }
          } else {
            setBillDate(e.target.value);
            setIsBillDateValid('');
          }
        } else {
          setBillDate(e.target.value);
          setIsBillDateValid('');
        }

        //Check if Kisan has transactions after this date.
        if (hasError === false) {
          if (kisan.transactions && kisan.transactions.length > 0) {
            const latestKisanTransactionDate = getLatestKisanTransactionDate();
            if (new Date(latestKisanTransactionDate) > new Date(e.target.value)) {
              setIsBillDateValid('HASKISANTRANSACTIONPOSTTHISDATE');
              setBillDate(e.target.value);
            }
          } else {
            setBillDate(e.target.value);
            setIsBillDateValid('');
          }
        }
      }
      if (e.target.value === getTodaysFormattedDate()) {
        setBillDate(e.target.value);
        setIsBillDateValid('');
      }
    }
  };
  useEffect(() => {
    if (!isDateEditable) {
      billDateChange({ target: { value: getTodaysFormattedDate() } });
    }
    if (isDateEditable) {
      setBillDate(formatDate(new Date(), 1));
    }
  }, [isDateEditable]);
  const previousBillSettlementAmountChange = e => {
    setPreviousBillSettlementAmount(parseInt(e.target.value));
    setIsPreviousBillSettlementAmountValid('');
  };
  const numberofBagsChange = e => {
    setNumberOfBags(parseInt(e.target.value));
    setIsNumberofBagsValid('');
  };
  const totalWeightChange = e => {
    setTotalweight(parseInt(e.target.value));
    setIsTotalWeigthValid('');
  };
  const rateChange = e => {
    const parsedRate = parseFloat(e.target.value).toFixed(2);
    setRate(parseFloat(parsedRate));
    setIsRateValid('');
  };
  const commisionChange = e => {
    setCommission(parseInt(e.target.value));
    setIsCommissionValid('');
  };
  const hammaliChange = e => {
    setHammali(parseInt(e.target.value));
    setIsHammalivalid('');
  };
  const bhadaChange = e => {
    setBhada(parseInt(e.target.value));
    setIsBhadaValid('');
  };
  const paidToKisanChange = e => {
    setPaidToKisan(parseInt(e.target.value));
  };
  const advanceSettlementChange = e => {
    setAdvanceSettlement(parseInt(e.target.value));
  };
  const carryForwardFromThisEntryChange = e => {
    setCarryForwardFromThisEntry(parseInt(e.target.value));
    setIsCarryForwardFromThisEntryValid('');
  };
  useEffect(() => {
    validateAdvanceSettlement();
  }, [advanceSettlement]);

  useEffect(() => {
    validatePaidToKisan();
  }, [paidToKisan]);

  // ------------------------------------------------Change Functions ------------------------------------------

  const clear = () => {
    //setAmount("");
    setComment('');
    setNumberOfBags(0);
    setTotalweight(0);
    setRate(0);
    setGrossTotal(0);
    setCommission(5);
    setHammali(0);
    setBhada(0);
    setNetTotal(0);
    setPaidToKisan(previousBillSettlementAmount);
    setAdvanceSettlement(0);
    setCarryForwardFromThisEntry(0);
    setPurchaser('');
    setItemType('');
    setSelectedPurchaser({});
    setHasError(false);
    setIsCommentValid('PRISTINE');
    setIsPreviousBillSettlementAmountValid('PRISTINE');
    setIsNumberofBagsValid('PRISTINE');
    setIsTotalWeigthValid('PRISTINE');
    setIsRateValid('PRISTINE');
    setIsCommentValid('PRISTINE');
    setIsHammalivalid('PRISTINE');
    setIsBhadaValid('PRISTINE');
    setIsPaidToKisanValid('PRISTINE');
    setIsAdvanceSettlementValid('PRISTINE');
    setIsCarryForwardFromThisEntryValid('PRISTINE');
    setIsPurchaserinvalid('PRISTINE');
    setIsItemTypeInvalid('PRISTINE');
    setIsBillDateValid('PRISTINE');
  };
  const submit = e => {
    e.preventDefault();
    if (isFormValid()) {
      setIsSubmitting(true);
      const formData = {
        transaction: {
          previousBillSettlementAmount,
          grossTotal,
          netTotal,
          numberofBags,
          totalweight,
          rate,
          commission,
          hammali,
          bhada,
          paidToKisan,
          advanceSettlement,
          carryForwardFromThisEntry,
          type: 'CREDIT',
          comment,
          itemType,
          balanceAfterThisTransaction: kisan.balance + advanceSettlement,
          purchaserId: selectedPurchaser._id,
          purchaserName: selectedPurchaser.name,
          purchaserTxnType: 'DEBIT',
          purchaserkisanId: kisan._id,
          purchaserkisanName: kisan.name,
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
      fetch(`/kisan/AddTransaction/${id}`, {
        method: 'POST',
        body: JSON.stringify(formData),
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      })
        .then(res => res.json())
        .then(res => {
          handleAlert();
          clear();
          setIsSubmitting(false);
        })
        .catch(error => {
          setIsSubmitting(false);
          throw new error('Somethign Went Wrong', error);
        });
    } else {
      setHasError(true);
    }
  };

  const handleAlert = () => {
    setShowAlert(true);
    setTimeout(() => {
      setShowAlert(false);
      history.push(`/kisanDetails/${id}`);
    }, 2000);
  };

  const handleEdit = () => {
    if (isFormValid()) {
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
          console.log('Res', res);
          handleAlert();
          clear();
        })
        .catch(error => {
          throw new error('Somethign Went Wrong', error);
        });
    } else {
      setHasError(true);
    }
  };

  const handleItemChange = async e => {
    setItemType(e.target.value);
  };

  useEffect(() => {
    setPurchaser('');
    setSelectedPurchaser('');

    // Only fetch purchasers if itemType is not empty
    if (itemType && itemType.trim() !== '') {
      const fetchData = async () => {
        try {
          const purchasers = await getPurchaserByCommodity(itemType);
          const purchasersWithLabel = purchasers.map(purchaser => {
            return {
              ...purchaser,
              label: `${purchaser.name}-${purchaser.companyName}`,
            };
          });
          setPurchaserData(purchasersWithLabel);
        } catch (error) {
          console.error('Error fetching purchasers by commodity:', error);

          // Fallback: try to get all purchasers if commodity-specific call fails
          try {
            const allPurchasersResponse = await axios.get('/purchaser/get');
            const purchasersWithLabel = allPurchasersResponse.data.map(purchaser => {
              return {
                ...purchaser,
                label: `${purchaser.name}-${purchaser.companyName}`,
              };
            });
            setPurchaserData(purchasersWithLabel);
            console.warn('Fallback to all purchasers successful');
          } catch (fallbackError) {
            console.error('Fallback to all purchasers also failed:', fallbackError);
            setPurchaserData([]);
            message.error('Failed to load purchasers. Please try again.');
          }
        }
      };
      fetchData();
    } else {
      // When no item type is selected, we might want to show all purchasers or none
      // For now, clearing the list when no commodity is selected
      setPurchaserData([]);
    }
  }, [itemType]);
  const handlePurchaserChange = (item, index) => {
    setSelectedPurchaser(item);
    let purchaserIndex = null;
    purchaserData.filter((purchaser, index) => {
      if (purchaser._id === item._id) {
        purchaserIndex = index;
      }
    });
    setPurchaser(purchaserIndex);
    /* setSelectedPurchaser(purchaserData[parseInt(e.target.value)]); */
  };

  useEffect(() => {
    if (ispurchaserInvalid !== 'PRISTINE' || isItemTypeInvalid !== 'PRISTINE') {
      validatePurchaserAndVegetable();
    } else {
      setIsPurchaserinvalid('');
      setIsItemTypeInvalid('');
    }
  }, [purchaser, itemType]);

  const validatePurchaserAndVegetable = () => {
    if (purchaser === '' && itemType !== '') {
      setIsPurchaserinvalid('TRUE');
    } else {
      setIsPurchaserinvalid('FALSE');
    }
    if (itemType === '' && purchaser !== '') {
      setIsItemTypeInvalid('TRUE');
    } else {
      setIsItemTypeInvalid('FALSE');
    }
  };

  /*------------------------------------------HTML-------------------------------------*/

  return (
    <div
      className="mobile-container-padding mobile-consistent-container"
      style={{
        padding: '24px 12px 32px 12px',
      }}
    >
      {isLoading ? (
        <DetailPageShimmer />
      ) : (
        <>
          {/* Breadcrumb */}
          <Breadcrumb
            className="mobile-section-spacing"
            style={{
              marginBottom: 24,
            }}
          >
            <Breadcrumb.Item>
              <Link
                to="/"
                style={{
                  color: '#667eea',
                  fontWeight: 500,
                  textDecoration: 'none',
                }}
              >
                <FormattedMessage id="home" defaultMessage="Home" />
              </Link>
            </Breadcrumb.Item>
            <Breadcrumb.Item>
              <Link
                to="/kisan"
                style={{
                  color: '#667eea',
                  fontWeight: 500,
                  textDecoration: 'none',
                }}
              >
                <FormattedMessage id="kisan" defaultMessage="Kisan" />
              </Link>
            </Breadcrumb.Item>
            <Breadcrumb.Item>
              <Link
                to={`/kisanDetails/${kisan._id}`}
                style={{
                  color: '#667eea',
                  fontWeight: 500,
                  textDecoration: 'none',
                }}
              >
                <FormattedMessage id="details" defaultMessage="Details" />
              </Link>
            </Breadcrumb.Item>
            <Breadcrumb.Item>
              <Text style={{ color: '#2c3e50', fontWeight: 600 }}>
                <FormattedMessage id="createBillKisanButtonText" defaultMessage="Credit Form" />
              </Text>
            </Breadcrumb.Item>
          </Breadcrumb>

          {/* Header Card */}
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
                  <ShoppingCartOutlined
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
                  <FormattedMessage id="createBillKisanButtonText" />
                </Title>
                <Text
                  style={{
                    fontSize: window.innerWidth <= 768 ? 12 : 16,
                    marginTop: 8,
                    color: 'rgba(255, 255, 255, 0.9)',
                  }}
                >
                  {type === 'edit'
                    ? 'Edit credit transaction details'
                    : 'Create a new credit entry for farmer transactions'}
                </Text>
              </Col>
            </Row>
          </Card>

          {/* Farmer Information Table */}
          <Card
            className="mobile-consistent-card"
            style={{
              borderRadius: 12,
              marginBottom: 24,
              border: '1px solid #f0f0f0',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
            }}
            title={
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <UserOutlined style={{ color: '#1677ff', fontSize: 24 }} />
                <span style={{ fontSize: 18, fontWeight: 600, color: '#2c3e50' }}>
                  Farmer Information
                </span>
              </div>
            }
          >
            <Row gutter={[24, 16]}>
              <Col xs={24} sm={12} lg={8}>
                <div>
                  <div style={{ color: '#666', fontSize: 15, marginBottom: 4 }}>
                    <FormattedMessage id="fullName" defaultMessage="Full Name" />
                  </div>
                  <div style={{ fontSize: 17, fontWeight: 500 }}>{kisan.name || 'N/A'}</div>
                </div>
              </Col>
              <Col xs={24} sm={12} lg={8}>
                <div>
                  <div style={{ color: '#666', fontSize: 15, marginBottom: 4 }}>
                    <FormattedMessage id="fatherNameLabel" defaultMessage="Father's Name" />
                  </div>
                  <div style={{ fontSize: 17, fontWeight: 500 }}>{kisan.fatherName || 'N/A'}</div>
                </div>
              </Col>
              <Col xs={24} sm={12} lg={8}>
                <div>
                  <div style={{ color: '#666', fontSize: 15, marginBottom: 4 }}>
                    <FormattedMessage id="commodity" defaultMessage="Commodity" />
                  </div>
                  <div style={{ fontSize: 17, fontWeight: 500 }}>
                    {itemType ? (
                      <Tag color="#52c41a" style={{ borderRadius: 8, padding: '2px 12px' }}>
                        {itemType}
                      </Tag>
                    ) : (
                      <Tag
                        color="#d9d9d9"
                        style={{ borderRadius: 8, padding: '2px 12px', color: '#666' }}
                      >
                        Not Selected
                      </Tag>
                    )}
                  </div>
                </div>
              </Col>
              <Col xs={24} sm={12} lg={8}>
                <div>
                  <div style={{ color: '#666', fontSize: 15, marginBottom: 4 }}>
                    <FormattedMessage id="phoneNumber" defaultMessage="Phone Number" />
                  </div>
                  <div style={{ fontSize: 17, fontWeight: 500 }}>{kisan.phone || 'N/A'}</div>
                </div>
              </Col>
              <Col xs={24} sm={12} lg={8}>
                <div>
                  <div style={{ color: '#666', fontSize: 15, marginBottom: 4 }}>
                    <FormattedMessage id="address" defaultMessage="Address" />
                  </div>
                  <div style={{ fontSize: 17, fontWeight: 500 }}>{kisan.address || 'N/A'}</div>
                </div>
              </Col>
            </Row>
          </Card>

          {/* Farmer Money Summary */}
          <Card
            className="mobile-consistent-card"
            style={{
              borderRadius: 12,
              marginBottom: 24,
              border: '1px solid #f0f0f0',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
            }}
            title={
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <WalletOutlined style={{ color: '#1677ff', fontSize: 24 }} />
                <span style={{ fontSize: 18, fontWeight: 600, color: '#2c3e50' }}>
                  Account Summary
                </span>
              </div>
            }
          >
            <Row gutter={[12, 12]} className="mobile-account-summary-row">
              <Col xs={24} sm={12}>
                <Card
                  style={{
                    borderRadius: 12,
                    border: '1px solid #f0f0f0',
                    boxShadow: '0 1px 4px rgba(0, 0, 0, 0.06)',
                  }}
                  bodyStyle={{ padding: '16px 12px' }}
                  className="mobile-nested-card"
                >
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <div style={{ flex: 1 }}>
                      <div
                        className="mobile-card-label"
                        style={{ color: '#666', fontSize: 16, marginBottom: 8 }}
                      >
                        <FormattedMessage
                          id="outstandingAdvance"
                          defaultMessage="Outstanding Advance"
                        />
                      </div>
                      <div
                        className="mobile-card-value"
                        style={{
                          fontSize: 28,
                          fontWeight: 700,
                          color: kisan.balance < 0 ? '#ff4d4f' : '#52c41a',
                        }}
                      >
                        ₹{Math.abs(kisan.balance || 0).toLocaleString('en-IN')}
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
                      <WalletOutlined style={{ color: '#ff4d4f', fontSize: 24 }} />
                    </div>
                  </div>
                </Card>
              </Col>
              <Col xs={24} sm={12}>
                <Card
                  style={{
                    borderRadius: 12,
                    border: '1px solid #f0f0f0',
                    boxShadow: '0 1px 4px rgba(0, 0, 0, 0.06)',
                  }}
                  bodyStyle={{ padding: '16px 12px' }}
                  className="mobile-nested-card"
                >
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <div style={{ flex: 1 }}>
                      <div
                        className="mobile-card-label"
                        style={{ color: '#666', fontSize: 16, marginBottom: 8 }}
                      >
                        <FormattedMessage
                          id="totalCarryForward"
                          defaultMessage="Total Carry Forward"
                        />
                      </div>
                      <div
                        className="mobile-card-value"
                        style={{ fontSize: 28, fontWeight: 700, color: '#000' }}
                      >
                        ₹{Math.abs(carryForwardFromThisEntry || 0).toLocaleString('en-IN')}
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
                      <SwapOutlined style={{ color: '#1890ff', fontSize: 24 }} />
                    </div>
                  </div>
                </Card>
              </Col>
            </Row>
          </Card>

          {/* Form Card */}
          <Card
            className="mobile-consistent-card"
            style={{
              borderRadius: 12,
              border: '1px solid #f0f0f0',
              boxShadow: '0 2px 12px rgba(0, 0, 0, 0.08)',
              background: '#fff',
            }}
          >
            <Form
              form={form}
              layout="vertical"
              onFinish={values => submit({ preventDefault: () => {} })}
              size="large"
            >
              <div
                className="bill-details-heading-mobile mobile-section-spacing"
                style={{ textAlign: 'left', marginBottom: 32, background: 'transparent' }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'flex-start',
                    gap: 8,
                    marginBottom: 8,
                  }}
                >
                  <ShoppingCartOutlined style={{ color: '#1677ff', fontSize: 24 }} />
                  <Title
                    level={3}
                    style={{
                      color: '#2c3e50',
                      fontWeight: 600,
                      margin: 0,
                      fontSize: 18,
                    }}
                  >
                    <FormattedMessage id="billDetails" />
                  </Title>
                </div>
              </div>

              {/* Previous Bill Section */}
              <Card
                className="mobile-consistent-card"
                style={{
                  border: '1px solid #f0f0f0',
                  marginBottom: 20,
                  borderRadius: 12,
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
                }}
                title={
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: '50%',
                        background: '#e6f4ff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <WalletOutlined style={{ color: '#1677ff', fontSize: 20 }} />
                    </div>
                    <span style={{ fontSize: 18, fontWeight: 600, color: '#2c3e50' }}>
                      <FormattedMessage id="carryForwardSectionTitle" />
                    </span>
                  </div>
                }
              >
                <Row gutter={16}>
                  <Col xs={24} sm={12}>
                    <Form.Item
                      label={
                        <span style={{ fontWeight: 500, color: '#2c3e50' }}>
                          <FormattedMessage id="carryForwardAmount" />{' '}
                          <FormattedMessage id="currencyWithBracket" />
                        </span>
                      }
                      name="previousBillSettlementAmount"
                    >
                      <InputNumber
                        style={{
                          width: '100%',
                        }}
                        disabled
                        formatter={value => `₹ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                        parser={value => value.replace(/₹\s?|(,*)/g, '')}
                        size="large"
                      />
                    </Form.Item>
                  </Col>
                </Row>
              </Card>
              {/* Bill Date Section */}
              <Card
                className="mobile-consistent-card"
                style={{
                  border: '1px solid #f0f0f0',
                  marginBottom: 20,
                  borderRadius: 12,
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
                }}
                title={
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: '50%',
                        background: '#fff7e6',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <CalendarOutlined style={{ color: '#fa8c16', fontSize: 20 }} />
                    </div>
                    <span style={{ fontSize: 18, fontWeight: 600, color: '#2c3e50' }}>
                      {type === 'edit' && backDate !== '' ? (
                        <FormattedMessage id="backDatedBillMsg" />
                      ) : type === 'edit' && backDate === '' ? (
                        <FormattedMessage id="billDateSectionTitle" />
                      ) : (
                        <FormattedMessage id="backDatedBillMsg" />
                      )}
                    </span>
                  </div>
                }
                extra={null}
              >
                {/* Back Dated Bill? toggle in card content for mobile */}
                {type !== 'edit' && (
                  <div
                    className="back-dated-toggle-mobile mobile-left-pad"
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: 16,
                    }}
                  >
                    <Text style={{ fontSize: 14, fontWeight: 500, color: '#595959' }}>
                      <FormattedMessage id="backDatedBillMsg" />?
                    </Text>
                    <Switch
                      checked={isDateEditable}
                      onChange={checked => setIsDateEditable(checked)}
                      size="default"
                      checkedChildren="Yes"
                      unCheckedChildren="No"
                    />
                  </div>
                )}
                {type === 'edit' && backDate !== '' && (
                  <div
                    style={{
                      marginBottom: 16,
                      padding: 12,
                      background: '#fff2e8',
                      borderRadius: 8,
                      border: '1px solid #ffbb96',
                    }}
                  >
                    <Text type="secondary" style={{ fontSize: 14 }}>
                      <FormattedMessage id="actualBillCreationDateMsg" />
                      {' : '}
                      <Text strong style={{ color: '#fa8c16' }}>
                        {formatDate(creationDate).split('-').reverse().join('-')}
                      </Text>
                    </Text>
                  </div>
                )}
                <Row gutter={16}>
                  <Col xs={24} sm={12}>
                    <Form.Item
                      label={
                        <span style={{ fontWeight: 500, color: '#2c3e50' }}>
                          <FormattedMessage id="billDateLabel" />
                        </span>
                      }
                      name="billDate"
                      validateStatus={
                        isBillDateValid !== 'PRISTINE' && isBillDateValid !== '' ? 'error' : ''
                      }
                      help={
                        isBillDateValid === 'HASPURCHASERTRANSACTIONPOSTTHISDATE' ? (
                          <FormattedMessage id="purchaserHasTxnAfterThisDateMsg" />
                        ) : isBillDateValid === 'HASKISANTRANSACTIONPOSTTHISDATE' ? (
                          <FormattedMessage id="kisanHasTxnAfterThisDateMsg" />
                        ) : null
                      }
                    >
                      <DatePicker
                        style={{
                          width: '100%',
                        }}
                        onChange={(date, dateString) =>
                          billDateChange({ target: { value: dateString } })
                        }
                        disabled={!isDateEditable}
                        disabledDate={current => current && current.isAfter(dayjs(), 'day')}
                        format="YYYY-MM-DD"
                        size="large"
                        placeholder="Select date"
                      />
                    </Form.Item>
                  </Col>
                </Row>
              </Card>
              {/* Commodity and Purchaser Selection Card */}
              {(type === 'add' || netTotal > 0) && (
                <Card
                  className="mobile-consistent-card"
                  style={{
                    border: '1px solid #f0f0f0',
                    marginBottom: 20,
                    borderRadius: 12,
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
                  }}
                  title={
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div
                        style={{
                          width: 40,
                          height: 40,
                          borderRadius: '50%',
                          background: '#e6f4ff',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <ShopOutlined style={{ color: '#1677ff', fontSize: 20 }} />
                      </div>
                      <span
                        className="bill-total-title-mobile-mr"
                        style={{ fontSize: 18, fontWeight: 600, color: '#2c3e50' }}
                      >
                        Commodity and Purchaser
                      </span>
                    </div>
                  }
                >
                  <Row gutter={[16, 16]}>
                    <Col xs={24} sm={12}>
                      <Form.Item
                        label={
                          <span style={{ fontWeight: 500, color: '#2c3e50' }}>
                            <FormattedMessage id="whatAreYouBuyingText" />
                          </span>
                        }
                        name="itemType"
                        validateStatus={
                          ispurchaserInvalid === 'TRUE' || isItemTypeInvalid === 'TRUE'
                            ? 'error'
                            : ''
                        }
                        help={
                          ispurchaserInvalid === 'TRUE' || isItemTypeInvalid === 'TRUE' ? (
                            <FormattedMessage id="selectTradingAndPurchaserIsRequired" />
                          ) : null
                        }
                      >
                        <Select
                          placeholder={intlA.formatMessage({ id: 'selectTradingType' })}
                          disabled={type === 'edit'}
                          onChange={value => handleItemChange({ target: { value } })}
                          size="large"
                        >
                          <Option value="">
                            {intlA.formatMessage({ id: 'selectTradingType' })}
                          </Option>
                          {inventory.map(item => (
                            <Option key={item._id} value={item.itemName}>
                              {item.itemName}
                            </Option>
                          ))}
                        </Select>
                      </Form.Item>
                    </Col>
                    <Col xs={24} sm={12}>
                      {purchaserData && purchaserData.length > 0 ? (
                        <TypeAhead
                          purchaserData={purchaserData}
                          selectedPurchaser={handlePurchaserChange}
                          type={type}
                          editedValue={purchaser}
                          isDisabled={type === 'edit' || itemType === ''}
                          isInvalid={ispurchaserInvalid === 'TRUE' || isItemTypeInvalid === 'TRUE'}
                        />
                      ) : null}
                    </Col>
                  </Row>

                  {/* No Purchaser Available Section */}
                  {purchaserData && purchaserData.length === 0 && itemType && (
                    <div
                      className="mobile-left-pad"
                      style={{
                        marginBottom: 24,
                        padding: 16,
                        background: '#fff7e6',
                        borderRadius: 8,
                        border: '1px solid #ffd591',
                      }}
                    >
                      <Text strong style={{ color: '#d46b08' }}>
                        <FormattedMessage id="purchaserNotAvailableForSelectedCommodityText" />
                      </Text>
                      <br />
                      <Button
                        type="primary"
                        onClick={handleCreatePurchaser}
                        style={{
                          marginTop: 12,
                        }}
                        size="middle"
                      >
                        <FormattedMessage id="addPurchaserButtonText" />
                      </Button>
                    </div>
                  )}
                </Card>
              )}

              {/* Trading Details Card */}
              {(type === 'add' || netTotal > 0) && (
                <Card
                  className="mobile-consistent-card"
                  style={{
                    border: '1px solid #f0f0f0',
                    marginBottom: 20,
                    borderRadius: 12,
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
                  }}
                  title={
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div
                        style={{
                          width: 40,
                          height: 40,
                          borderRadius: '50%',
                          background: '#f6ffed',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <CalculatorOutlined style={{ color: '#52c41a', fontSize: 20 }} />
                      </div>
                      <span
                        className="bill-total-title-mobile-mr"
                        style={{ fontSize: 18, fontWeight: 600, color: '#2c3e50' }}
                      >
                        Trading Details
                        <span className="mobile-hide-text"> (Cost of Commodity)</span>
                      </span>
                    </div>
                  }
                >
                  <Row gutter={[16, 16]}>
                    <Col xs={24} sm={8}>
                      <Form.Item
                        label={
                          <span style={{ fontWeight: 500, color: '#2c3e50' }}>
                            <FormattedMessage id="numberOfBags" />
                          </span>
                        }
                        name="numberofBags"
                        validateStatus={
                          numberofBags && numberofBags < 0 && isNumberofBagsValid === ''
                            ? 'error'
                            : ''
                        }
                        help={
                          numberofBags && numberofBags < 0 && isNumberofBagsValid === '' ? (
                            <FormattedMessage id="numberOfBagsCNBLTZ" />
                          ) : null
                        }
                      >
                        <InputNumber
                          style={{
                            width: '100%',
                          }}
                          disabled={type === 'edit' || itemType === ''}
                          onChange={value => numberofBagsChange({ target: { value } })}
                          min={0}
                          size="large"
                          placeholder="Enter bags count"
                        />
                      </Form.Item>
                    </Col>
                    <Col xs={24} sm={8}>
                      <Form.Item
                        label={
                          <span style={{ fontWeight: 500, color: '#2c3e50' }}>
                            <FormattedMessage id="totalWeight" />
                          </span>
                        }
                        name="totalweight"
                        validateStatus={
                          totalweight && totalweight < 0 && isTotalWeigthValid === '' ? 'error' : ''
                        }
                        help={
                          totalweight && totalweight < 0 && isTotalWeigthValid === '' ? (
                            <FormattedMessage id="totalWeightCNBLTZ" />
                          ) : null
                        }
                      >
                        <InputNumber
                          style={{
                            width: '100%',
                          }}
                          disabled={type === 'edit' || itemType === ''}
                          onChange={value => totalWeightChange({ target: { value } })}
                          min={0}
                          size="large"
                          placeholder="Enter weight (kg)"
                          addonAfter="kg"
                        />
                      </Form.Item>
                    </Col>
                    <Col xs={24} sm={8}>
                      <Form.Item
                        label={
                          <span style={{ fontWeight: 500, color: '#2c3e50' }}>
                            <FormattedMessage id="ratePerKg" />
                          </span>
                        }
                        name="rate"
                        validateStatus={rate && rate < 0 && isRateValid === '' ? 'error' : ''}
                        help={
                          rate && rate < 0 && isRateValid === '' ? (
                            <FormattedMessage id="ratePerKgCNBLTZ" />
                          ) : null
                        }
                      >
                        <InputNumber
                          style={{
                            width: '100%',
                          }}
                          disabled={type === 'edit' || itemType === ''}
                          value={rate}
                          onChange={value => rateChange({ target: { value } })}
                          min={0}
                          step={0.01}
                          precision={2}
                          size="large"
                          placeholder="Enter rate per kg"
                          addonBefore="₹"
                        />
                      </Form.Item>
                    </Col>
                  </Row>

                  <Title
                    level={5}
                    style={{
                      margin: 0,
                      color: '#52c41a',
                      fontWeight: 600,
                      fontSize: 16,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'right',
                    }}
                  >
                    Trading Total (Cost of Commodity): ₹{grossTotal.toLocaleString('en-IN')}
                  </Title>
                </Card>
              )}

              {/* Deductions Section */}
              {(type === 'add' || netTotal > 0) && (
                <Card
                  className="mobile-consistent-card"
                  style={{
                    border: '1px solid #f0f0f0',
                    marginBottom: 20,
                    borderRadius: 12,
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
                  }}
                  title={
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div
                        style={{
                          width: 40,
                          height: 40,
                          borderRadius: '50%',
                          background: '#fff1f0',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <CalculatorOutlined style={{ color: '#ff4d4f', fontSize: 20 }} />
                      </div>
                      <span style={{ fontSize: 18, fontWeight: 600, color: '#2c3e50' }}>
                        <FormattedMessage id="deductionsSectionTitle" />
                      </span>
                    </div>
                  }
                >
                  <Row gutter={16}>
                    <Col xs={24} sm={8}>
                      <Form.Item
                        label={
                          <span>
                            <FormattedMessage id="commission" /> -
                            <Text strong style={{ color: '#1677ff' }}>
                              {' '}
                              Total: ₹{(grossTotal * (commission / 100)).toLocaleString('en-IN')}
                            </Text>
                          </span>
                        }
                        name="commission"
                        validateStatus={
                          commission && commission <= 0 && isCommissionValid === '' ? 'error' : ''
                        }
                        help={
                          commission && commission <= 0 && isCommissionValid === '' ? (
                            <FormattedMessage id="totalCommissionCNBLTZ" />
                          ) : null
                        }
                      >
                        <InputNumber
                          style={{ width: '100%' }}
                          disabled={type === 'edit'}
                          value={commission}
                          onChange={value => commisionChange({ target: { value } })}
                          min={0}
                          addonAfter="%"
                        />
                      </Form.Item>
                    </Col>
                    <Col xs={24} sm={8}>
                      <Form.Item
                        label={<FormattedMessage id="hammali" />}
                        name="hammali"
                        validateStatus={
                          hammali && hammali <= 0 && isHammalivalid === '' ? 'error' : ''
                        }
                        help={
                          hammali && hammali <= 0 && isHammalivalid === '' ? (
                            <FormattedMessage id="hammaliCNBLTZ" />
                          ) : null
                        }
                      >
                        <InputNumber
                          style={{ width: '100%' }}
                          disabled={type === 'edit'}
                          value={hammali}
                          onChange={value => hammaliChange({ target: { value } })}
                          min={0}
                          formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                          parser={value => value.replace(/\$\s?|(,*)/g, '')}
                        />
                      </Form.Item>
                    </Col>
                    <Col xs={24} sm={8}>
                      <Form.Item
                        label={<FormattedMessage id="bhada" />}
                        name="bhada"
                        validateStatus={bhada && bhada < 0 && isBhadaValid === '' ? 'error' : ''}
                        help={
                          bhada && bhada < 0 && isBhadaValid === '' ? (
                            <FormattedMessage id="bhadaCNBLTZ" />
                          ) : null
                        }
                      >
                        <InputNumber
                          style={{ width: '100%' }}
                          disabled={type === 'edit'}
                          value={bhada}
                          onChange={value => bhadaChange({ target: { value } })}
                          min={0}
                        />
                      </Form.Item>
                    </Col>
                  </Row>

                  <Divider />

                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'flex-end',
                      flexDirection: 'column',
                      gap: 8,
                    }}
                  >
                    <Title level={5} style={{ margin: 0, color: '#52c41a' }}>
                      <FormattedMessage id="netTotal" /> ₹{netTotal.toLocaleString('en-IN')}
                    </Title>
                    {type === 'add' && (
                      <Text style={{ fontSize: 14, color: '#666' }}>
                        <FormattedMessage id="billTotal" /> +{' '}
                        <FormattedMessage id="carryForwardAmount" />
                        <Text strong style={{ color: '#1677ff' }}>
                          {' = ₹'}
                          {(netTotal + previousBillSettlementAmount).toLocaleString('en-IN')}
                        </Text>
                      </Text>
                    )}
                  </div>
                </Card>
              )}
              {/* Bill Settlement Section - Edit Mode */}
              {type === 'edit' && netTotal > 0 && (
                <Card
                  className="mobile-consistent-card"
                  style={{
                    border: '1px solid #f0f0f0',
                    marginBottom: 20,
                    borderRadius: 12,
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
                  }}
                  title={
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div
                        style={{
                          width: 40,
                          height: 40,
                          borderRadius: '50%',
                          background: '#f9f0ff',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <InfoCircleOutlined style={{ color: '#722ed1', fontSize: 20 }} />
                      </div>
                      <span style={{ fontSize: 18, fontWeight: 600, color: '#2c3e50' }}>
                        <FormattedMessage id="billettlementSummarySectionTitle" />
                      </span>
                    </div>
                  }
                >
                  {/* Bill Total Pill - First Line */}
                  <div style={{ marginBottom: 16, display: 'flex' }}>
                    <div
                      style={{
                        background: '#f8f9fa',
                        border: '1px solid #52c41a',
                        borderRadius: 20,
                        padding: '8px 16px',
                        fontSize: 14,
                        color: '#52c41a',
                        fontWeight: 600,
                      }}
                    >
                      <FormattedMessage id="billTotal" /> (After Deductions): ₹
                      {netTotal.toLocaleString('en-IN')}
                    </div>
                  </div>

                  {/* Three Fields - Second Line */}
                  <Row gutter={16}>
                    <Col xs={24} sm={8}>
                      <Form.Item
                        label={
                          <span>
                            <FormattedMessage id="advanceCredited" />{' '}
                            <FormattedMessage id="currencyWithBracket" />
                          </span>
                        }
                        name="advanceSettlement1"
                      >
                        <InputNumber style={{ width: '100%' }} disabled />
                      </Form.Item>
                    </Col>
                    <Col xs={24} sm={8}>
                      <Form.Item
                        label={
                          <span>
                            <FormattedMessage id="cashPaid" />{' '}
                            <FormattedMessage id="currencyWithBracket" />
                          </span>
                        }
                        name="paidToKisan1"
                      >
                        <InputNumber style={{ width: '100%' }} disabled />
                      </Form.Item>
                    </Col>
                    <Col xs={24} sm={8}>
                      <Form.Item
                        label={
                          <span>
                            <FormattedMessage id="carryForward" />{' '}
                            <FormattedMessage id="currencyWithBracket" />
                          </span>
                        }
                        name="carryForwardFromThisEntry1"
                      >
                        <InputNumber style={{ width: '100%' }} disabled />
                      </Form.Item>
                    </Col>
                  </Row>
                </Card>
              )}

              {/* Advance Settlement Section */}
              {kisan.balance !== 0 && (
                <Card
                  className="mobile-consistent-card"
                  style={{
                    border: '1px solid #f0f0f0',
                    marginBottom: 20,
                    borderRadius: 12,
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
                  }}
                  title={
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div
                        style={{
                          width: 40,
                          height: 40,
                          borderRadius: '50%',
                          background: '#e6fffb',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <CalculatorOutlined style={{ color: '#13c2c2', fontSize: 20 }} />
                      </div>
                      <span style={{ fontSize: 18, fontWeight: 600, color: '#2c3e50' }}>
                        <FormattedMessage id="advanceSettlementSectionTitle" />
                      </span>
                    </div>
                  }
                >
                  <div style={{ marginBottom: 16 }}>
                    <Text type="secondary">
                      <FormattedMessage id="balance" /> =
                    </Text>
                    <Text strong style={{ color: '#1677ff', marginLeft: 8 }}>
                      ₹
                      {Math.abs(
                        type === 'add'
                          ? kisan.balance
                          : balanceAfterThisTransaction - advanceSettlement
                      ).toLocaleString('en-IN')}
                    </Text>
                  </div>

                  <Row gutter={16}>
                    <Col xs={24} sm={12}>
                      <Form.Item
                        label={
                          <span>
                            <FormattedMessage id="advanceCredited" />{' '}
                            <FormattedMessage id="currencyWithBracket" />
                          </span>
                        }
                        name="advanceSettlement"
                        validateStatus={
                          isAdvanceSettlementValid === 'OUTSTANDINGEXCEEDED' ||
                          isAdvanceSettlementValid === 'TOTALEXCEEDED' ||
                          isAdvanceSettlementValid === ''
                            ? 'error'
                            : ''
                        }
                        help={
                          isAdvanceSettlementValid === '' ? (
                            <FormattedMessage id="balanceCNBLTZ" />
                          ) : isAdvanceSettlementValid === 'OUTSTANDINGEXCEEDED' ? (
                            <>
                              <FormattedMessage id="balanceCBMTOA" />{' '}
                              {Math.abs(kisan.balance).toLocaleString('en-IN')}
                            </>
                          ) : isAdvanceSettlementValid === 'TOTALEXCEEDED' ? (
                            <>
                              <FormattedMessage id="balanceCBMTCB" />{' '}
                              {(netTotal + previousBillSettlementAmount).toLocaleString('en-IN')}
                            </>
                          ) : null
                        }
                      >
                        <InputNumber
                          disabled={type === 'edit' || kisan.balance === 0}
                          onChange={value => advanceSettlementChange({ target: { value } })}
                          min={0}
                          formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                          parser={value => value.replace(/\$\s?|(,*)/g, '')}
                        />
                      </Form.Item>
                    </Col>
                    <Col xs={24} sm={12}>
                      <Form.Item
                        label={<FormattedMessage id="balanceAfterBillTextWithoutCurrency" />}
                        name="carryForwardAdvance"
                      >
                        <InputNumber
                          style={{ width: '100%' }}
                          disabled
                          formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                        />
                      </Form.Item>
                    </Col>
                  </Row>
                </Card>
              )}

              {/* Payment Settlement Section */}
              <Card
                className="mobile-consistent-card"
                style={{
                  border: '1px solid #f0f0f0',
                  marginBottom: 20,
                  borderRadius: 12,
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
                }}
                title={
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: '50%',
                        background: '#fffbe6',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <CalculatorOutlined style={{ color: '#faad14', fontSize: 20 }} />
                    </div>
                    <span style={{ fontSize: 18, fontWeight: 600, color: '#2c3e50' }}>
                      <FormattedMessage id="paymentSettlementSectionTitle" />
                    </span>
                  </div>
                }
              >
                <div className="payment-settlement-heading" style={{ marginBottom: 16 }}>
                  <Text
                    className="mobile-left-pad"
                    style={{ color: '#1677ff', fontWeight: 500, marginRight: 8 }}
                  >
                    <FormattedMessage id="paymentToSettle" /> =
                  </Text>
                  {netTotal > 0 && (
                    <Text style={{ marginLeft: 8, color: '#1677ff' }}>
                      <FormattedMessage id="billTotal" /> +
                    </Text>
                  )}
                  <Text style={{ marginLeft: 4, color: '#1677ff' }}>
                    <FormattedMessage id="carryForwardAmount" />
                  </Text>
                  <Text strong style={{ color: '#1677ff', marginLeft: 8 }}>
                    = ₹{(netTotal + previousBillSettlementAmount).toLocaleString('en-IN')}
                  </Text>

                  {/* Bill Total pill - left aligned with subtle background (only in add mode) */}
                  {type === 'add' && netTotal > 0 && (
                    <div style={{ marginTop: 12, display: 'flex', justifyContent: 'flex-start' }}>
                      <div
                        style={{
                          background: '#f6f6f6',
                          border: '1px solid #d9d9d9',
                          borderRadius: 20,
                          padding: '6px 14px',
                          fontSize: 12,
                          color: '#666',
                          fontWeight: 500,
                        }}
                      >
                        <FormattedMessage id="billTotal" />: ₹{netTotal.toLocaleString('en-IN')}
                      </div>
                    </div>
                  )}
                </div>{' '}
                <Row gutter={16}>
                  <Col xs={24} sm={12}>
                    <Form.Item
                      label={
                        <span>
                          <FormattedMessage id="cashPaid" />{' '}
                          <FormattedMessage id="currencyWithBracket" />
                        </span>
                      }
                      name="paidToKisan"
                      validateStatus={
                        isPaidToKisanValid === '' || isPaidToKisanValid === 'TOTALEXCEEDED'
                          ? 'error'
                          : ''
                      }
                      help={
                        isPaidToKisanValid === 'TOTALEXCEEDED' ? (
                          <>
                            <FormattedMessage id="cashPaidCBMTCB" />{' '}
                            {(netTotal + previousBillSettlementAmount).toLocaleString('en-IN')}
                          </>
                        ) : isPaidToKisanValid === '' ? (
                          <FormattedMessage id="cashPaidCNBLTZ" />
                        ) : null
                      }
                    >
                      <InputNumber
                        style={{ width: '100%' }}
                        disabled={type === 'edit'}
                        value={paidToKisan}
                        onChange={value => paidToKisanChange({ target: { value } })}
                        min={0}
                        formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                        parser={value => value.replace(/\$\s?|(,*)/g, '')}
                      />
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={12}>
                    <Form.Item
                      label={
                        <span>
                          <FormattedMessage id="carryForward" />{' '}
                          <FormattedMessage id="currencyWithBracket" />
                        </span>
                      }
                      name="carryForwardFromThisEntry"
                    >
                      <InputNumber
                        style={{ width: '100%' }}
                        disabled
                        value={carryForwardFromThisEntry}
                        formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                      />
                    </Form.Item>
                  </Col>
                </Row>
              </Card>

              {/* Payment Summary Section - Edit Mode Payment Only */}
              {type === 'edit' && netTotal < 1 && (
                <Card
                  className="mobile-consistent-card"
                  style={{
                    border: '1px solid #f0f0f0',
                    marginBottom: 20,
                    borderRadius: 12,
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
                  }}
                  title={
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div
                        style={{
                          width: 40,
                          height: 40,
                          borderRadius: '50%',
                          background: '#f6ffed',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <CheckCircleOutlined style={{ color: '#52c41a', fontSize: 20 }} />
                      </div>
                      <span style={{ fontSize: 18, fontWeight: 600, color: '#2c3e50' }}>
                        <FormattedMessage id="settlementSectionTitleForPaymentOnly" />
                      </span>
                    </div>
                  }
                >
                  <Row gutter={16}>
                    <Col xs={24} sm={8}>
                      <div style={{ marginBottom: 16 }}>
                        <Text type="secondary">
                          <FormattedMessage id="advanceCredited" />{' '}
                          <FormattedMessage id="currencyWithBracket" />
                        </Text>
                        <br />
                        <Text strong style={{ fontSize: 16 }}>
                          ₹{advanceSettlement.toLocaleString('en-IN')}
                        </Text>
                      </div>
                    </Col>
                    <Col xs={24} sm={8}>
                      <div style={{ marginBottom: 16 }}>
                        <Text type="secondary">
                          <FormattedMessage id="cashPaid" />{' '}
                          <FormattedMessage id="currencyWithBracket" />
                        </Text>
                        <br />
                        <Text strong style={{ fontSize: 16 }}>
                          ₹{paidToKisan.toLocaleString('en-IN')}
                        </Text>
                      </div>
                    </Col>
                    <Col xs={24} sm={8}>
                      <div style={{ marginBottom: 16 }}>
                        <Text type="danger">
                          <FormattedMessage id="totalPaymentOfThisBill" />{' '}
                          <FormattedMessage id="currencyWithBracket" />
                        </Text>
                        <br />
                        <Text strong style={{ fontSize: 16, color: '#ff4d4f' }}>
                          ₹{(paidToKisan + advanceSettlement).toLocaleString('en-IN')}
                        </Text>
                      </div>
                    </Col>
                  </Row>
                </Card>
              )}

              {/* Comment Section */}
              <Card
                className="mobile-consistent-card"
                style={{
                  border: '1px solid #f0f0f0',
                  marginBottom: 24,
                  borderRadius: 12,
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
                }}
                title={
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: '50%',
                        background: '#fff7e6',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <CommentOutlined style={{ color: '#fa8c16', fontSize: 20 }} />
                    </div>
                    <span style={{ fontSize: 18, fontWeight: 600, color: '#2c3e50' }}>
                      <FormattedMessage id="comment" />
                    </span>
                  </div>
                }
              >
                <Form.Item
                  name="comment"
                  validateStatus={comment.length <= 0 && isCommentValid === '' ? 'error' : ''}
                  help={
                    comment.length <= 0 && isCommentValid === '' ? (
                      <FormattedMessage id="commentIsRequired" />
                    ) : null
                  }
                  rules={[
                    {
                      required: true,
                      message: intlA.formatMessage({ id: 'commentIsRequired' }),
                    },
                  ]}
                >
                  <TextArea
                    rows={4}
                    placeholder="Enter your comment here..."
                    value={comment}
                    onChange={e => commentChange(e)}
                  />
                </Form.Item>
              </Card>

              {/* Action Buttons */}
              <div
                className="mobile-action-buttons"
                style={{
                  textAlign: 'left',
                  marginTop: 40,
                  padding: 24,
                  background: '#f8f9fa',
                  borderRadius: 12,
                  border: '1px solid #e9ecef',
                }}
              >
                {type === 'add' ? (
                  <Space size="large">
                    <Button
                      type="primary"
                      htmlType="submit"
                      size="large"
                      icon={<SaveOutlined />}
                      loading={isSubmitting}
                      style={{
                        minWidth: 180,
                        height: 48,
                        borderRadius: 8,
                        fontSize: 16,
                        fontWeight: 600,
                      }}
                    >
                      Create Credit Entry
                    </Button>
                    <Button
                      size="large"
                      icon={<ReloadOutlined />}
                      onClick={clear}
                      style={{
                        minWidth: 140,
                        height: 48,
                        borderRadius: 8,
                        fontSize: 16,
                        fontWeight: 500,
                      }}
                    >
                      Reset
                    </Button>
                  </Space>
                ) : (
                  <Button
                    type="primary"
                    size="large"
                    icon={<SaveOutlined />}
                    onClick={handleEdit}
                    loading={isSubmitting}
                    style={{
                      minWidth: 180,
                      height: 48,
                      borderRadius: 8,
                      fontSize: 16,
                      fontWeight: 600,
                    }}
                  >
                    <FormattedMessage id="editCreditEntryButtonTitle" />
                  </Button>
                )}
              </div>

              {/* Success Alert */}
              {showAlert && (
                <Alert
                  style={{
                    marginTop: 20,
                  }}
                  message={
                    <span style={{ fontWeight: 500, fontSize: 16 }}>
                      {type === 'add' ? (
                        <FormattedMessage id="entryAddSuccessMsg" />
                      ) : (
                        <FormattedMessage id="entryEditSuccessMsg" />
                      )}
                    </span>
                  }
                  type="success"
                  showIcon
                  closable
                />
              )}
            </Form>
          </Card>
        </>
      )}
    </div>
  );
};

export default CreditForm;
