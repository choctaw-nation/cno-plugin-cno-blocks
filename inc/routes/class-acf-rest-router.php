<?php
/**
 * ACF REST Router for ACF-Locations block
 *
 * @package ChoctawNation
 */

namespace ChoctawNation\CNO_Blocks\Routes;

use DateTime;
use WP_Error;
use WP_REST_Controller;
use WP_REST_Request;
use WP_REST_Response;
use WP_REST_Server;

/**
 * Handles REST API routes for ACF-related functionality, specifically for the ACF-Locations block.
 */
class ACF_Rest_Router extends WP_REST_Controller {
	/**
	 * Registers the routes for the REST API
	 *
	 * @return void
	 */
	public function register_routes(): void {
		$namespace = 'cno-acf/v1';

		register_rest_route(
			$namespace,
			'/services/(?P<id>\d+)/locations',
			array(
				'methods'             => WP_REST_Server::READABLE,
				'callback'            => array( $this, 'get_locations' ),
				'permission_callback' => '__return_true',
				'args'                => array(
					'id' => array(
						'validate_callback' => function ( $param ) {
							return is_numeric( $param );
						},
						'sanitize_callback' => 'absint',
						'required'          => true,
					),
				),
			)
		);
		register_rest_route(
			$namespace,
			'/services/(?P<id>\d+)/events',
			array(
				'methods'             => WP_REST_Server::READABLE,
				'callback'            => array( $this, 'get_events' ),
				'permission_callback' => '__return_true',
				'args'                => array(
					'id' => array(
						'validate_callback' => function ( $param ) {
							return is_numeric( $param );
						},
						'sanitize_callback' => 'absint',
						'required'          => true,
					),
				),
			)
		);
	}

	/**
	 * Gets locations for a given service post ID
	 *
	 * @param WP_REST_Request $request The REST request object containing parameters
	 * @return WP_REST_Response|WP_Error The REST response containing location data or an error
	 */
	public function get_locations( WP_REST_Request $request ): WP_REST_Response|WP_Error {
		$id        = $request->get_param( 'id' );
		$post_type = get_post_type( $id );
		if ( 'services' !== $post_type ) {
			return new WP_Error( 'invalid_post_type', 'Invalid post type. Expected "services".', array( 'status' => 400 ) );
		}
		$location       = get_field( 'service_location', $id );
		$location_ids   = isset( $location['location'] ) ? wp_list_pluck( $location['location'], 'ID' ) : array();
		$locations_data = $this->get_locations_data(
			wp_parse_id_list( $location_ids )
		);
		return rest_ensure_response( $locations_data );
	}

	/**
	 * Gets events for a given service post ID
	 *
	 * @param WP_REST_Request $request The REST request object containing parameters
	 * @return WP_REST_Response|WP_Error The REST response containing event data or an error
	 */
	public function get_events( WP_REST_Request $request ): WP_REST_Response|WP_Error {
		$id        = $request->get_param( 'id' );
		$post_type = get_post_type( $id );
		if ( 'services' !== $post_type ) {
			return new WP_Error( 'invalid_post_type', 'Invalid post type. Expected "services".', array( 'status' => 400 ) );
		}
		$events      = get_field( 'related_events', $id );
		$events_data = $this->get_events_data( $events );
		return rest_ensure_response( $events_data );
	}

	/**
	 * Gets event data for an array of event IDs
	 *
	 * @param int[] $event_ids Array of event post IDs
	 * @return array<int, array{
	 *     id: int,
	 *     title: string,
	 *     permalink: string,
	 *     isVirtual: bool,
	 *     prettyStartDate: string,
	 *     startDate: string
	 * }> Array of event data
	 */
	public function get_events_data( array $event_ids ): array {
		$timezone    = wp_timezone();
		$events_data = array_map(
			function ( $event ) use ( $timezone ) {
				$is_published = 'publish' === get_post_status( $event );
				if ( ! $is_published ) {
					return null; // Skip unpublished events
				}
				$is_virtual_event = get_post_meta( $event, 'virtual_event', true ) === '1';
				$start_date       = get_post_meta( $event, 'start_date', true );
				if ( ! $start_date ) {
					return null; // Skip events without a start date
				}
				$js_start_date = DateTime::createFromFormat( 'Ymd', $start_date, $timezone );
				return array(
					'id'              => $event,
					'title'           => get_the_title( $event ),
					'permalink'       => get_permalink( $event ),
					'isVirtual'       => $is_virtual_event,
					'prettyStartDate' => $js_start_date ? $js_start_date->format( 'Y-m-d' ) : $start_date,
					'startDate'       => $js_start_date ? $js_start_date->format( DATE_ATOM ) : $start_date,
				);
			},
			$event_ids
		);
		usort(
			$events_data,
			function ( $a, $b ) {
				return strtotime( $a['startDate'] ) <=> strtotime( $b['startDate'] );
			}
		);
		return $events_data;
	}

	/**
	 * Gets location data for an array of location IDs
	 *
	 * @param int[] $location_ids Array of location post IDs
	 * @return array<int, array{
	 *     id: int,
	 *     title: string,
	 *     address: string,
	 *     directionsLink: string,
	 *     image: string|null,
	 *     phoneNumber: string
	 * }> Array of location data
	 */
	private function get_locations_data( array $location_ids ): array {
		if ( empty( $location_ids ) ) {
			return array();
		}

		$locations      = get_posts(
			array(
				'post_type'              => 'locations',
				'post__in'               => $location_ids,
				'orderby'                => 'post__in',
				'posts_per_page'         => count( $location_ids ),
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
		return $locations_data;
	}
}