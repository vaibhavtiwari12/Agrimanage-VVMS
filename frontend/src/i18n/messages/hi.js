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
    editPurchaser:"ख़रीदार का ब्यौरा सुधारें",

    /*login Page */
    login: "लॉगइन",
    username: "यूज़र का नाम",
    password: "पासवर्ड",
    signin: "साइन इन",
    usernameError: "यूज़र का नाम देना अनिवार्य है।",
    passwordError: "पासवर्ड देना अनिवार्य है।",

    /*Header*/
    hello: "नमस्ते",
    purchaser: "ख़रीदार",
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
    carryForwardAmount: "पिछले बिलों का कोई बक़ाया भुगतान (₹)",
    giveAdvanceKisanButtonText: "एडवांस दें",
    createBillKisanButtonText: "बिल बनायें",
    depositAdvanceKisanButtonText: "एडवांस वापसी की एंट्री करें",
    transactionDetailsTitle: "लेन-देन का विवरण",

    /*Table columns Kisan Detail Page*/
    balance: "कुल बक़ाया एडवांस (₹)",
    date: "दिनांक",
    comment: "एंट्री का विवरण",
    advanceDebited: "एडवांस लिया (₹)",
    grossTotalWithCurrency: "ट्रेडिंग टोटल (₹)",
    billTotal: "बिल टोटल (₹)",
    advanceCredited: "एडवांस चुकाया (₹)",
    cashPaid: "नगद भुगतान किया (₹)",
    carryForward: "बिल का बक़ाया भुगतान (₹)",
    actions: "कार्यवाही",
    editButtonText: "सुधारें",
    viewButtonText: "देखें",

    /*Debit Entry Form*/
    advanceDetails: "एडवांस का विवरण",
    amount: "एडवांस की राशि",
    createEntryButtonText: "एंट्री करें",
    amountSBGTZ: "एडवांस की राशि 0 से अधिक होनी चाहिये। ",
    advanceSCNBMTO: "यह राशि, कुल बक़ाया एडवांस से ज्यादा नहीं हो सकती है। अधिकतम मान्य राशि = ₹ ",

    /*Advance Deposit Form*/
    advanceDepositDetails: "एडवांस वापसी हेतु किसान द्वारा जमा की जाने वाली राशि का विवरण",
    advanceDepositAmount: "डिपॉज़िट राशि",
    balanceTextTillThisWithoutCurrency: "इस एंट्री के पहले कुल बक़ाया एडवांस",

    /*Credit Entry Form*/
    billDetails: "बिल का विवरण",
    tradingSectionTitle: "ट्रेडिंग का विवरण",
    carryForwardSectionTitle: "पिछले बक़ाये का विवरण",
    carryForwardTotal: "टोटल बक़ाया भुगतान",
    selectTradingType: "-- कमोडिटी का नाम  चुनें --",
    numberOfBags: "बोरों की संख्या (नग)",
    totalWeight: "कुल वजन (कि.ग्रा.में)",
    ratePerKg: "प्रति किलोग्राम भाव (₹)",
    grossTotal: "ट्रेडिंग टोटल (कमोडिटी का कुल मूल्य) : ₹ ",
    purchaserSectionTitle: "ख़रीददार का विवरण",
    purchaserName: "ख़रीददार का नाम",
    selectPurchaser: "-- ख़रीददार का नाम चुनें --",
    deductionsSectionTitle: "कटौती",
    commission: "कमीशन (% में) :",
    totalCommission: "कुल कमीशन : ",
    hammali: "हम्माली (₹) :",
    bhada: "भाड़ा (₹) :",
    netTotal: "बिल टोटल (कटौती के बाद) : ₹ ",
    amountToSettle: "समायोजित की जाने वाली राशि : ",
    settlementSectionTitle: "समायोजन",
    balanceTextWithoutCurrency: "कुल बक़ाया एडवांस",
    carryForwardAmountWithoutCurrency: "पिछले बिलों का कोई बक़ाया भुगतान",
    whatAreYouBuyingText: "कमोडिटी (सामग्री) का नाम :",
    Matar: "मटर",
    Tamatar: "टमाटर",
    Dhaniya: "धनिया",
    editCreditEntryButtonTitle: "एंट्री अपडेट करें",

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
      'एडवांस चुकाने की राशि, "कुल बक़ाया एडवांस" से अधिक नहीं हो सकती है। अधिकतम मान्य राशि = ₹',
    cashPaidCBMTCB:
      'नगद भुगतान की राशि "समायोजित की जाने वाली राशि" से अधिक नहीं हो सकती है। अधिकतम मान्य राशि = ₹ ',
    commentIsRequired: "एंट्री का विवरण देना अनिवार्य है। ",
    selectTradingAndPurchaserIsRequired: "यदि आप किसी कमोडिटी का चयन कर रहे हैं, तो ख़रीददार का चयन करना भी अनिवार्य है। ",
    selectingPurchaserIsRequired: "ख़रीददार का चयन करना अनिवार्य है। ",
    advanceSettlementAddedSuccessfully:"एडवांस वापसी की एंटी सफलतापूर्वक जोड़ी गयी।",
    advanceSettlementUpdatedSuccessfully:"एडवांस वापसी की एंटी सफलतापूर्वक सुधारी गयी।",

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
    purchaserLandingTitle: "ख़रीदार विवरणिका",
    addPurchaserButtonText: "ख़रीदार जोड़ें",
    newPurchaserDeatils: "नये ख़रीदार का ब्यौरा",

    /*Add Purchaser Form*/
    companyNameIsRequired: "कंपनी (फ़र्म) का नाम देना अनिवार्य है।",
    purchaser_addSuccessful: "ख़रीदार सफलतापूर्वक जोड़ा गया !",
    purchaser_editSuccessful : "Purchaser has been edited successfully",

    /*Purchase Table*/
    nameOfPurchase: "ख़रीदार का नाम",
    outstandingPayment: "कुल बक़ाया पेमेंट (₹)",
    outstandingPaymentADT: "एंट्री तक का बक़ाया (₹)",

    /*Purchaser Details*/
    purchaserDetailsPageTitle: "ख़रीदार का विवरण",
    purchaserPaymentEntryButtonText: "पेमेंट एंट्री",
    purchaseTotal: "ख़रीदी का टोटल (₹)",
    transactionType: "लेन देन का प्रकार",
    tt_purchase: "ख़रीद",
    tt_payment: "पेमेंट",
    purchaserPaymentFormTitle: "पेमेंट विवरण",
    paymentAmount: "पेमेंट की राशि",

    /*Dashboard Page*/
    totalAdvacePendingWithKisan:"किसानो का कुल बक़ाया एडवांस (₹)",
    totalPurchaserOutstanding:"ख़रीददारों की कुल बक़ाया पेमेंट्स (₹)",
    totalItemweight:"कुल वजन (कि.ग्रा.में)",
    totalBagsSoldToday:"आज बेचे गए कुल बोरों की संख्या (नग)",

  },
};
export default hi;
