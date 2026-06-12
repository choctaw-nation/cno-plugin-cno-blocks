import apiFetch from '@wordpress/api-fetch';
import { useState, useEffect } from '@wordpress/element';
import { useSelect } from '@wordpress/data';
import { store as editorStore } from '@wordpress/editor';

type LocationsData = {
	id: number;
	title: string;
	address: string;
	directionsLink: string;
	image: string | null;
	phoneNumber: string;
};
export default function useServiceLocations() {
	const postId = useSelect( ( select ) => {
		return select( editorStore ).getCurrentPostId();
	}, [] );
	const [ isLoading, setIsLoading ] = useState( true );
	const [ locations, setLocations ] = useState< LocationsData[] >( [] );
	useEffect( () => {
		apiFetch< LocationsData[] >( {
			path: `/cno-acf/v1/services/${ postId }/locations`,
		} )
			.then( ( data ) => {
				setLocations( data );
			} )
			.catch( ( error ) => {
				// eslint-disable-next-line no-console
				console.error( 'Error fetching locations:', error );
			} )
			.finally( () => {
				setIsLoading( false );
			} );
	}, [ postId ] );
	return {
		locations,
		isLoading,
	};
}
