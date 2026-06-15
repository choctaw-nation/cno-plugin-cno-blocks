import { subscribe, select, dispatch } from '@wordpress/data';
import { createBlock } from '@wordpress/blocks';
import { store as blockEditorStore } from '@wordpress/block-editor';
import domReady from '@wordpress/dom-ready';

const MODAL_TRIGGER = 'cno/modal-trigger';
const MODAL_BLOCK = 'cno/modal';

let isHandlingChange = false;
domReady( () => {
	subscribe( () => {
		if ( isHandlingChange ) {
			return;
		}

		const blocks = select( blockEditorStore ).getBlocks();
		const triggerBlock = findBlock( blocks, MODAL_TRIGGER );
		const modalBlock = findBlock( blocks, MODAL_BLOCK );
		if (
			( ! triggerBlock && ! modalBlock ) ||
			( triggerBlock && modalBlock )
		) {
			return;
		}

		try {
			isHandlingChange = true;
			if ( modalBlock && ! triggerBlock ) {
				// If the modal exists but there are no trigger blocks, remove the modal
				dispatch( blockEditorStore ).removeBlock( modalBlock );
				return;
			}
			dispatch( blockEditorStore ).insertBlock(
				createBlock( MODAL_BLOCK )
			);
		} catch ( err ) {
			// eslint-disable-next-line no-console
			console.error( err );
			return;
		} finally {
			isHandlingChange = false;
		}
	} );
} );

/**
 * Recursively search an array of block objects (and inner blocks) for a block of a given type
 *
 * @param blockList An array of block objects
 * @param blockType the name of the block to find
 * @return the clientId of the found block, or false if not found
 */
function findBlock( blockList: any[], blockType: string ): string | false {
	if ( ! blockList || blockList.length === 0 ) {
		return false;
	}
	for ( const block of blockList ) {
		if ( block.name === blockType ) {
			return block.clientId;
		}
		if ( block.innerBlocks?.length > 0 ) {
			const found = findBlock( block.innerBlocks, blockType );
			if ( found ) {
				return found;
			}
		}
	}
	return false;
}
