import React, { useReducer, createContext, useMemo } from 'react';

const data = require('constants/data');

const localStorageKey = 'stardew-helper';

export const DataContext = createContext(null);

export const TOGGLE_COLLECTED = 'TOGGLE_COLLECTED';
export const TOGGLE_SUBMITTED = 'TOGGLE_SUBMITTED';
export const SET_DATA = 'SET_DATA';
export const RESET_DATA = 'RESET_DATA';
export const FILTER_AND = 'FILTER_AND';
export const FILTER_OR = 'FILTER_OR';

const reducer = (state, action) => {
	let idx;
	console.log(action);
	switch (action.type) {
		case TOGGLE_COLLECTED:
			idx = state.findIndex(({ id }) => id === action.value);

			return [
				...state.slice(0, idx),
				{
					...state[idx],
					collected: !Boolean(state[idx].collected),
				},
				...state.slice(idx + 1),
			];

		case TOGGLE_SUBMITTED:
			idx = state.findIndex(({ id }) => id === action.value);

			return [
				...state.slice(0, idx),
				{
					...state[idx],
					colleted: true,
					submitted: !Boolean(state[idx].submitted),
				},
				...state.slice(idx + 1),
			];

		case SET_DATA:
			return action.value;

		case RESET_DATA:
			return getData();
		// const localData = localStorage.getItem('stardew-helper');
		// if (localData) {
		// 	return JSON.parse(localData).map((item) => ({ ...item, show: true }));
		// } else return data;

		case FILTER_AND: {
			const { filters, term } = action.value;

			return state.map((item) => {
				const matchedSeason = filters.reduce(
					(prev, curr) => item.seasons.includes(curr) && prev,
					true
				);

				if (term === '') return { ...item, show: matchedSeason };

				const matchedTerm = Object.keys(item).reduce((prev, curr) => {
					if (typeof item[curr] === 'string' && item[curr].toLowerCase().includes(term))
						return prev || true;

					if (typeof item[curr] === 'boolean') {
						if (term.endsWith(curr)) {
							if (term.startsWith('is:') && Boolean(item[curr]) === true) {
								return prev || true;
							}
							if (term.startsWith('not:') && Boolean(item[curr]) === false) {
								return prev || true;
							}
						}
					}

					if (typeof item[curr] === 'object') {
						for (const l of Object.keys(item[curr])) {
							if (item[curr][l].includes(term)) return prev || true;
						}
					}
					return prev || false;
				}, false);

				return {
					...item,
					show: matchedSeason && matchedTerm,
				};
			});
		}

		case FILTER_OR: {
			const { filters, term } = action.value;

			return state.map((item) => {
				for (const f of filters) {
					if (item.seasons.includes(f)) return { ...item, show: true };
					else if (filters.includes('any') && item.seasons.length === 0)
						return { ...item, show: true };
				}
				if (term !== '') {
					for (const k of Object.keys(item)) {
						if (typeof item[k] === 'string' && item[k].toLowerCase().includes(term))
							return { ...item, show: true };

						if (typeof item[k] === 'boolean') {
							if (term.endsWith(k)) {
								if (term.startsWith('is:') && Boolean(item[k]) === true) {
									return { ...item, show: true };
								}
								if (term.startsWith('not:') && Boolean(item[k]) === false) {
									return { ...item, show: true };
								}
							}
						}

						if (typeof item[k] === 'object') {
							for (const l of Object.keys(item[k])) {
								if (item[k][l].includes(term)) return { ...item, show: true };
							}
						}
					}
				}
				return {
					...item,
					show: false,
				};
			});
		}

		default:
			throw new Error();
	}
};

const storeData = (data) => {
	localStorage.setItem(localStorageKey, JSON.stringify(data));
};

const getData = () => {
	const localData = localStorage.getItem('stardew-helper');
	if (localData) {
		return JSON.parse(localData).map((item) => ({ ...item, show: true }));
	} else return data;
};

// eslint-disable-next-line import/no-anonymous-default-export
export default ({ children }) => {
	const persistChangesToLocalStorage = (...args) => {
		const res = reducer(...args);
		const [, { type }] = args;
		if (type === TOGGLE_SUBMITTED || type === TOGGLE_COLLECTED) storeData(res);
		return res;
	};

	const [state, dispatch] = useReducer(persistChangesToLocalStorage, getData());

	const contextValue = useMemo(() => ({ state, dispatch }), [state, dispatch]);

	return <DataContext.Provider value={contextValue}>{children}</DataContext.Provider>;
};
