/**
 * WordPress dependencies
 */
import {
	useBlockProps,
	useInnerBlocksProps,
	store as blockEditorStore,
} from '@wordpress/block-editor';
import { useSelect } from '@wordpress/data';

/**
 * Internal dependencies
 */
import AddTabToolbarControl from '../tab-panel/add-tab-toolbar-control';
import RemoveTabToolbarControl from '../tab-panel/remove-tab-toolbar-control';
import './editor.scss';

const TAB_LIST_TEMPLATE = [ [ 'cno/tab' ], [ 'cno/tab' ] ];

function Edit( { clientId } ) {
	const tabsClientId = useSelect(
		( select ) =>
			select( blockEditorStore ).getBlockRootClientId( clientId ),
		[ clientId ]
	);

	const blockProps = useBlockProps();

	const innerBlocksProps = useInnerBlocksProps( blockProps, {
		allowedBlocks: [ 'cno/tab' ],
		orientation: 'horizontal',
		template: TAB_LIST_TEMPLATE,
		templateLock: false,
		renderAppender: false,
	} );

	return (
		<>
			<AddTabToolbarControl tabsClientId={ tabsClientId } />
			<RemoveTabToolbarControl tabsClientId={ tabsClientId } />
			<div { ...innerBlocksProps } />
		</>
	);
}

export default Edit;
