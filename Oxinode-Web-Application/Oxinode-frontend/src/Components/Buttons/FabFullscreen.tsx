import styled from '@emotion/styled';
import React, { FC, memo } from 'react';

type IProps = {
	handleClick?(e: any): void;
	id?: string;
};

const IconLarge = styled.i`
	font-size: 2.5rem !important;
`;

const Component: FC<IProps> = (props) => {
	const { handleClick, id } = props;
	return (
		<div className='fixed-action-btn' id={id}>
			<a
				className='btn-floating btn-large'
				onClick={handleClick}
				style={{ backgroundColor: '#0084FF' }}
			>
				<IconLarge className='large material-icons'>add</IconLarge>
			</a>
		</div>
	);
};

const FabFullscreen = styled(Component)``;

export default memo(FabFullscreen);
