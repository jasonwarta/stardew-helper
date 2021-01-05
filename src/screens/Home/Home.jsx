import React, { useState, useEffect } from 'react';
import {
	Flex,
	Table,
	Thead,
	Tbody,
	Tr,
	Th,
	Td,
	Box,
	Input,
	InputGroup,
	InputLeftAddon,
	Divider,
	Button,
} from '@chakra-ui/react';

import ToggleButton from 'components/ToggleButton';
const originalData = require('constants/data');

const Home = () => {
	const [data, setData] = useState(originalData);
	const [filters, setFilters] = useState([]);
	const [term, setTerm] = useState('');
	const [behavior, setBehavior] = useState('OR');
	const headers = ['seasons', 'item', 'room', 'bundle', 'details'];
	const seasons = ['spring', 'summer', 'fall', 'winter', 'any'];

	useEffect(() => {
		if (filters.length === 0 && term === '') {
			setData(originalData);
		} else {
			if (behavior === 'AND') {
				const filteredData = originalData.filter((item) => {
					const matchedSeason = filters.reduce(
						(prev, curr) => item.seasons.includes(curr) && prev,
						true
					);

					if (term === '') return matchedSeason;

					const matchedTerm = Object.keys(item).reduce((prev, curr) => {
						if (typeof item[curr] === 'string' && item[curr].toLowerCase().includes(term))
							return prev || true;
						if (typeof item[curr] === 'object') {
							for (const l of Object.keys(item[curr])) {
								if (item[curr][l].includes(term)) return prev || true;
							}
						}
						return prev || false;
					}, false);

					return matchedSeason && matchedTerm;
				});
				setData(filteredData);
			} else {
				const filteredData = originalData.filter((item) => {
					for (const f of filters) {
						if (item.seasons.includes(f)) return true;
						else if (filters.includes('any') && item.seasons.length === 0) return true;
					}
					if (term !== '') {
						for (const k of Object.keys(item)) {
							if (typeof item[k] === 'string' && item[k].toLowerCase().includes(term)) return true;
							if (typeof item[k] === 'object') {
								for (const l of Object.keys(item[k])) {
									if (item[k][l].includes(term)) return true;
								}
							}
						}
					}
					return false;
				});
				setData(filteredData);
			}
		}
	}, [filters, term, behavior]);

	const filterSeason = (event) => {
		const season = event.target.innerText;
		const on = event.on;
		console.log({ season, on });

		if (on) {
			if (filters.includes(season)) {
				// this shouldn't happen, so not handling it
				console.warn('unreachable state was reached');
			} else {
				setFilters([season, ...filters]);
			}
		} else {
			const idx = filters.indexOf(season);
			if (idx > -1) {
				const newFilters = [...filters];
				newFilters.splice(idx, 1);
				// const newFilters = filters.splice(idx, 1);
				console.log('buildFilter', newFilters);
				setFilters(newFilters);
			}
		}
	};

	const changeBehavior = () => {
		if (behavior === 'OR') setBehavior('AND');
		else setBehavior('OR');
	};

	return (
		<Box>
			<Flex direction='column'>
				<Flex direction='row'>
					<InputGroup>
						<InputLeftAddon children='Search' />
						<Input type='text' onChange={(event) => setTerm(event.target.value.toLowerCase())} />
					</InputGroup>
				</Flex>
				<Flex direction='row'>
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
					<Thead pos='sticky' bg='lightblue'>
						<Tr>
							{headers.map((key) => (
								<Th pos='sticky' top={0} bg='lightblue' key={key}>
									{key}
								</Th>
							))}
						</Tr>
					</Thead>
					<Tbody>
						{data.map((item, i) => (
							<Tr key={i}>
								{headers.map((key) => (
									<Td key={`${i}-${key}`}>
										{
											// handle the season key slightly differently
											key === 'seasons'
												? item[key].length === 0
													? ''
													: item[key].join(',')
												: item[key]
										}
									</Td>
								))}
							</Tr>
						))}
					</Tbody>
				</Table>
			</Flex>
		</Box>
	);
};

export default Home;
