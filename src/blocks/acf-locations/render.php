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

$service_locations = get_field( 'service_location' );
if ( empty( $service_locations['location'] ) ) {
	return;
}
$service_locations  = wp_list_pluck( $service_locations['location'], 'ID' );
$locations          = get_posts(
	array(
		'post_type'              => 'locations',
		'post__in'               => $service_locations,
		'orderby'                => 'post__in',
		'posts_per_page'         => count( $service_locations ),
		'no_found_rows'          => true,
		'update_post_meta_cache' => true,
		'update_post_term_cache' => false,
	)
);
	$locations_data = array();

foreach ( $locations as $location ) {
	$fields     = get_fields( $location->ID ) ?: array(); // phpcs:ignore Universal.Operators.DisallowShortTernary.Found
	$is_choctaw = 'choctaw' === ( $fields['choctaw_or_external_location'] ?? '' );
	$image_id   = $is_choctaw ? (int) ( $fields['photo'] ?? 0 ) : 0;

	$locations_data[] = array(
		'id'             => $location->ID,
		'title'          => get_the_title( $location ),
		'address'        => trim(
			sprintf(
				'%s<br/>%s',
				$fields['address'] ?? '',
				$fields['city_state_zip'] ?? ''
			)
		),
		'directionsLink' => $fields['directions_link'] ?? '',
		'image'          => $image_id ? wp_get_attachment_image_url( $image_id, 'full' ) : null,
		'phoneNumber'    => $fields['phone_number'] ?? '',
	);
}
$block_attributes = get_block_wrapper_attributes();
?>
<ul <?php echo $block_attributes; ?>>
	<?php
	foreach ( $locations_data as $location ) {
		$markup  = '<li class="location-card">';
		$markup .= wp_get_attachment_image( $location['image'], 'full', false, array( 'loading' => 'lazy' ) );
		$markup .= '<div class="location-card__body">';
		$markup .= sprintf( '<h3 class="location-title">%s</h3>', $location['title'] );
		$markup .= sprintf( '<p>%s<br/>%s</p>', $location['address'], $location['city_state_zip'] );
		$markup .= sprintf( '<a href="%s" class="directions-button">Get Directions</a>', $location['directionsLink'] );
		$markup .= sprintf( '<a href="tel:%s" class="call-button">Contact</a>', $location['phoneNumber'] );
		$markup .= '</div>';
		$markup .= '</li>';
		echo $markup;
	}
	?>
</ul>