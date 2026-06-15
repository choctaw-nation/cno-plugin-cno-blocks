import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import {
	PanelBody,
	PanelRow,
	SelectControl,
	TextControl,
} from '@wordpress/components';
import { useState, useEffect } from '@wordpress/element';

export default function Edit( { attributes, setAttributes } ) {
	const blockProps = useBlockProps();
	const [ isLoadingValues, setIsLoadingValues ] = useState( false );
	const [ options, setOptions ] = useState<
		{ label: string; value: number }[]
	>( [] );
	const { formTitle, formId } = attributes;
	const [ preFillableFields, setPreFillableFields ] = useState( [] );

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
			} )
			.catch( ( error ) => {
				// eslint-disable-next-line no-console
				console.error( 'Error fetching Gravity Forms:', error );
			} )
			.finally( () => setIsLoadingValues( false ) );
	}, [ formId ] );
	console.log( attributes.preFilledValues );
	return (
		<>
			<InspectorControls>
				<PanelBody title="Gravity Form Settings" initialOpen={ true }>
					<PanelRow>
						<SelectControl
							__next40pxDefaultSize
							__nextHasNoMarginBottom
							label="Gravity Form"
							options={ options }
							value={ formId }
							onChange={ ( value ) =>
								setAttributes( {
									formId: parseInt( value, 10 ),
									formTitle:
										options.find(
											( option ) =>
												option.value ===
												parseInt( value, 10 )
										)?.label || '',
									prefilledValues: {},
								} )
							}
						/>
					</PanelRow>
				</PanelBody>
				{ ! isLoadingValues && preFillableFields.length > 0 && (
					<PanelBody
						title="Gravity Form Pre-Filled Values"
						initialOpen={ true }
					>
						<p>
							Fields that are marked as "pre-fillable" can be
							automatically populated with values.
						</p>
						{ preFillableFields.map( ( field ) => (
							<div
								style={ {
									flex: '1 1 100%',
									marginBottom: '1rem',
								} }
								key={ field.id }
							>
								<TextControl
									__next40pxDefaultSize
									__nextHasNoMarginBottom
									label={ `${ field.label } ${
										field.isRequired ? '(Required)' : ''
									}` }
									type={ field.type }
									value={
										attributes.prefilledValues[
											`preFill_${ field.id }`
										] || ''
									}
									onChange={ ( value ) =>
										setAttributes( {
											prefilledValues: {
												...attributes.prefilledValues,
												[ `preFill_${ field.id }` ]:
													value,
											},
										} )
									}
								/>
							</div>
						) ) }
					</PanelBody>
				) }
			</InspectorControls>
			<div { ...blockProps }>{ formTitle } (Gravity Form)</div>
		</>
	);
}
