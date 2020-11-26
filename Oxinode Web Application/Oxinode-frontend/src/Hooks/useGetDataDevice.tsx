import React, { useEffect, useState } from 'react';
import { SocketsContext } from './SocketsProvider';

const useGetDataDevice = (DeviceName: string): Array<string> => {
	const [state, setState] = useState<string>('');
	const io = React.useContext(SocketsContext);

	useEffect(() => {
		const ioListener = (data: string) => {
			setState(data);
		};
		io.addEventListener(DeviceName, ioListener);
		return () => {
			io.removeListener(DeviceName, ioListener);
		};
	}, [DeviceName, io]);

	return [state];
};

export default useGetDataDevice;
