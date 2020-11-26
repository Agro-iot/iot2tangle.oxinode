import React, { FC } from 'react';

const Spinner: FC = () => (
	<div id='background-spinner'>
		<div className='sk-chase'>
			<div className='sk-chase-dot' />
			<div className='sk-chase-dot' />
			<div className='sk-chase-dot' />
			<div className='sk-chase-dot' />
			<div className='sk-chase-dot' />
			<div className='sk-chase-dot' />
		</div>
	</div>
);

export default Spinner;
