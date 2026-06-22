<?php
/**
 * Render callback for cno/tab.
 *
 * Injects the tab label and IAPI directives into the saved button HTML.
 * Per-item context (index, id, label) is provided by the parent tab-list
 * render callback before this is called.
 *
 * @var array     $attributes Block attributes.
 * @var string    $content    Block content (styled button from save.js).
 * @var \WP_Block $block      WP_Block instance.
 *
 * @package WordPress
 */

$current_post_id = get_the_ID();
$is_child        = wp_get_post_parent_id( $current_post_id ) > 0;
$parent          = $is_child ? get_post( wp_get_post_parent_id( $current_post_id ) ) : get_post( $current_post_id );

$has_children     = false;
$children         = array();
$children         = get_children(
	array(
		'post_parent' => $parent->ID,
		'post_status' => 'publish',
		'orderby'     => 'title',
		'order'       => 'ASC',
	)
);
$block_attributes = get_block_wrapper_attributes();
?>
<div <?php echo $block_attributes; ?>>
	<?php
	echo $is_child ? sprintf( '<a href="%s" class="parent-title"><i class="fa-solid fa-arrow-left"></i>%s</a>', get_permalink( $parent->ID ), get_the_title( $parent->ID ) ) : sprintf( '<p class="parent-title">%s</p>', $parent->post_title );
	echo '<hr/><ul>';
	foreach ( $children as $child ) {
		$is_active = $child->ID === $current_post_id;
		$markup    = sprintf( '<li%s><i class="fa-solid fa-chevron-right"></i>', $is_active ? ' class="active"' : '' );
		$markup   .= $is_active ? sprintf( '<strong>%s</strong>', $child->post_title ) : sprintf( '<a href="%s">%s</a>', get_permalink( $child->ID ), $child->post_title );
		$markup   .= '</li>';
		echo $markup;
	}
	echo '</ul>';
	?>
</div>