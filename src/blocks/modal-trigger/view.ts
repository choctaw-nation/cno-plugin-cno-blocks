import { MODAL_STORE } from '@shared/consts';
import { store, getContext, withScope } from '@wordpress/interactivity';

export type LocalContext = {
	modalTitle: string;
	closeWithBackdropClick: boolean;
	allowBodyScrollWhileOpen: boolean;
	source: 'gform' | 'cnhsa-guidelines' | 'innerblocks';
	gformId?: number;
};
// Hook into Modal store
const { actions, state } = store( MODAL_STORE, {
	actions: {
		/**
		 * Open the modal in state & with js
		 */
		openModal() {
			state.isModalOpen = true;
			const context = getContext< LocalContext >();
			state.modalTitle = context.modalTitle;
			if ( 'cnhsa-guidelines' === state.source ) {
				// callbacks.fetchCNHSAGuidelines();
			}
		},

		/**
		 * Close the modal in state & with js
		 */
		closeModal() {
			state.isModalOpen = false;
		},
	},
	callbacks: {
		syncDialog() {
			if ( ! state.modal ) {
				// eslint-disable-next-line no-console
				console.error( 'no modal in state!' );
				return;
			}
			if ( state.isModalOpen ) {
				state.modal.showModal();
			} else if ( ! state.isModalOpen && state.modal.open ) {
				state.modal.close();
			}
		},
		/**
		 * Configure modal settings from trigger's context
		 */
		configModalSettings() {
			const context = getContext< LocalContext >();
			const {
				modalTitle,
				allowBodyScrollWhileOpen,
				closeWithBackdropClick,
				source,
			} = context;
			state.modalTitle = modalTitle || '';
			if ( false === allowBodyScrollWhileOpen ) {
				document.body.style.overflow = state.isModalOpen
					? 'hidden'
					: '';
			}
			state.source = source;
			if ( state.modal && closeWithBackdropClick ) {
				state.modal.addEventListener(
					'click',
					withScope( ( event ) => {
						if (
							state.modal &&
							state.modal.open &&
							state.modal === event.target
						) {
							actions.closeModal();
						}
					} )
				);
			}
		},
	},
} );
