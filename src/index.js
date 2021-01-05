import React from 'react';
import ReactDOM from 'react-dom';

import { ChakraProvider } from '@chakra-ui/react';

import Home from 'screens/Home';
import DataContext from 'components/DataContext';
import reportWebVitals from './reportWebVitals';

const data = require('constants/data.json');
window.reshape = () => {
	const newData = {};
	data.forEach(({ id, ...rest }) => {
		newData[id] = rest;
	});

	console.log(JSON.stringify(newData));
};

ReactDOM.render(
	<React.StrictMode>
		<ChakraProvider>
			<DataContext>
				<Home />
			</DataContext>
		</ChakraProvider>
	</React.StrictMode>,
	document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
