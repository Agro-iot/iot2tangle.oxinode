import React, { FC, memo, useState } from 'react';
import Swal, { SweetAlertResult } from 'sweetalert2';
import { env } from '../../env';
import showAlert from '../../Utils/Alert';
import styles from './UserProfile.module.scss';
import withReactContent from 'sweetalert2-react-content';
import axios from 'axios';
import { Cloudinary } from 'cloudinary-core';
const reactSwal = withReactContent(Swal);

type IProps = {
	url: string | undefined;
};

const cl = new Cloudinary({
	cloud_name: 'pablitox26',
});

// const urlWithoutPhoto =
// 	'https://www.adl-logistica.org/wp-content/uploads/2019/07/imagen-perfil-sin-foto.png';

const PhotoProfile: FC<IProps> = (props) => {
	const { url } = props;
	const photoRef = React.useRef<null | HTMLInputElement>(null);
	const formRef = React.useRef<HTMLFormElement | null>(null);

	const newUrl = url
		? cl.image(url!).getAttribute('src')!
		: 'https://www.adl-logistica.org/wp-content/uploads/2019/07/imagen-perfil-sin-foto.png';
	const [imgUrl, setImgUrl] = useState(newUrl);

	const uploadPhoto = async () => {
		//
		const { value: photo }: SweetAlertResult = await reactSwal.fire({
			title: 'Subir una foto',
			html: (
				<form ref={formRef}>
					<div className='file-field input-field'>
						<div className='btn'>
							<span>Imagen</span>
							<input
								type='file'
								accept={'image/*'}
								name={'image'}
								ref={photoRef}
							/>
						</div>
						<div className='file-path-wrapper'>
							<input className='file-path validate' type={'text'} />
						</div>
					</div>
				</form>
			),
		});
		if (photo) {
			if (photoRef.current !== null) {
				if (photoRef.current!.files) {
					if (photoRef.current!.files!.length !== 1) {
						showAlert().fire({
							title: 'Hubo un error',
							icon: 'error',
							text: 'Escoja una imagen',
							showCancelButton: false,
						});
					} else {
						// upload
						const formData = new FormData(formRef.current!);
						formData.append('token', localStorage.getItem('token')!);
						const response = await axios.post(
							`${env.urlServer}/user/uploadPhoto`,
							formData,
						);
						if (response.data.error) {
							showAlert().fire({
								title: 'Hubo un error',
								icon: 'error',
								showCancelButton: false,
							});
						} else {
							//
							const newImage = cl
								.image(response.data.message)
								.getAttribute('src')!;
							setImgUrl(newImage);
						}
					}
				}
			}
		}
	};

	return (
		<div className={`p-absolute circle`}>
			<img src={imgUrl} className={'circle'} alt='' />
			<i
				className={`material-icons ${styles.iconEditImage}`}
				onClick={uploadPhoto}
			>
				edit
			</i>
		</div>
	);
};

export default memo(PhotoProfile);
