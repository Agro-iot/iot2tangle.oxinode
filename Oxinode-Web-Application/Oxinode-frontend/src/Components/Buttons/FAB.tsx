import React, { useCallback } from 'react';

type IProps = {
	onClick?(): void;
	color?: string;
	className?: string;
	id?: string;
	icon?: string;
};

const Fab: React.FC<IProps> = (
	props: IProps = {
		className: '',
		color: 'red',
	},
): React.ReactElement => {
	const { color, onClick, className, icon, id } = props;

	const handleClick = useCallback(() => {
		onClick?.();
	}, [onClick]);

	return (
		<a
			className={`btn-floating halfway-fab waves-effect waves-light ${color} fab-settings ${className}`}
			onClick={handleClick}
			id={id}
		>
			{icon ? <i className='material-icons'>{icon}</i> : null}
		</a>
	);
};

export default React.memo(Fab);
