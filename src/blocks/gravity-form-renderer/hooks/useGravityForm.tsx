import { useState, useEffect } from '@wordpress/element';
import useRequiredAttributes from '@shared/hooks/useRequiredAttributes';

export default function useGravityForm( formId, attributes ) {
	const [ isLoadingValues, setIsLoadingValues ] = useState( false );
	const [ options, setOptions ] = useState<
		{ label: string; value: number }[]
	>( [] );
	const [ requiredFields, setRequiredFields ] = useState( [] );
	const [ preFillableFields, setPreFillableFields ] = useState( [] );
	const { errors } = useRequiredAttributes( {
		attributes,
		fields: requiredFields,
		lockName: 'gravity-form-renderer',
	} );

	useEffect( () => {
		// Fetch available Gravity Forms from the REST API
		fetch( '/wp-json/gf/v2/forms' )
			.then( ( response ) => response.json() )
			.then( ( data ) => {
				const options = Object.entries( data ).map(
					( [ , form ] ) => ( {
						label: form.title,
						value: +form.id,
					} )
				);
				setOptions( options );
			} )
			.catch( ( error ) => {
				// eslint-disable-next-line no-console
				console.error( 'Error fetching Gravity Forms:', error );
			} );
	}, [] );

	useEffect( () => {
		if ( ! formId ) {
			return;
		}
		setIsLoadingValues( true );
		fetch( `/wp-json/gf/v2/forms?include[]=${ formId }` )
			.then( ( response ) => response.json() )
			.then( ( data ) => {
				const { fields } = data[ formId ] || {};
				const preFillableFields = fields.filter(
					( field ) => field.allowsPrepopulate
				);
				setPreFillableFields( preFillableFields );
				const requiredFields = preFillableFields
					.map( ( field ) => ( {
						key: `preFill_${ field.id }`,
						getValue: ( attributes ) =>
							attributes.prefilledValues?.[
								`preFill_${ field.id }`
							],
						isRequired: field.isRequired,
						label: field.label,
					} ) )
					.filter( ( field ) => field.isRequired );
				setRequiredFields( requiredFields );
			} )
			.catch( ( error ) => {
				// eslint-disable-next-line no-console
				console.error( 'Error fetching Gravity Forms:', error );
			} )
			.finally( () => setIsLoadingValues( false ) );
	}, [ formId ] );
	return {
		isLoading: isLoadingValues,
		options,
		preFillableFields,
		errors,
	};
}
