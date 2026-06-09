import { PanelBody, SelectControl } from '@wordpress/components';

export default function FontFamilySelect( { attributes, setAttributes } ) {
	return (
		<PanelBody title="Font Settings" initialOpen={ true }>
			<SelectControl
				label="Font Family"
				value={ attributes.fontFamily || '' }
				onChange={ ( fontFamily ) => setAttributes( { fontFamily } ) }
				options={ [
					{ label: 'Headings', value: 'headings' },
					{ label: 'Body', value: 'body' },
				] }
			/>
		</PanelBody>
	);
}
