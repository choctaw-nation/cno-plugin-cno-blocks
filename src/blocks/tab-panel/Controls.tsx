/**
 * WordPress dependencies
 */
import {
	InspectorControls,
	store as blockEditorStore,
} from '@wordpress/block-editor';
/* eslint-disable @wordpress/no-unsafe-wp-apis */
import {
	CheckboxControl,
	__experimentalToolsPanel as ToolsPanel,
	__experimentalToolsPanelItem as ToolsPanelItem,
} from '@wordpress/components';
/* eslint-enable @wordpress/no-unsafe-wp-apis */
import { useDispatch } from '@wordpress/data';

/**
 * Internal dependencies
 */
import AddTabToolbarControl from '@shared/addTabToolbarControl';
import RemoveTabToolbarControl from '@shared/removeTabToolbarControl';
import { useToolsPanelDropdownMenuProps } from '@shared/hooks/useToolsPanelDropdownMenuProps';

export default function Controls( { tabsClientId, blockIndex, isDefaultTab } ) {
	const { updateBlockAttributes } = useDispatch( blockEditorStore );
	const dropdownMenuProps = useToolsPanelDropdownMenuProps();

	return (
		<>
			<AddTabToolbarControl tabsClientId={ tabsClientId } />
			<RemoveTabToolbarControl tabsClientId={ tabsClientId } />
			<InspectorControls>
				<ToolsPanel
					label="Settings"
					resetAll={ () => {
						updateBlockAttributes( tabsClientId, {
							activeTabIndex: 0,
						} );
					} }
					dropdownMenuProps={ dropdownMenuProps }
				>
					<ToolsPanelItem
						label="Default tab"
						hasValue={ () => isDefaultTab && blockIndex !== 0 }
						onDeselect={ () => {
							updateBlockAttributes( tabsClientId, {
								activeTabIndex: 0,
							} );
						} }
						isShownByDefault
					>
						<CheckboxControl
							__nextHasNoMarginBottom
							label="Default tab"
							checked={ isDefaultTab }
							onChange={ ( value ) => {
								updateBlockAttributes( tabsClientId, {
									activeTabIndex: value ? blockIndex : 0,
								} );
							} }
						/>
					</ToolsPanelItem>
				</ToolsPanel>
			</InspectorControls>
		</>
	);
}
