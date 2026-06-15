<?php
/**
 * Gravity Forms Renderer callback.
 *
 * @package ChoctawNation
 * @subpackage CNO_Interactivity_Blocks
 * @var array $attributes Block attributes.
 */

$form_id = isset( $attributes['formId'] ) ? absint( $attributes['formId'] ) : 0;

$context = array(
	'formId'              => $form_id,
	'form'                => null,
	'values'              => array(),
	'errors'              => array(),
	'isLoading'           => true,
	'hasError'            => false,
	'errorMessage'        => '',
	'isSubmitted'         => false,
	'confirmationMessage' => '',
);
?>

<div <?php echo wp_interactivity_data_wp_context( $context ); ?> data-wp-interactive="cno/gravity-form-renderer" class="cno-gravity-form-renderer" data-wp-watch="callbacks.loadForm">
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

		<button type="submit" class="wp-block-button wp-element-button" style="display:block;" data-wp-text="context.form.button.text">
			Submit
		</button>
	</form>
</div>