import React, { useState, useEffect, useContext, useMemo } from 'react';
import {
	Flex,
	Table,
	Thead,
	Tbody,
	Tr,
	Th,
	Box,
	Input,
	InputGroup,
	InputLeftAddon,
	Divider,
	Button,
} from '@chakra-ui/react';

import { DataContext } from 'components/DataContext';
import ToggleButton from 'components/ToggleButton';

import { headers, seasons } from './constants';
import TableRow from './components/TableRow';

const Home = () => {
	const { state: data, dispatch } = useContext(DataContext);
	const [filters, setFilters] = useState([]);
	const [term, setTerm] = useState('');
	const [behavior, setBehavior] = useState('OR');

	const actions = useMemo(
		() => ({
			resetData: () => {
				dispatch({ type: 'RESET_DATA' });
			},
			toggleCollected: (value) => {
				dispatch({ type: 'TOGGLE_COLLECTED', value });
			},
			toggleSubmitted: (value) => {
				dispatch({ type: 'TOGGLE_SUBMITTED', value });
			},
		}),
		[dispatch]
	);

	const filter = useMemo(
		() => ({
			AND: () => {
				dispatch({ type: 'FILTER_AND', value: { filters, term } });
			},
			OR: () => {
				dispatch({ type: 'FILTER_OR', value: { filters, term } });
			},
		}),
		[filters, term, dispatch]
	);

	useEffect(() => {
		if (filters.length === 0 && term === '') {
			actions.resetData();
		} else {
			if (behavior === 'AND') {
				filter.AND();
			} else {
				filter.OR();
			}
		}
	}, [filters, behavior, term, actions, filter]);

	const filterSeason = ({ on, target: { innerText: season } }) => {
		if (Boolean(on)) {
			setFilters([season, ...filters]);
		} else {
			const idx = filters.indexOf(season);
			setFilters([...filters.slice(0, idx), ...filters.slice(idx + 1)]);
		}
	};

	const onCheckboxChange = (key, id) => {
		key === 'collected' && actions.toggleCollected(id);
		key === 'submitted' && actions.toggleSubmitted(id);
	};

	const changeBehavior = () => {
		if (behavior === 'OR') setBehavior('AND');
		else setBehavior('OR');
	};

	return (
		<Box>
			<Flex direction='column'>
				<Flex direction='row' pos='sticky' top={0} bg='white' zIndex={1000}>
					<InputGroup>
						<InputLeftAddon children='Search' />
						<Input type='text' onChange={(event) => setTerm(event.target.value.toLowerCase())} />
					</InputGroup>
				</Flex>
				<Flex direction='row' pos='sticky' top={10} bg='white' zIndex={1000}>
					<Button onClick={changeBehavior} m={2} size='sm' _focus={null}>
						{behavior}
					</Button>
					<Divider orientation='vertical' />
					<Divider orientation='vertical' />
					{seasons.map((season) => (
						<ToggleButton
							key={season}
							onClick={filterSeason}
							bg={{ off: '#EDF2F7', on: 'lightblue' }}
							m={2}
							size='sm'
							_focus={null}
						>
							{season}
						</ToggleButton>
					))}
				</Flex>
				<Table>
					<Thead pos='sticky' zIndex={1000}>
						<Tr>
							{headers.map((key) => (
								<Th pos='sticky' top={88} bg='lightblue' key={key}>
									{key}
								</Th>
							))}
						</Tr>
					</Thead>
					<Tbody>
						{data.map((item) =>
							item.show ? (
								<TableRow key={item.id} item={item} onCheckboxChange={onCheckboxChange} />
							) : null
						)}
					</Tbody>
				</Table>
			</Flex>
		</Box>
	);
};

export default Home;
