<?php
/**
 * Plugin Name: [Choctaw Nation of Oklahoma] Site Blocks
 * Plugin URI: https://github.com/choctaw-nation/cno-plugin-cno-blocks
 * Description: The blocks for the CNO Site
 * Version: 2.1.0
 * Author: Choctaw Nation of Oklahoma
 * Author URI: https://www.choctawnation.com
 * Text Domain: cno
 * License: GPLv3 or later
 * License URI: https://www.gnu.org/licenses/gpl-3.0.html
 * Requires PHP: 8.4
 * Requires at least: 6.8.0
 * Tested up to: 7.0.0
 * Requires Plugins: advanced-custom-fields-pro
 *
 * @package ChoctawNation
 * @subpackage CNOBlocks
 */

use ChoctawNation\CNO_Blocks\Plugin_Loader;

if ( ! defined( 'ABSPATH' ) ) {
	die;
}

$autoloader = __DIR__ . '/vendor/autoload.php';

if ( ! file_exists( $autoloader ) ) {
	add_action(
		'admin_notices',
		static function () {
			echo '<div class="notice notice-error"><p>CNO Site Blocks Plugin is missing required dependencies. Please run Composer install or deploy the plugin with its vendor directory included.</p></div>';
		}
	);
	return;
}
require_once $autoloader;
$plugin_loader = new Plugin_Loader( plugin_dir_path( __FILE__ ), plugin_dir_url( __FILE__ ) );

register_activation_hook( __FILE__, array( $plugin_loader, 'activate' ) );
register_deactivation_hook( __FILE__, array( $plugin_loader, 'deactivate' ) );
add_action( 'plugins_loaded', array( $plugin_loader, 'load_plugin' ) );
