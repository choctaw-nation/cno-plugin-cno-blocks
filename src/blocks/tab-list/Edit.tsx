/**
 * WordPress dependencies
 */
import {
	useBlockProps,
	useInnerBlocksProps,
	InspectorControls,
	store as blockEditorStore,
} from '@wordpress/block-editor';
import { PanelBody, ToggleControl } from '@wordpress/components';
import { useSelect } from '@wordpress/data';
import { useState, useEffect } from '@wordpress/element';

/**
 * Internal dependencies
 */
import AddTabToolbarControl from '../_shared/addTabToolbarControl';
import RemoveTabToolbarControl from '../_shared/removeTabToolbarControl';
import './editor.scss';

const TAB_LIST_TEMPLATE = [ [ 'cno/tab' ], [ 'cno/tab' ] ];

function Edit( { clientId, attributes, setAttributes } ) {
	const { allowOverflow } = attributes;
	const [ shouldOverflow, setShouldOverflow ] = useState( allowOverflow );
	const tabsClientId = useSelect(
		( select ) =>
			select( blockEditorStore ).getBlockRootClientId( clientId ),
		[ clientId ]
	);

	const flexWrapEnabled = attributes?.layout?.flexWrap !== 'nowrap';
	useEffect( () => {
		// If flex wrap is enabled, overflow should be disabled and the attribute updated accordingly.
		if ( flexWrapEnabled ) {
			setShouldOverflow( false );
			setAttributes( { allowOverflow: false } );
		} else {
			setAttributes( { allowOverflow: shouldOverflow } );
		}
	}, [ flexWrapEnabled, allowOverflow, setAttributes, shouldOverflow ] );

	const blockProps = useBlockProps( {
		className: allowOverflow ? 'allow-overflow' : undefined,
	} );

	const innerBlocksProps = useInnerBlocksProps( blockProps, {
		allowedBlocks: [ 'cno/tab' ],
		orientation: 'horizontal',
		template: TAB_LIST_TEMPLATE,
		templateLock: false,
		renderAppender: false,
	} );

	return (
		<>
			<InspectorControls>
				<PanelBody title="Tab List Settings">
					<ToggleControl
						__nextHasNoMarginBottom
						label="Allow Overflow"
						checked={ shouldOverflow }
						onChange={ ( value ) => {
							setShouldOverflow( value );
						} }
						disabled={ flexWrapEnabled }
						help={
							flexWrapEnabled
								? 'Overflow is disabled when flex wrap is enabled.'
								: 'Allow tabs to overflow (horizontally) when there are too many to fit in the available space.'
						}
					/>
				</PanelBody>
			</InspectorControls>
			<AddTabToolbarControl tabsClientId={ tabsClientId } />
			<RemoveTabToolbarControl tabsClientId={ tabsClientId } />
			<div { ...innerBlocksProps } />
		</>
	);
}

export default Edit;
