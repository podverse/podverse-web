import { useTranslation } from "next-i18next";

type Props = {
  link: string;
  value?: string;
};

export const FundingLink = ({ link, value }: Props) => {
  const { t } = useTranslation();

  return (
    <>
      <h2>{t("Support")}</h2>
      <div className="funding-link">
        <a href={link} target="_blank">
          {value}
        </a>
      </div>
    </>
  );
};
