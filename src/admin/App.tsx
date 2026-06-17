import { Button, Panel, TextControl } from '@wordpress/components';
import useSettings from './useSettings';

export function App() {
	const {
		settings,
		isLoading,
		isSaving,
		notice,
		setSettings,
		handleSubmit,
		setNotice,
	} = useSettings();
	return (
		<div className="wrap">
			<Panel header="Blocks Settings">
				<div style={ { padding: '1rem' } }>
					<TextControl
						__next40pxDefaultSize
						help="Used by Gravity Forms Renderer Block"
						label="Google reCAPTCHA Site Key"
						value={ settings?.siteKey || '' }
						onChange={ ( value ) => {
							setSettings( {
								...settings,
								siteKey: value,
							} );
						} }
					/>
					<Button
						style={ { marginTop: '1rem' } }
						variant="primary"
						onClick={ handleSubmit }
						isBusy={ isSaving || isLoading }
					>
						Save Settings
					</Button>
				</div>
			</Panel>
		</div>
	);
}
