/**
 * WordPress dependencies
 */
import { BlockControls } from '@wordpress/block-editor';

/**
 * Internal dependencies
 */
import AddTabToolbarControl from '../_shared/addTabToolbarControl';
import RemoveTabToolbarControl from '../_shared/removeTabToolbarControl';

export default function Controls( { tabsClientId } ) {
	return (
		<BlockControls>
			<AddTabToolbarControl tabsClientId={ tabsClientId } />
			<RemoveTabToolbarControl tabsClientId={ tabsClientId } />
		</BlockControls>
	);
}
