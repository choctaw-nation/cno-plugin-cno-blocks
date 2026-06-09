import {
	InnerBlocks,
	useBlockProps,
	InspectorControls,
} from '@wordpress/block-editor';
import { PanelBody, PanelRow, Tip, ToggleControl } from '@wordpress/components';
import { Fragment } from '@wordpress/element';

export default function Edit( { attributes, setAttributes } ) {
	const { showInternals } = attributes;
	const blockProps = useBlockProps( {
		style: {
			border: '1px dashed #333333',
			padding: '1rem',
			backgroundColor: 'rgba(51, 51, 51, 0.25)',
		},
	} );

	return (
		<Fragment>
			<InspectorControls>
				<PanelBody title="Meta Settings" initialOpen={ true }>
					<PanelRow>
						<ToggleControl
							__nextHasNoMarginBottom
							label="Show Internals"
							checked={ showInternals }
							onChange={ ( value ) =>
								setAttributes( { showInternals: value } )
							}
							help="Toggle the visibility of the modal's Inner Blocks in the editor."
						/>
					</PanelRow>
					<PanelRow>
						<Tip>
							Modal settings like closing on backdrop click and
							allowing body scroll while open are set via the
							calling Modal Trigger block.
						</Tip>
					</PanelRow>
				</PanelBody>
			</InspectorControls>
			<div { ...blockProps }>
				<h3
					style={ {
						fontSize: 'var(--wp--preset--font-size--sm)',
						fontFamily: 'var(--wp--preset--font-family--body)',
						color: '#333',
					} }
				>
					Modal Contents
				</h3>
				{ showInternals && <InnerBlocks /> }
			</div>
		</Fragment>
	);
}
