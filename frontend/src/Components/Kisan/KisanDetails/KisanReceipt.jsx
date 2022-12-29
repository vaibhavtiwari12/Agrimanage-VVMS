import React from "react";
import { dateConverter } from "../../../Utility/utility";

const Kisanreceipt = React.forwardRef((props, ref) => {
  /* console.log("Props", props); */
  return (
    <div ref={ref} className="m-4">
        <h1 className="text-center mb-5 pt-4">|| महाराज वेजिटेबल कंपनी ||</h1>
      <div className="receipt-font-size pt-5">
        मैं, <u>{" "}<b className="capitalize">{props.data.name} {" "}</b></u> वल्द श्री<u> {" "} <b className="capitalize">{" "}{props.data.fatherName}</b></u>{" "} पता <u>{" "}<b className="capitalize">{props.data.address}</b>
        {" "}</u>,आज दिनांक {dateConverter(new Date())} को महाराज वेजिटेबल कंपनी के मालिक (प्रोप्राइटर) <b>श्री इंद्रेश दुबे </b> जी से मटर/टमाटर/अन्य उपज की खेती से संबंधित कार्यों (बीज/खाद/उर्वरक) के लिए {" "}
        एडवांस राशि ₹.<b>{Math.abs(props.data.transactionAmount)} </b> (शब्दों में)<u>_____________________________________________</u> लेकर जा रहा हूँ ।
      </div>
      <div className="receipt-font-size mt-3">
        मैं यह वचन देता हूँ की मटर/टमाटर/अन्य उपज की जो भी उपज मेरे खेत में निकलेगी, वह पूरा
        महाराज वेजिटेबल कंपनी में ही बिकेगी, साथ ही मेरे द्वारा लिया हुआ पैसा भी
        उसी समय कटेगा ।  
      </div>
      <div className="mt-4 d-flex receipt-font-size">
        <div>
          <div>
            <b>दिनांक:</b> {dateConverter(new Date())}
          </div>
          <div>
            <b>फ़ोन:</b> {props.data.phone}
          </div>
          <div>
            <b>पता:</b> {props.data.address}
          </div>
        </div>
        <div className="align-items-end d-flex flex-fill justify-content-end">
            <b>नाम एवं हस्ताक्षर </b>
        </div>
      </div>
    </div>
  );
});

export default Kisanreceipt;
