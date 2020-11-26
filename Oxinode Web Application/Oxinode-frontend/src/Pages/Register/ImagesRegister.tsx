import React from 'react';

type IProps = {
	src: any;
	alt?: string;
	className?: string;
};

const ImagesRegister: React.FC<IProps> = (
	props = {
		className: '',
	} as IProps,
) => {
	const { className, alt, src } = props;
	return (
		<div className={className}>
			<img src={require('../../assets/img/' + src)} alt={alt} />
		</div>
	);
};

export default React.memo(ImagesRegister);
