import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import {
	PanelBody,
	PanelRow,
	SelectControl,
	TextControl,
	Notice,
} from '@wordpress/components';

import useGravityForm from './hooks/useGravityForm';

export default function Edit( { attributes, setAttributes } ) {
	const blockProps = useBlockProps();
	const { formTitle, formId } = attributes;
	const { isLoading, options, preFillableFields, errors } = useGravityForm(
		formId,
		attributes
	);

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
				{ ! isLoading && preFillableFields.length > 0 && (
					<PanelBody
						title="Gravity Form Pre-Filled Values"
						initialOpen={ true }
					>
						{ errors.length > 0 && (
							<Notice status="error" isDismissible={ false }>
								{ errors[ 0 ] }
							</Notice>
						) }
						<p>
							Fields that are marked as “pre-fillable” can be
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
			<div { ...blockProps }>
				{ formTitle } (Gravity Form)
				{ errors.length > 0 && (
					<Notice status="error" isDismissible={ false }>
						{ errors[ 0 ] }
					</Notice>
				) }
			</div>
		</>
	);
}
