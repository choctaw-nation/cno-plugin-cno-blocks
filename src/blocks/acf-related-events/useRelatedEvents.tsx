import apiFetch from '@wordpress/api-fetch';
import { useState, useEffect } from '@wordpress/element';
import { useSelect } from '@wordpress/data';
import { store as editorStore } from '@wordpress/editor';

type EventsData = {
	id: number;
	title: string;
	isVirtual: boolean;
	startDate: string;
	permalink: string;
};
export default function useRelatedEvents() {
	const postId = useSelect( ( select ) => {
		return select( editorStore ).getCurrentPostId();
	}, [] );
	const [ isLoading, setIsLoading ] = useState( true );
	const [ events, setEvents ] = useState< EventsData[] >( [] );
	useEffect( () => {
		apiFetch< EventsData[] >( {
			path: `/cno-acf/v1/services/${ postId }/events`,
		} )
			.then( ( data ) => {
				setEvents( data );
			} )
			.catch( ( error ) => {
				// eslint-disable-next-line no-console
				console.error( 'Error fetching events:', error );
			} )
			.finally( () => {
				setIsLoading( false );
			} );
	}, [ postId ] );
	return {
		events,
		isLoading,
	};
}
