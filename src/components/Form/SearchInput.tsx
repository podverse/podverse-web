import React, { useState, useRef, useEffect, useCallback } from 'react';
import { TextInput } from './TextInput';
import { FaMagnifyingGlass } from 'react-icons/fa6';
import styles from '../../styles/components/Form/SearchInput.module.scss';
import { useSkipInitialEffect } from '../../hooks/useSkipInitialEffect';

type SearchInputProps = {
	onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
	onSearch: (value: string) => void;
	placeholder?: string;
	disabled?: boolean;
	readOnly?: boolean;
	className?: string;
	style?: React.CSSProperties;
	id?: string;
	name?: string;
	autoFocus?: boolean;
	tabIndex?: number;
	'aria-label'?: string;
	'aria-describedby'?: string;
};

export const SearchInput: React.FC<SearchInputProps> = ({
	onChange,
	onSearch,
	placeholder,
	disabled = false,
	readOnly = false,
	className,
	style,
	id,
	name,
	autoFocus,
	tabIndex,
	'aria-label': ariaLabel,
	'aria-describedby': ariaDescribedBy,
}) => {
	const [inputValue, setInputValue] = useState('');
	const debounceTimeout = useRef<NodeJS.Timeout | null>(null);

	useSkipInitialEffect(() => {
		if (debounceTimeout.current) {
			clearTimeout(debounceTimeout.current);
		}
		debounceTimeout.current = setTimeout(() => {
			onSearch(inputValue);
		}, 1000);
		return () => {
			if (debounceTimeout.current) {
				clearTimeout(debounceTimeout.current);
			}
		};
	}, [inputValue]);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setInputValue(e.target.value);
		if (onChange) onChange(e);
	};

	const handleButtonClick = useCallback(() => {
		if (debounceTimeout.current) {
			clearTimeout(debounceTimeout.current);
		}
		onSearch(inputValue);
	}, [inputValue]);

	return (
		<TextInput
			value={inputValue}
			onChange={handleChange}
			placeholder={placeholder}
			disabled={disabled}
			readOnly={readOnly}
			className={className}
			style={style}
			id={id}
			name={name}
			autoFocus={autoFocus}
			tabIndex={tabIndex}
			aria-label={ariaLabel}
			aria-describedby={ariaDescribedBy}
			buttonIcon={{
        className: styles.searchIcon,
				icon: <FaMagnifyingGlass />,
				onClick: handleButtonClick,
			}}
			type="text"
		/>
	);
};
