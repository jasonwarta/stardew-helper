import React from 'react';
import { Tr, Td, Checkbox, Center } from '@chakra-ui/react';

import { headers } from '../constants';

const TableRow = ({ item, onCheckboxChange }) => (
	<Tr>
		{headers.map((key) => {
			if (key === 'seasons') return <Td key={`${item.id}-${key}`}>{item[key].join(',')}</Td>;
			else if (key === 'collected' || key === 'submitted')
				return (
					<Td key={`${item.id}-${key}`}>
						<Center>
							<Checkbox
								isChecked={Boolean(item[key])}
								onChange={() => onCheckboxChange(key, item.id)}
								_focus={null}
							/>
						</Center>
					</Td>
				);
			else return <Td key={`${item.id}-${key}`}>{item[key]}</Td>;
		})}
	</Tr>
);

export default TableRow;
