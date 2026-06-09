/**
 * WordPress dependencies
 */
import { tab as icon } from '@wordpress/icons';
import { registerBlockType } from '@wordpress/blocks';
import { useBlockProps } from '@wordpress/block-editor';

/**
 * Internal dependencies
 */

import Edit from './Edit';
import './style.scss';
import metadata from './block.json';

const { name } = metadata;

export { metadata, name };

registerBlockType( name, {
	icon,
	edit: Edit,
	save: () => {
		const blockProps = useBlockProps.save( {
			type: 'button',
			role: 'tab',
		} );

		return <button { ...blockProps } />;
	},
} );
