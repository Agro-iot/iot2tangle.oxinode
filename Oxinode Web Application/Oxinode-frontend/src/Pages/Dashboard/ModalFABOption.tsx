import styled from '@emotion/styled';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { FC, memo } from 'react';

type IProps = {
	handleClick?(e: any): void;
	icon: IconProp;
	label: string;
};

const RowDiv = styled.div`
	padding-top: 0.5rem;
	padding-bottom: 0.5rem;
	padding-left: 0.5rem;
	&:hover {
		background-color: #999999;
	}
`;

const ModalFabOption: FC<IProps> = (props) => {
	const { handleClick, icon, label } = props;

	return (
		<RowDiv
			className='w-100 d-flex align-items-center cursor-pointer hoverable'
			onClick={handleClick}
		>
			<FontAwesomeIcon icon={icon} pull={'left'} />
			<span style={{ float: 'left' }}>{label}</span>
		</RowDiv>
	);
};

export default memo(ModalFabOption);
