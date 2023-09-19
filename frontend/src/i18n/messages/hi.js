import { LOCALES } from "../locales";
const hi = {
  [LOCALES.HINDI]: {
    /*common*/
    name: "नाम",
    fatherName: "पिता का नाम",
    phone: "फ़ोन नंबर",
    address: "पता",
    currency: "₹",
    companyName: "कंपनी (फ़र्म) का नाम",
    editKisan: "किसान का ब्यौरा सुधारें",
    editPurchaser:"खरीदार का ब्यौरा सुधारें",

    /*login Page */
    login: "लॉगइन",
    username: "यूज़र का नाम",
    password: "पासवर्ड",
    signin: "साइन इन",
    usernameError: "यूज़र का नाम देना अनिवार्य है।",
    passwordError: "पासवर्ड देना अनिवार्य है।",

    /*Header*/
    hello: "नमस्ते",
    purchaser: "खरीदार",
    kisan: "किसान",
    report: "रिपोर्ट",
    logout: "लॉगआउट",
    inventory: "इनवेंटरी",

    /*Home Page*/
    welcomeMsg: "महाराज वेजिटेबल कंपनी के",
    brandName: "डिज़िटल प्लेटफॉर्म में आपका स्वागत है।",

    /*Kisan Landing Page*/
    kisanLandingTitle: "किसान विवरणिका ",
    addKisanButtonText: "नया किसान",
    searchBy: "खोजें (द्वारा)",
    searchValue: "खोज का विवरण",
    searchButtonText: "खोजें",
    resetButtonText: "रीसेट",
    printButtonText: "प्रिंट",
    currencyWithBracket:"(₹)",

    /*Add Kisan Page*/
    newKisanDeatils: "नये किसान का ब्यौरा",
    nameIsRequired: "नाम देना अनिवार्य है।",
    fatherNameIsRequired: "पिता का नाम देना अनिवार्य है।",
    phoneIsRequired: "फ़ोन नंबर देना अनिवार्य है।",
    addressIsRequired: "पता देना अनिवार्य है।",
    addNewKisanButtonText: "नया किसान जोड़ें",
    addKisanSuccessful: "नया किसान सफलतापूर्वक जोड़ा गया।",
    editKisanSuccessful: "किसान का ब्यौरा सफलतापूर्वक सुधारा गया।",
    updateKisanBtnText: "किसान का ब्यौरा सुधारें",

    /*Kisan Detail Page*/
    kisanDetailsTitle: "किसान का विवरण",
    carryForwardAmount: "पिछले बिल तक टोटल बकाया भुगतान",
    giveAdvanceKisanButtonText: "एडवांस दें",
    createBillKisanButtonText: "बिल बनायें",
    depositAdvanceKisanButtonText: "एडवांस वापसी की एंट्री करें",
    transactionDetailsTitle: "लेन-देन का विवरण",

    /*Table columns Kisan Detail Page*/
    currentBillTableRowSectionText:"बिल में दर्ज राशियां (₹)",
    overAllOutstandingTableRowSectionText:"बिल के बाद टोटल बकाया (₹)",
    balance: "टोटल बकाया एडवांस",
    date: "दिनांक",
    comment: "एंट्री का विवरण",
    advanceDebited: "एडवांस दिया",
    grossTotalWithCurrency: "ट्रेडिंग टोटल",
    billTotal: "बिल टोटल",
    advanceCredited: "एडवांस वसूला",
    cashPaid: "नगद भुगतान",
    carryForwardFromThisBill : "बकाया भुगतान",
    carryForward: "टोटल बकाया भुगतान",
    totalPaymentOfThisBill : "इस बिल की कुल पेमेंट (₹)",
    actions: "कार्यवाही",
    editButtonText: "सुधारें",
    viewButtonText: "देखें",
    yesButton: "हाँ",
    noButton: "नहीं",
    entryAddSuccessMsg:"एंटी सफलतापूर्वक जोड़ी गयी...!",
    entryEditSuccessMsg:"एंटी सफलतापूर्वक सुधारी गयी...!",

    /*Debit Entry Form*/
    advanceDetails: "एडवांस का विवरण",
    createEntryButtonText: "एंट्री करें",
    amountSBGTZ: "एडवांस की राशि 0 से अधिक होनी चाहिये। ",
    amountCNBZ: "राशि दर्ज़ करना अनिवार्य है! राशि + या - में दर्ज़ कर सकते हैं। 0 अमान्य है ।",
    advanceSCNBMTO: "यह राशि, कुल बकाया  एडवांस से ज्यादा नहीं हो सकती है। अधिकतम मान्य राशि = ₹ ",

    /*Advance Deposit Form*/
    advanceDepositDetails: "एडवांस वापसी हेतु किसान द्वारा जमा की जाने वाली राशि का विवरण",
    balanceTextTillThisWithoutCurrency: "इस एंट्री के पहले कुल बकाया  एडवांस",

    /*Credit Entry Form*/
    billDetails: "बिल का विवरण",
    tradingSectionTitle: "ट्रेडिंग का विवरण",
    carryForwardSectionTitle: "पिछले बक़ाये का विवरण",
    carryForwardTotal: "टोटल बकाया  भुगतान",
    selectTradingType: "-- कमोडिटी का नाम चुनें --",
    numberOfBags: "बोरों की संख्या (नग)",
    totalWeight: "कुल वजन (कि.ग्रा.में)",
    ratePerKg: "प्रति किलोग्राम भाव (₹)",
    grossTotal: "ट्रेडिंग टोटल (कमोडिटी का कुल मूल्य) : ₹ ",
    purchaserSectionTitle: "खरीदार का विवरण",
    purchaserName: "खरीदार का नाम",
    selectPurchaser: "-- खरीदार का नाम चुनें --",
    deductionsSectionTitle: "कटौती",
    commission: "कमीशन (% में) :",
    totalCommission: "कुल कमीशन : ",
    hammali: "हम्माली (₹) :",
    bhada: "भाड़ा (₹) :",
    netTotal: "बिल टोटल (कटौती के बाद) : ₹ ",
    amountToSettle: "बकाया  भुगतान",
    paymentSettlementSectionTitle: "पेमेंट समायोजन",
    advanceSettlementSectionTitle: "एडवांस समायोजन",
    settlementSectionTitleForPaymentOnly: "पेमेंट का ब्यौरा",
    billettlementSummarySectionTitle: "बिल का हिसाब",
    balanceAfterBillTextWithoutCurrency: "बिल के बाद टोटल बकाया एडवांस (₹)",
    whatAreYouBuyingText: "कमोडिटी (सामग्री) का नाम :",
    Matar: "मटर",
    Tamatar: "टमाटर",
    Dhaniya: "धनिया",
    editCreditEntryButtonTitle: "एंट्री अपडेट करें",
    billDateSectionTitle: "बिल दिनाँक",
    billDateLabel:"बिल में दिखायी जाने वाली दिनाँक",
    backDatedBillMsg:"बैक डेटेड बिल",
    backDatedEntryMsg:"बैक डेटेड एंट्री",
    entryDateLabel: "दिखायी जाने वाली दिनाँक",

    /*Credit Entry Form Errors*/
    numberOfBagsCNBLTZ: "बोरों की संख्या (नग) 0 से काम नहीं हो सकती है। ",
    totalWeightCNBLTZ: "वजन 0 से काम नहीं हो सकता है। ",
    ratePerKgCNBLTZ: "प्रति किलोग्राम भाव 0 से काम नहीं हो सकता है। ",
    totalCommissionCNBLTZ: "कमीशन 0 से काम नहीं हो सकती है। ",
    hammaliCNBLTZ: "हम्माली 0 से काम नहीं हो सकती है। ",
    bhadaCNBLTZ: "भाड़ा 0 से काम नहीं हो सकता है। ",
    balanceCNBLTZ: "एडवांस चुकाने की राशि  0 से काम नहीं हो सकती है।",
    cashPaidCNBLTZ: "नगद भुगतान की राशि  0 से काम नहीं हो सकती है।",
    balanceCBMTCB:
      'एडवांस चुकाने की राशि, "समायोजित की जाने वाली राशि" से अधिक नहीं हो सकती है। अधिकतम मान्य राशि = ₹ ',
    balanceCBMTOA:
      'एडवांस चुकाने की राशि, "कुल बकाया एडवांस" से अधिक नहीं हो सकती है। अधिकतम मान्य राशि = ₹',
    cashPaidCBMTCB:
      'नगद भुगतान की राशि "समायोजित की जाने वाली राशि" से अधिक नहीं हो सकती है। अधिकतम मान्य राशि = ₹ ',
    commentIsRequired: "एंट्री का विवरण देना अनिवार्य है। ",
    selectTradingAndPurchaserIsRequired: "यदि आप किसी कमोडिटी का चयन कर रहे हैं, तो खरीदार का चयन करना भी अनिवार्य है। ",
    selectingPurchaserIsRequired: "खरीदार का चयन करना अनिवार्य है। ",
    advanceSettlementAddedSuccessfully:"एडवांस वापसी की एंटी सफलतापूर्वक जोड़ी गयी।",
    advanceSettlementUpdatedSuccessfully:"एडवांस वापसी की एंटी सफलतापूर्वक सुधारी गयी।",
    kisanHasTxnAfterThisDateMsg: "इस किसान के लिए, चयनित दिनांक के बाद की दिनांकों पर, अन्य लेन-देन दर्ज किये जा चुके हैं : इसलिए आपको चयनित दिनांक पर इस किसान का बिल बनाने की अनुमति नहीं है।",
    kisanHasTxnAfterThisDateMsgForEntry: "इस किसान के लिए, चयनित दिनांक के बाद की दिनांकों पर, अन्य लेन-देन दर्ज किये जा चुके हैं : इसलिए आपको चयनित दिनांक पर इस किसान की एंट्री करने की अनुमति नहीं है।",
    purchaserHasTxnAfterThisDateMsg: "चयनित खरीदार के लिए, चयनित दिनांक के बाद की दिनांकों पर,अन्य लेन-देन दर्ज किये जा चुके हैं : इसलिए आपको इस दिनांक पर इस खरीदार के साथ इस किसान का बिल बनाने की अनुमति नहीं है।",
    actualBillCreationDateMsg: "बिल एंट्री की दिनांक ",
    /* Inventory Langing */
    inventoryLandingTitle: "इनवेंटरी विवरणिका",
    addfasalType: "कमोडिटी जोड़ें",
    noInventoryForThisItem: "इस कमोडिटी की कोई इन्वेंटरी उपलब्ध नहीं है।",
    transacted: "हस्तांतरित ",

    /* Inventory Add Item Type */
    inventoryAddHeading: "नई  कमोडिटी (सामग्री) का विवरण",
    inventory_itemName: "कमोडिटी (सामग्री) का नाम",
    inventory_itemError: "कमोडिटी (सामग्री) का नाम देना अनिवार्य है।",
    inventory_addSuccessful: "कमोडिटी सफलतापूर्वक जोड़ी गयी",

    /* Purchaser */
    purchaserLandingTitle: "खरीदार विवरणिका",
    addPurchaserButtonText: "खरीदार जोड़ें",
    newPurchaserDeatils: "नये खरीदार का ब्यौरा",

    /*Add Purchaser Form*/
    companyNameIsRequired: "कंपनी (फ़र्म) का नाम देना अनिवार्य है।",
    purchaser_addSuccessful: "खरीदार सफलतापूर्वक जोड़ा गया !",
    purchaser_editSuccessful : "खरीदार का विवरण सफलतापूर्वक सुधारा गया !",

    /*Purchase Table*/
    nameOfPurchase: "खरीदार का नाम",
    outstandingPayment: "कुल बकाया  पेमेंट (₹)",
    outstandingPaymentADT: "एंट्री तक का बकाया  (₹)",

    /*Purchaser Details*/
    purchaserDetailsPageTitle: "खरीदार का विवरण",
    purchaserPaymentEntryButtonText: "पेमेंट एंट्री",
    purchaseTotal: "खरीदी का टोटल (₹)",
    transactionType: "लेन देन का प्रकार",
    tt_purchase: "खरीद",
    tt_payment: "पेमेंट",
    purchaserPaymentFormTitle: "पेमेंट विवरण",
    paymentAmount: "पेमेंट की राशि",
    negativePaymentPopupHeading: "निगेटिव राशि हेतु चेतावनी !",
    negativePaymentPopupContent: "कृपया पुष्टि करें कि क्या आप यह राशि दर्ज करना चाहते हैं (₹) = ",

    /*Dashboard Page*/
    totalAdvacePendingWithKisan:"किसानो का कुल बकाया  एडवांस (₹)",
    totalPurchaserOutstanding:"खरीदारों की कुल बकाया  पेमेंट्स (₹)",
    totalItemweight:"कुल वजन (कि.ग्रा.में)",
    totalBagsSoldToday:"आज बेचे गए कुल बोरों की संख्या (नग)",

    /* Year Selector */
    selectYearTitle: "कृपया ट्रांजेक्शन ईयर सेलेक्ट करें",
    yearTitle: "ईयर",
  },
};
export default hi;
