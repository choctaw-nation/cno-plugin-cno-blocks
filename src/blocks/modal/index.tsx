import { registerBlockType } from '@wordpress/blocks';
import { navigationOverlay } from '@wordpress/icons';
import { InnerBlocks, useBlockProps } from '@wordpress/block-editor';

import metadata from './block.json';
import Edit from './Edit';
import './style.scss';
import { MODAL_STORE } from '@shared/consts';

registerBlockType( metadata.name, {
	icon: navigationOverlay,
	edit: Edit,
	save: () => {
		const blockProps = useBlockProps.save();
		return (
			<dialog
				{ ...blockProps }
				id="cno-modal"
				data-wp-interactive={ MODAL_STORE }
				data-wp-watch="callbacks.syncDialog"
				data-wp-on--click="callbacks.listenForBackdropClick"
			>
				<div className="wp-block-cno-modal__inner">
					<header className="wp-block-cno-modal__header">
						<h1
							className="wp-block-cno-modal__title fs-4"
							data-wp-text="state.modalTitle"
							id="modal-title"
						></h1>
						<button
							type="button"
							className="btn-close"
							data-wp-on--click="actions.closeModal"
						>
							<span className="visually-hidden">Close</span>
						</button>
					</header>
					<div className="wp-block-cno-modal__body">
						<div
							className="status"
							data-wp-text="state.statusMessage"
							data-wp-bind--hidden="!state.status"
						/>
						<div
							id="modal-content"
							data-wp-bind--hidden="state.status"
						>
							<InnerBlocks.Content />
						</div>
					</div>
				</div>
			</dialog>
		);
	},
} );
