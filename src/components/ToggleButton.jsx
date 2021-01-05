import React, { useState } from 'react';
import { Button } from '@chakra-ui/react';

/**
 * returns custom field "on" in event object
 */
const ToggleButton = ({ children, bg, onClick, initial, ...rest }) => {
	const [toggle, setToggle] = useState(initial ? initial : false);

	function handleClick(event, tog) {
		setToggle(!toggle);
		onClick({
			on: !tog,
			...event,
		});
	}

	return (
		<Button onClick={(e) => handleClick(e, toggle)} bg={toggle ? bg.on : bg.off} {...rest}>
			{children}
		</Button>
	);
};

export default ToggleButton;
