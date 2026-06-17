import {
	PanelBody,
	PanelRow,
	SelectControl,
	TextControl,
	ToggleControl,
} from '@wordpress/components';
export default function ModalControls( { attributes, setAttributes } ) {
	const {
		closeModalOnSubmit,
		closeModalOnSubmitDelay,
		resetFormOnClose,
		resetTimer,
	} = attributes;
	return (
		<PanelBody title="Modal Settings" initialOpen={ true }>
			<PanelRow>
				<ToggleControl
					label="Close Modal on Submit"
					checked={ closeModalOnSubmit }
					onChange={ ( value ) =>
						setAttributes( { closeModalOnSubmit: value } )
					}
				/>
			</PanelRow>
			{ closeModalOnSubmit && (
				<PanelRow>
					<TextControl
						label="Close Modal Delay"
						help="Time in seconds before the modal closes after form submission."
						value={ closeModalOnSubmitDelay }
						onChange={ ( value ) =>
							setAttributes( {
								closeModalOnSubmitDelay:
									parseInt( value, 10 ) || 0,
							} )
						}
						type="number"
						min={ 0 }
					/>
				</PanelRow>
			) }
			<PanelRow>
				<SelectControl
					__next40pxDefaultSize
					__nextHasNoMarginBottom
					options={ [
						{ label: 'Always', value: 'always' },
						{
							label: 'Only After Successful Submit',
							value: 'onlyAfterSuccessfulSubmit',
						},
						{ label: 'Never', value: 'never' },
					] }
					value={ resetFormOnClose }
					label="Reset Form on Close"
					onChange={ ( value ) =>
						setAttributes( { resetFormOnClose: value } )
					}
				/>
			</PanelRow>
			<PanelRow>
				<TextControl
					type="number"
					__next40pxDefaultSize
					__nextHasNoMarginBottom
					label="Reset Timer"
					help="Time in seconds"
					min={ 0 }
					value={ resetTimer }
					onChange={ ( value ) =>
						setAttributes( {
							resetTimer: parseInt( value, 10 ) || 0,
						} )
					}
				/>
			</PanelRow>
		</PanelBody>
	);
}
