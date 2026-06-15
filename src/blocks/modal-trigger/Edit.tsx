import {
	useBlockProps,
	InspectorControls,
	RichText,
} from '@wordpress/block-editor';
import {
	PanelBody,
	TextControl,
	SelectControl,
	ToggleControl,
} from '@wordpress/components';
import { Fragment } from '@wordpress/element';

export default function Edit( { attributes, setAttributes } ) {
	const {
		buttonText,
		closeWithBackdropClick,
		allowBodyScrollWhileOpen,
		modalTitle,
		source,
	} = attributes;

	const blockProps = useBlockProps();

	return (
		<Fragment>
			<InspectorControls>
				<PanelBody title="Modal Content">
					<TextControl
						__next40pxDefaultSize
						__nextHasNoMarginBottom
						label="Modal Title"
						value={ modalTitle }
						onChange={ ( modalTitle ) =>
							setAttributes( { modalTitle } )
						}
					/>
					<SelectControl
						__next40pxDefaultSize
						__nextHasNoMarginBottom
						label="Modal Content Source"
						value={ source }
						options={ [
							{
								label: 'CNHSA Guidelines',
								value: 'cnhsa-guidelines',
							},
							{ label: 'Inner Blocks', value: 'innerblocks' },
						] }
						onChange={ ( source ) => setAttributes( { source } ) }
					/>
				</PanelBody>
			</InspectorControls>
			<InspectorControls group="advanced">
				<ToggleControl
					__nextHasNoMarginBottom
					label="Close Modal on Backdrop Click"
					checked={ closeWithBackdropClick }
					onChange={ ( value ) =>
						setAttributes( { closeWithBackdropClick: value } )
					}
					help="Allow users to close a modal by clicking on the backdrop."
				/>
				<ToggleControl
					__nextHasNoMarginBottom
					label="Allow Body Scroll While Modal is Open"
					checked={ allowBodyScrollWhileOpen }
					onChange={ ( value ) =>
						setAttributes( { allowBodyScrollWhileOpen: value } )
					}
					help="Allow users to scroll the body content while the modal is open."
				/>
			</InspectorControls>
			<RichText
				{ ...blockProps }
				allowedFormats={ [
					'core/bold',
					'core/italic',
					'core/underline',
				] }
				value={ buttonText }
				onChange={ ( buttonText: string ) =>
					setAttributes( { buttonText } )
				}
				tagName="span"
				role="button"
				type="button"
				placeholder="More Info"
			/>
		</Fragment>
	);
}
