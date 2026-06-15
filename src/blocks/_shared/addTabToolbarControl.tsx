/**
 * WordPress dependencies
 */
import { createBlock } from '@wordpress/blocks';
import {
	BlockControls,
	store as blockEditorStore,
} from '@wordpress/block-editor';
import { ToolbarGroup, ToolbarButton } from '@wordpress/components';
import { useDispatch, useSelect } from '@wordpress/data';

/**
 * "Add tab" button in the block toolbar for the tabs block.
 * Inserts a new cno/tab-panel into the tab-panels and a new cno/tab
 * into the tab-list, keeping both in sync.
 *
 * @param {Object} props              Props object.
 * @param {string} props.tabsClientId The client ID of the parent tabs block.
 * @return {React.JSX.Element} The toolbar control element.
 */
export default function AddTabToolbarControl( { tabsClientId } ) {
	const { insertBlock } = useDispatch( blockEditorStore );

	const { tabPanelsClientId, tabsListClientId } = useSelect(
		( select ) => {
			if ( ! tabsClientId ) {
				return {
					tabPanelsClientId: null,
					tabsListClientId: null,
				};
			}
			const { getBlocks } = select( blockEditorStore );
			const innerBlocks = getBlocks( tabsClientId );
			const tabPanels = innerBlocks.find(
				( block ) => block.name === 'cno/tab-panels'
			);
			const tabList = innerBlocks.find(
				( block ) => block.name === 'cno/tab-list'
			);
			return {
				tabPanelsClientId: tabPanels?.clientId || null,
				tabsListClientId: tabList?.clientId || null,
			};
		},
		[ tabsClientId ]
	);

	const addTab = () => {
		if ( ! tabPanelsClientId ) {
			return;
		}

		const newTabPanelBlock = createBlock( 'cno/tab-panel', {
			label: 'Tab',
		} );
		insertBlock( newTabPanelBlock, undefined, tabPanelsClientId );

		// Insert a corresponding tab into the tab-list.
		if ( tabsListClientId ) {
			const newTabBlock = createBlock( 'cno/tab', {} );
			insertBlock( newTabBlock, undefined, tabsListClientId );
		}
	};

	return (
		<BlockControls group="other">
			<ToolbarGroup>
				<ToolbarButton
					className="components-toolbar__control"
					onClick={ addTab }
					text="Add tab"
				/>
			</ToolbarGroup>
		</BlockControls>
	);
}
