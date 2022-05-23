import React from "react";
import { dateConverter } from "../../../Utility/utility";

const Kisanreceipt = React.forwardRef((props, ref) => {
  /* console.log("Props", props); */
  return (
    <div ref={ref} className="m-4">
        <h1 className="text-center mb-5 pt-4">|| महाराज वेजिटेबल कंपनी ||</h1>
        {props.data.type}
      <div className="receipt-font-size pt-5">
        मैं <b className="capitalize">{props.data.name}</b> वल्द श्री <b className="capitalize">{props.data.fatherName}</b>{" "}
        महाराज वेजिटेबल कंपनी श्री इंद्रेश दुबे जी से मटर के बीज के लिए{" "}
        <b>{Math.abs(props.data.transactionAmount)} </b>
        रुपए लेकर जा रहा हूँ
      </div>
      <div className="receipt-font-size mt-3">
        मैं वचन देता हूँ की मटर की जो भी उपज मेरे खेत में निकलेगी, वह पूरा
        महाराज वेजिटेबल कंपनी में ही बिकेगी, साथ ही मेरे द्वारा लिया हुआ पैसा भी
        उसी समय कटेगा |
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
