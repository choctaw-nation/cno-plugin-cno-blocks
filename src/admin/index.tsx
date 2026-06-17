import { createRoot } from '@wordpress/element';
import { App } from './App';

declare global {
	interface Window {
		cnoSiteBlocksAdminData: {
			nonce: string;
			restRoot: string;
			settings: [];
		};
	}
}

const mount = document.getElementById( 'cno-site-blocks-admin' );
if ( mount ) {
	createRoot( mount ).render( <App /> );
}
