/**
 * WordPress dependencies
 */
import { calendar as icon } from '@wordpress/icons';
import { registerBlockType } from '@wordpress/blocks';

/**
 * Internal dependencies
 */
import Edit from './Edit';
import metadata from './block.json';
import './style.scss';

registerBlockType( metadata.name, {
	icon,
	edit: Edit,
	save: () => null,
} );
