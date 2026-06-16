<?php
/**
 * Gravity Forms Renderer callback.
 *
 * @package ChoctawNation
 * @subpackage CNO_Interactivity_Blocks
 * @var array $attributes Block attributes.
 */

$form_id          = isset( $attributes['formId'] ) ? absint( $attributes['formId'] ) : 0;
$prefilled_values = array();

if ( isset( $attributes['prefilledValues'] ) && is_array( $attributes['prefilledValues'] ) ) {
	foreach ( $attributes['prefilledValues'] as $prefill_key => $prefill_value ) {
		if ( ! is_scalar( $prefill_value ) ) {
			continue;
		}

		$prefilled_values[ sanitize_key( (string) $prefill_key ) ] = sanitize_text_field( (string) $prefill_value );
	}
}

$context          = array(
	'formId'                  => $form_id,
	'form'                    => null,
	'prefilledValues'         => $prefilled_values,
	'values'                  => array(),
	'errors'                  => array(),
	'isLoading'               => true,
	'hasError'                => false,
	'errorMessage'            => '',
	'isSubmitted'             => false,
	'confirmationMessage'     => '',
	'closeOnSubmit'           => $attributes['closeOnSubmit'] ?? true,
	'resetOnClose'            => $attributes['resetOnClose'] ?? 'onlyAfterSuccessfulSubmit',
	'resetTimer'              => absint( $attributes['resetTimer'] ) ?? 5,
	'closeModalOnSubmitDelay' => absint( $attributes['closeModalOnSubmitDelay'] ) ?? 5,
);
$block_attributes = get_block_wrapper_attributes(
	array(
		'data-wp-context'     => wp_json_encode( $context ),
		'data-wp-interactive' => 'cno/gravity-form-renderer',
		'data-wp-watch'       => 'callbacks.loadForm',
	)
);
?>

<div <?php echo $block_attributes; ?>>
	<div data-wp-bind--hidden="state.hideLoadingState" aria-live="polite">
		Loading form…
	</div>

	<div class="alert alert-danger" role="alert" data-wp-bind--hidden="state.hideErrorMessage" data-wp-text="context.errorMessage"></div>

	<div class="alert alert-success" role="status" data-wp-bind--hidden="!context.isSubmitted" data-wp-text="context.confirmationMessage"></div>

	<form data-wp-bind--hidden="state.formIsHidden" data-wp-on--submit="actions.submitForm" novalidate>
		<h2 data-wp-text="context.form.title"></h2>
		<template data-wp-each--field="context.form.fields" data-wp-each-key="context.field.id">
			<?php require __DIR__ . '/_partials/field-router.php'; ?>
		</template>

		<button type="submit" class="wp-block-button wp-element-button" style="display:block;" data-wp-text="context.form.button.text" data-wp-bind--disabled="state.isLoading">
			Submit
		</button>
	</form>
	<p id="recaptcha-notice">This site is protected by reCAPTCHA and the Google
		<a href="https://policies.google.com/privacy">Privacy Policy</a> and
		<a href="https://policies.google.com/terms">Terms of Service</a> apply.
	</p>
</div>
