import { store, getElement, getContext } from '@wordpress/interactivity';
import { MODAL_STORE } from '@shared/consts';
import { ModalState, TriggerContext } from '@shared/modal-store-types';

const initialState: ModalState = {
	isModalOpen: false,
	modal: null as HTMLDialogElement | null,
	modalTitle: '',
	status: null,
	source: 'innerblocks',
	allowBodyScrollWhileOpen: false,
};

const { state, actions } = store( MODAL_STORE, {
	state: initialState,
	actions: {
		/**
		 * Open the modal in state & with js
		 */
		openModal() {
			state.isModalOpen = true;
			const {
				allowBodyScrollWhileOpen,
				modalTitle,
				closeWithBackdropClick,
			} = getContext< TriggerContext >();
			state.allowBodyScrollWhileOpen = allowBodyScrollWhileOpen;
			state.closeWithBackdropClick = closeWithBackdropClick;
			if ( false === allowBodyScrollWhileOpen ) {
				document.body.style.overflow = 'hidden';
			}
			state.modalTitle = modalTitle;
			if ( 'cnhsa-guidelines' === state.source ) {
				// callbacks.fetchCNHSAGuidelines();
			}
		},

		/**
		 * Close the modal in state & with js
		 */
		closeModal() {
			state.isModalOpen = false;

			const { allowBodyScrollWhileOpen } = state;
			if ( false === allowBodyScrollWhileOpen ) {
				document.body.style.overflow = '';
			}
		},
	},
	callbacks: {
		listenForBackdropClick( event: MouseEvent ) {
			if (
				! state.closeWithBackdropClick ||
				! state.isModalOpen ||
				! state.modal
			) {
				return;
			}

			if ( event.target === state.modal ) {
				actions.closeModal();
			}
		},
		syncDialog() {
			if ( ! state.modal ) {
				const { ref } = getElement();
				if ( ref ) {
					state.modal = ref as HTMLDialogElement;
				} else {
					// eslint-disable-next-line no-console
					console.error( 'Modal element not found on init.' );
					return;
				}
			}
			if ( state.isModalOpen ) {
				state.modal.showModal();
			} else if ( ! state.isModalOpen && state.modal.open ) {
				state.modal.close();
			}
		},
		/**
		 * sync state to modal open attribute when modal is closed natively (e.g. with ESC key)
		 */
		onNativeClose() {
			state.isModalOpen = false;
			if ( false === state.allowBodyScrollWhileOpen ) {
				document.body.style.overflow = '';
			}
		},

		/**
		 * Show status message conditionally
		 */
		showStatusMessage(): boolean {
			return state.status !== null;
		},

		async fetchCNHSAGuidelines() {
			state.status = 'loading';
			state.statusMessage = 'Loading guidelines...';
			try {
				const html = await fetchCNHSAGuidelines();
				const modalContentDiv = state.modal?.querySelector(
					'#modal-content'
				) as HTMLDivElement;
				state.status = null;
				state.statusMessage = '';
				modalContentDiv.innerHTML = html;
			} catch ( error ) {
				state.status = 'error';
				state.statusMessage = 'Failed to load guidelines. ' + error;
			}
		},
	},
} );

/** Utils */

/**
 * Fetch CNHSA Guidelines content and set modal content
 * @return {Promise<string>} The HTML content of the guidelines
 */
async function fetchCNHSAGuidelines() {
	const storageKey = 'cnhsa-guidelines-html';
	const expiryKey = 'cnhsa-guidelines-html-expiry';
	const now = Date.now();
	const expiry = localStorage.getItem( expiryKey );
	const cachedHtml = localStorage.getItem( storageKey );

	if ( expiry && cachedHtml && now < Number( expiry ) ) {
		return cachedHtml;
	}
	try {
		const response = await fetch(
			'/wp-json/cno-interactivity/v1/cnhsa-guidelines'
		);
		if ( ! response.ok ) {
			throw new Error( 'Network response was not ok' );
		}
		const data = await response.json();
		localStorage.setItem( storageKey, data.html );
		// Cache for 1 day
		localStorage.setItem( expiryKey, ( now + 86400000 ).toString() );
		return data.html;
	} catch ( error ) {
		throw error;
	}
}
