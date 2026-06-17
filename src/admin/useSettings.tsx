import apiFetch from '@wordpress/api-fetch';
import { useEffect, useState } from '@wordpress/element';
import { Settings } from './types';

export default function useSettings() {
	const [ settings, setSettings ] = useState< Settings >();
	const [ isLoading, setIsLoading ] = useState( true );
	const [ isSaving, setIsSaving ] = useState( false );
	const [ notice, setNotice ] = useState< {
		message: string;
		status: 'success' | 'error';
	} | null >( null );

	// Configure apiFetch nonce once on mount
	useEffect( () => {
		apiFetch.use(
			apiFetch.createNonceMiddleware(
				window.cnoSiteBlocksAdminData.nonce
			)
		);
	}, [] );

	// Load saved settings from REST API on mount
	useEffect( () => {
		apiFetch( {
			path: `${ window.cnoSiteBlocksAdminData.restRoot }settings`,
		} )
			.then( ( data ) => {
				setSettings( data );
			} )
			.catch( () => {
				setNotice( {
					message:
						'Failed to load settings. Please refresh the page.',
					status: 'error',
				} );
			} )
			.finally( () => {
				setIsLoading( false );
			} );
	}, [] );

	async function handleSubmit( e: React.FormEvent ) {
		e.preventDefault();
		setIsSaving( true );
		setNotice( null );

		try {
			await apiFetch( {
				path: `${ window.cnoSiteBlocksAdminData.restRoot }settings`,
				method: 'POST',
				data: settings,
			} );
			setNotice( {
				message: 'Settings saved successfully.',
				status: 'success',
			} );
		} catch {
			setNotice( {
				message: 'Failed to save settings. Please try again.',
				status: 'error',
			} );
		} finally {
			setIsSaving( false );
		}
	}

	return {
		settings,
		isLoading,
		isSaving,
		notice,
		setSettings,
		handleSubmit,
		setNotice,
	};
}
