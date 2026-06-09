<?php
/**
 * Tabs Handler
 *
 * @package ChoctawNation
 */

namespace ChoctawNation\CNO_Blocks;

/**
 * CNO_Tabs_Handler class.
 */
class CNO_Tabs_Handler {

	/**
	 * Filter to provide tabs list context to cno/tabs and cno/tab-list blocks.
	 * It is more performant to do this here, once, rather than in the tabs render and tabs context filters.
	 * In this way cno/tabs is both a provider and a consumer of the cno/tabs-list context.
	 *
	 * @since 7.0.0
	 *
	 * @param array $context      Default block context.
	 * @param array $parsed_block The block being rendered.
	 *
	 * @return array Modified context.
	 */
	public function block_cno_tabs_provide_context( array $context, array $parsed_block ): array {
		if ( 'cno/tabs' === $parsed_block['blockName'] ) {
			// Generate a unique ID for the tabs instance first, so it can be used
			// to derive stable tab IDs. Used for 3rd party extensibility to identify
			// the tabs instance.
			$tabs_id                  = $parsed_block['attrs']['anchor'] ?? wp_unique_id( 'tabs_' );
			$tabs_list                = $this->block_cno_tabs_generate_tabs_list( $parsed_block['innerBlocks'] ?? array(), $tabs_id );
			$context['cno/tabs-list'] = $tabs_list;
			$context['cno/tabs-id']   = $tabs_id;
		}

		return $context;
	}


	/**
	 * Extract tabs list from tab-panel innerblocks.
	 *
	 * @since 7.0.0
	 *
	 * @param array  $innerblocks Parsed inner blocks of tabs block.
	 * @param string $tabs_id     Unique ID for the tabs instance, used to generate tab IDs.
	 *
	 * @return array List of tabs with id, label, index.
	 */
	public function block_cno_tabs_generate_tabs_list( array $innerblocks = array(), string $tabs_id = '' ): array {
		$tabs_list = array();

		// Find tab-panel block
		foreach ( $innerblocks as $inner_block ) {
			if ( 'cno/tab-panels' === ( $inner_block['blockName'] ?? '' ) ) {
				$tab_index = 0;
				foreach ( $inner_block['innerBlocks'] ?? array() as $tab_block ) {
					if ( 'cno/tab-panel' === ( $tab_block['blockName'] ?? '' ) ) {
						$attrs     = $tab_block['attrs'] ?? array();
						$tab_label = $attrs['label'] ?? '';

						$tab_id = ! empty( $attrs['anchor'] )
						? $attrs['anchor']
						: ( ! empty( $tabs_id )
							? $tabs_id . '-tab-' . $tab_index
							: 'tab-' . $tab_index );

						$tabs_list[] = array(
							'id'    => esc_attr( $tab_id ),
							'label' => $tab_label,
							'index' => $tab_index,
						);
						++$tab_index;
					}
				}
				break;
			}
		}

		return $tabs_list;
	}
}