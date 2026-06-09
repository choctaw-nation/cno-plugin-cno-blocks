/**
 * WordPress dependencies
 */
import { tabPanel as icon } from '@wordpress/icons';

/**
 * Internal dependencies
 */
import initBlock from '@shared/init-block';
import Edit from './Edit';
import Save from './Save';
import metadata from './block.json';

const { name } = metadata;

export { metadata, name };

export const settings = {
	icon,
	edit: Edit,
	save: Save,
};

export const init = () => initBlock( { name, metadata, settings } );
