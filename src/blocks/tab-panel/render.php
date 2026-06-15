<?php
/**
 * Tab Panel Block Render Callback
 *
 * @var array     $attributes Block attributes.
 * @var string    $content    Block content.
 * @var \WP_Block $block      Block instance.
 * @package ChoctawNation
 */

$tabs_id = $block->context['cno/tabs-id'] ?? '';

$tag_processor = new WP_HTML_Tag_Processor( $content );
$tag_processor->next_tag( array( 'class_name' => 'wp-block-cno-tab-panel' ) );

$tag_processor->set_attribute(
	'data-tabs-id',
	$tabs_id,
);

echo (string) $tag_processor->get_updated_html();
