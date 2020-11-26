import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
const reactSwal = withReactContent(Swal);

const showAlert = () => {
	return reactSwal.mixin({
		icon: 'success',
		customClass: {
			title: 'white-text',
			content: 'white-text',
		},
		showConfirmButton: true,
		confirmButtonColor: '#2BBBAD',
		cancelButtonColor: 'red',
		showCancelButton: true,
	});
};

export default showAlert;
