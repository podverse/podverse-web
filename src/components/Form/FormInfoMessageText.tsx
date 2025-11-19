import React from "react";
import classNames from "classnames";
import styles from "../../styles/components/Form/FormInfoMessageText.module.scss";

type Props = {
	message: string;
	className?: string;
};

export const FormInfoMessageText: React.FC<Props> = ({ message, className }) => {
	return (
		<div className={classNames(styles.infoMessage, className)}>
			{message}
		</div>
	);
}
