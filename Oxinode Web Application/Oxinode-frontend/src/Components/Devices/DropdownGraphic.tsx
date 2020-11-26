import { faEllipsisV } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { FC, Fragment, memo } from 'react';
import { Button, Dropdown, Icon } from 'react-materialize';
import styles from '../../Pages/Dashboard/Dashboard.module.scss';

type IProps = {
	idTrigger: string;
	handleRemove?(e: any): void;
	handleEdit?(e: any): void;
};

const DropdownGraphic: FC<IProps> = (props) => {
	const { idTrigger, handleEdit, handleRemove } = props;

	return (
		<Fragment>
			<Dropdown
				trigger={
					<Button className={`p-absolute ${styles.iconOptions}`}>
						<FontAwesomeIcon icon={faEllipsisV} />
					</Button>
				}
				id={idTrigger}
				options={{ constrainWidth: false }}
			>
				<span className={'black-text'} onClick={handleEdit}>
					<Icon left>settings</Icon> Ajustes
				</span>
				<span className='black-text' onClick={handleRemove}>
					<Icon left>delete</Icon> Eliminar
				</span>
			</Dropdown>
		</Fragment>
	);
};

export default memo(DropdownGraphic);
