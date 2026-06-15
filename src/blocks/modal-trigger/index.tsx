import { registerBlockType } from '@wordpress/blocks';
import { RichText, useBlockProps } from '@wordpress/block-editor';
import { button } from '@wordpress/icons';
import metadata from './block.json';

import Edit from './Edit';
import './style.scss';
import { MODAL_STORE } from '@shared/consts';

registerBlockType( metadata.name, {
	icon: button,
	edit: Edit,
	save: ( {
		attributes: {
			closeWithBackdropClick,
			allowBodyScrollWhileOpen,
			modalTitle,
			buttonText,
			source,
		},
	} ) => (
		<RichText.Content
			{ ...useBlockProps.save() }
			tagName="button"
			type="button"
			data-wp-bind--disabled="state.isModalOpen"
			data-wp-interactive={ MODAL_STORE }
			data-wp-context={ JSON.stringify( {
				closeWithBackdropClick,
				allowBodyScrollWhileOpen,
				modalTitle,
				source,
			} ) }
			data-wp-on--click="actions.openModal"
			value={ buttonText || 'More Info' }
		/>
	),
} );
