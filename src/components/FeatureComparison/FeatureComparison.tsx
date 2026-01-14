"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { FaCircleCheck } from "react-icons/fa6";
import styles from "../../styles/components/FeatureComparison/FeatureComparison.module.scss";

type Feature = {
  name: string;
  free: boolean;
  premium: boolean;
};

type FeatureComparisonProps = {
  features: Feature[];
};

export const FeatureComparison: React.FC<FeatureComparisonProps> = ({ features }) => {
  const t = useTranslations("membership");
  const tMisc = useTranslations("misc");
  
  return (
    <div className={styles.comparison}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th className={styles.featureHeader}>{t("feature")}</th>
            <th className={styles.tierHeader}>{t("free")}</th>
            <th className={styles.tierHeader}>{t("premium")}</th>
          </tr>
        </thead>
        <tbody>
          {features.map((feature, index) => (
            <tr key={index} className={styles.row}>
              <td className={styles.featureCell}>{feature.name}</td>
              <td className={styles.tierCell}>
                {feature.free && (
                  <FaCircleCheck className={styles.checkmark} aria-label={tMisc("available")} />
                )}
              </td>
              <td className={styles.tierCell}>
                {feature.premium && (
                  <FaCircleCheck className={styles.checkmark} aria-label={tMisc("available")} />
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
