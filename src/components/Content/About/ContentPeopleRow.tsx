import { useTranslations } from "next-intl";
import { DTOChannelPerson, DTOItemPerson } from "podverse-helpers";
import styles from "../../../styles/components/Content/About/ContentPeopleRow.module.scss";
import { Link } from "../../Link/Link";

type ContentPeopleRowProps = {
  channel_person?: DTOChannelPerson;
  item_person?: DTOItemPerson;
}

export const ContentPeopleRow = ({ channel_person, item_person }: ContentPeopleRowProps) => {
  if (!channel_person && !item_person) {
    return null;
  }

  const tInfo = useTranslations("info");
  const person = item_person ? item_person : channel_person

  return (
    <div className={styles.row}>
      <Link
        className={styles.link}
        href={person!.href || '#'}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={tInfo("people.link_to_persons_webpage")}
        title={tInfo("people.link_to_persons_webpage")}
        color="secondary">
        {
          person!.img && (
            <img
              className={styles.personImage}
              src={person!.img}
              alt={person!.name || tInfo("people.person_image")}
            />
          )
        }
        <div className={styles.textWrapper}>
          {
            person!.name && (
              <div className={styles.name}>
                {person!.name}
              </div>
            )
          }
          {
            person!.role && (
              <div className={styles.role}>
                {person!.role}
              </div>
            )
          }
        </div>
      </Link>
    </div>
  )
}
