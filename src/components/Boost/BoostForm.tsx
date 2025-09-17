"use client";

import { useTranslations } from "next-intl";
import React, { useState } from "react";
import Form from "../Form/Form";
import TextInputNumber from "../Form/TextInputNumber";
import { TextInput } from "../Form/TextInput";
import { MediaHeaderMini } from "../MediaHeaderMini/MediaHeaderMini";
import { DTOChannel, DTOItem } from "podverse-helpers";
import Tabs from "../Tabs/Tabs";
import styles from "../../styles/components/Boost/BoostForm.module.scss";
import Accordion from "../Accordian/Accordian";
import { BoostRecipientInfo } from "./BoostRecipientInfo";
import { config } from "../../config";
import { getAppValueRecipient } from "../../utils/value/appValue";
import { TextArea } from "../Form/TextArea";
import { Button } from "../Button/Button";

// Reusable mock recipients
const MOCK_RECIPIENTS = [
  {
    id: 9,
    type: "node",
    address: "03ae9f91a0cb8ff43840e3c322c4c61f019d8c1c3cea15a25cfc425ac605e61a4a",
    split: 53,
    name: "Value4Value",
    custom_key: null,
    custom_value: null,
    fee: false
  },
  {
    id: 10,
    type: "node",
    address: "02453e4e93322d60219808c00c2e6d1f1c673420e95b5511a33c40cfb4df5e9148",
    split: 5,
    name: "Dreb Scott (Chapter Architect)",
    custom_key: null,
    custom_value: null,
    fee: false
  },
  {
    id: 11,
    type: "node",
    address: "030a58b8653d32b99200a2334cfe913e51dc7d155aa0116c176657a4f1722677a3",
    split: 20,
    name: "Clip Custodian",
    custom_key: "696969",
    custom_value: "g96UfnRSUQlwKfzLEoB3",
    fee: false
  },
  {
    id: 12,
    type: "node",
    address: "035ad2c954e264004986da2d9499e1732e5175e1dcef2453c921c6cdcc3536e9d8",
    split: 5,
    name: "Sovereign Feeds",
    custom_key: null,
    custom_value: null,
    fee: false
  },
  {
    id: 13,
    type: "node",
    address: "03d55f4d4c870577e98ac56605a54c5ed20c8897e41197a068fd61bdb580efaa67",
    split: 1,
    name: "BoostBot",
    custom_key: "696969",
    custom_value: "gq0Z8b1wEftMkFL4vj7E",
    fee: false
  },
  {
    id: 14,
    type: "node",
    address: "030a58b8653d32b99200a2334cfe913e51dc7d155aa0116c176657a4f1722677a3",
    split: 5,
    name: "Geoff Smith - Various Original Songs",
    custom_key: "696969",
    custom_value: "mXbAWPOMXmz866ZUJv29",
    fee: false
  },
  {
    id: 15,
    type: "node",
    address: "03b6f613e88bd874177c28c6ad83b3baba43c4c656f56be1f8df84669556054b79",
    split: 1,
    name: "boostbot@fountain.fm",
    custom_key: "906608",
    custom_value: "01IMQkt4BFzAiSynxcQQqd",
    fee: false
  },
  {
    id: 16,
    type: "node",
    address: "021f548a8ab5eb8e7cf91e4c9777c388463e213485ece9a1808e3c6850084ee630",
    split: 5,
    name: "Bakfiets",
    custom_key: null,
    custom_value: null,
    fee: false
  },
  {
    id: 17,
    type: "node",
    address: "035df303dcc65edcf4965960be85c2f65b7910d253a7d6a52dd3768018a83f016a",
    split: 5,
    name: "Sir Bemrose",
    custom_key: null,
    custom_value: null,
    fee: false
  }
];

// Mock channel values using the shared recipients
const MOCK_CHANNEL_VALUES = [
  {
    id: 7,
    type: "lightning",
    method: "keysend",
    suggested: 5e-8,
    channel_value_recipients: MOCK_RECIPIENTS
  },
  {
    id: 7,
    type: "paypal",
    method: "send",
    suggested: 5e-8,
    channel_value_recipients: MOCK_RECIPIENTS
  },
  {
    id: 7,
    type: "patreon",
    method: "send",
    suggested: 5e-8,
    channel_value_recipients: MOCK_RECIPIENTS
  },
  {
    id: 7,
    type: "buymeacoffee",
    method: "send",
    suggested: 5e-8,
    channel_value_recipients: MOCK_RECIPIENTS
  }
];

type BoostFormProps = {
  channel: DTOChannel;
  item?: DTOItem;
  className?: string;
};

export const BoostForm: React.FC<BoostFormProps> = ({ className, channel, item }) => {
  const tValue = useTranslations("value");
  const tMisc = useTranslations("misc");
  const [selectedKey, setSelectedKey] = useState("");
  const [totalAmountToCreator, setTotalAmountToCreator] = useState<number>(1);
  const [totalAmountToApp, setTotalAmountToApp] = useState<number>(0);
  const [yourName, setYourName] = useState<string>("");
  const [message, setMessage] = useState<string>("");

  // Use mock data only if channel.channel_values is missing or empty
  const channelValues = channel.channel_values && channel.channel_values.length > 0
    ? MOCK_CHANNEL_VALUES
    : MOCK_CHANNEL_VALUES;
  
  React.useEffect(() => {
    if (channelValues.length > 0 && !selectedKey) {
      setSelectedKey(`${channelValues[0].type}_${channelValues[0].method}`);
    }
  }, [channelValues, selectedKey]);

  const selectedChannelValue = channelValues.find(
    (cv) => `${cv.type}_${cv.method}` === selectedKey
  );

  const channel_value_recipients = selectedChannelValue?.channel_value_recipients;
  const item_value_recipients = item?.item_values?.[0]?.item_value_recipients;

  if (!channel_value_recipients && !item_value_recipients) {
    return null;
  }

  const tabs = channelValues.map((cv) => ({
    key: `${cv.type}_${cv.method}`,
    label: tValue(`types.${cv.type}_${cv.method}.label`),
    onClick: () => setSelectedKey(`${cv.type}_${cv.method}`)
  }));

  const selectedValueKey = selectedChannelValue ? `${selectedChannelValue.type}_${selectedChannelValue.method}` : null;

  const appValueRecipient = selectedChannelValue ? getAppValueRecipient({
    type: selectedChannelValue.type,
    method: selectedChannelValue.method,
    final_amount: totalAmountToApp
  }) : null;

  return (
    <div>
      <MediaHeaderMini channel={channel} item={item} />
      <Tabs
        tabs={tabs}
        selectedKey={selectedKey}
      />
      <Form className={styles.form} onSubmit={(e) => { e.preventDefault(); }}>
        <div className={styles.boostAmountInputs}>
          <TextInputNumber
            eyebrow={tValue("send_to.creator")}
            value={totalAmountToCreator}
            min={0}
            onChange={e => setTotalAmountToCreator(Number(e.target.value))}
            sideText={tValue(`types.${selectedValueKey}.denomination`)}
          />
          <TextInputNumber
            eyebrow={tValue("send_to.app", { brand_name: config.public.brand.name })}
            value={totalAmountToApp}
            min={0}
            onChange={e => setTotalAmountToApp(Number(e.target.value))}
            sideText={tValue(`types.${selectedValueKey}.denomination`)}
          />
        </div>
        <TextInput
          eyebrow={tValue("your_name")}
          value={yourName}
          placeholder={tMisc("anonymous")}
          onChange={e => setYourName(e.target.value)}
        />
        <TextArea
          eyebrow={tValue("message")}
          value={message}
          placeholder={tMisc("optional")}
          onChange={e => setMessage(e.target.value)}
          maxLength={500}
        />
      </Form>
      <div className={styles.buttons}>
        <Button onClick={() => alert("Handle boost submit")}>
          {tMisc("submit")}
        </Button>
      </div>
      <div className={styles.moreInfo}>
        <Accordion
          header={tMisc("more_info")}
          content={
            <BoostRecipientInfo
              channel_value_recipients={channel_value_recipients}
              item_value_recipients={item_value_recipients}
              app_value_recipient={appValueRecipient}
              totalAmountToCreator={totalAmountToCreator}
              totalAmountToApp={totalAmountToApp}
            />
          }
        />
      </div>
    </div>
  );
};
