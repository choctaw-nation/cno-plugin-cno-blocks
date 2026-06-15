import { registerBlockType } from '@wordpress/blocks';
import { commentContent } from '@wordpress/icons';

import metadata from './block.json';
import Edit from './Edit';

registerBlockType( metadata.name, {
	icon: commentContent,
	edit: Edit,
	save: () => null,
} );
