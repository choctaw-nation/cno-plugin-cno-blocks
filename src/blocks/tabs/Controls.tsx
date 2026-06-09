/**
 * Internal dependencies
 */
import AddTabToolbarControl from '@shared/addTabToolbarControl';
import RemoveTabToolbarControl from '@shared/removeTabToolbarControl';

export default function Controls( { clientId } ) {
	return (
		<>
			<AddTabToolbarControl tabsClientId={ clientId } />
			<RemoveTabToolbarControl tabsClientId={ clientId } />
		</>
	);
}
