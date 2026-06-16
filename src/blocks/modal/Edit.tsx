import {
	InnerBlocks,
	useBlockProps,
	InspectorControls,
	store as blockEditorStore,
} from '@wordpress/block-editor';
import { PanelBody, PanelRow, Tip } from '@wordpress/components';
import { Fragment } from '@wordpress/element';
import { useSelect } from '@wordpress/data';

export default function Edit( { clientId } ) {
	const isActive = useSelect(
		( select ) => {
			const { isBlockSelected, hasSelectedInnerBlock } =
				select( blockEditorStore );

			return (
				isBlockSelected( clientId ) ||
				hasSelectedInnerBlock( clientId, true )
			);
		},
		[ clientId ]
	);
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
				<PanelBody title="Modal Settings" initialOpen={ true }>
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
						margin: 0,
					} }
				>
					Modal { isActive && 'Contents' }
				</h3>
				{ isActive && <InnerBlocks /> }
			</div>
		</Fragment>
	);
}
