<?php
/**
 * Gravity Forms reCAPTCHA Helper
 *
 * @package ChoctawNation
 */

namespace ChoctawNation\CNO_Blocks\Jobs;

use ChoctawNation\CNO_Blocks\WP\Plugin_Settings;
use Gravity_Forms\Gravity_Forms_RECAPTCHA\GF_Field_RECAPTCHA;

/**
 * Helper class for retrieving reCAPTCHA configuration from Gravity Forms settings and providing it in a format suitable for use in the CNO Blocks.
 */
class GF_Recaptcha_Helper {
	/**
	 * Instance of the GF_Field_RECAPTCHA class, if available.
	 *
	 * @var GF_Field_RECAPTCHA|null $gf_recaptcha
	 */
	private ?GF_Field_RECAPTCHA $gf_recaptcha = null;

	/**
	 * Option name for storing the reCAPTCHA site key in WordPress options table.
	 */
	public const SITE_KEY_OPTION_NAME = 'cno_recaptcha_site_key';

	/**
	 * Constructor initializes the GF_Field_RECAPTCHA instance if the class exists.
	 */
	public function __construct() {
		if ( class_exists( GF_Field_RECAPTCHA::class ) ) {
			$this->gf_recaptcha = new GF_Field_RECAPTCHA();
		}
	}

	/**
	 * Retrieves the reCAPTCHA site key, either from the custom option or from the Gravity Forms settings.
	 * Caches the site key in a custom option for faster retrieval on subsequent calls.
	 */
	public function get_site_key(): ?string {
		try {
			return $this->lookup_site_key();
		} catch ( \Exception $e ) {
			error_log( 'Error retrieving reCAPTCHA site key: ' . $e->getMessage() ); // phpcs:ignore WordPress.PHP.DevelopmentFunctions.error_log_error_log
			return null;
		}
	}

	/**
	 * Retrieves the reCAPTCHA site key from the Gravity Forms settings or from a custom option.
	 */
	private function lookup_site_key(): ?string {
		$site_key = get_option( Plugin_Settings::OPTION_KEY )['siteKey'] ?? null;
		if ( $site_key ) {
			return $site_key;
		}
		if ( ! $this->gf_recaptcha ) {
			return null;
		}
		$gf_options_key          = 'gravityformsaddon_gravityformsrecaptcha_settings';
		$gf_options_site_key_key = 'site_key_v3';
		$gf_options              = get_option( $gf_options_key, array() );
		if ( isset( $gf_options[ $gf_options_site_key_key ] ) && ! empty( $gf_options[ $gf_options_site_key_key ] ) ) {
			update_option( self::SITE_KEY_OPTION_NAME, $gf_options[ $gf_options_site_key_key ] );
		}
		return $gf_options[ $gf_options_site_key_key ] ?? null;
	}

	/**
	 * Retrieves the reCAPTCHA field configuration for a given form ID, if the GF_Field_RECAPTCHA class is available and a site key is configured.
	 *
	 * @param int $form_id The ID of the Gravity Form for which to retrieve the reCAPTCHA field configuration.
	 * @return array|null An associative array containing the reCAPTCHA field configuration (input name, site key, and action) or null if the GF_Field_RECAPTCHA class is not available or if the site key is not configured.
	 */
	public function get_recaptcha_field_for_form( int $form_id ): ?array {
		if ( ! $this->gf_recaptcha ) {
			return null;
		}
		$site_key = $this->get_site_key();
		if ( ! $site_key ) {
			return null;
		}
		return array(
			'inputName' => $this->gf_recaptcha->get_input_name( $form_id ),
			'siteKey'   => $site_key,
			'action'    => 'submit',
		);
	}
}