import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import { PanelBody, PanelRow, SelectControl } from '@wordpress/components';
import { useState, useEffect } from '@wordpress/element';

export default function Edit( { attributes, setAttributes } ) {
	const blockProps = useBlockProps();
	const [ options, setOptions ] = useState<
		{ label: string; value: number }[]
	>( [] );
	const { formTitle, formId } = attributes;

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
								} )
							}
						/>
					</PanelRow>
				</PanelBody>
			</InspectorControls>
			<div { ...blockProps }>{ formTitle } (Gravity Form)</div>
		</>
	);
}
