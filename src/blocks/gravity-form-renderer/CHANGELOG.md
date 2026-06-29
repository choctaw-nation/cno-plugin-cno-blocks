# Gravity Forms Renderer Block Changelog

[View the readme](/src/blocks/gravity-form-renderer/README.md)

## v1.2.4 - [June 29, 2026]

- Fixed: Form no longer fetches when the it's not being rendered (e.g. the modal state's `source` is not `innerblocks`)

## v1.2.3 - [June 22, 2026]

-   Fixed: Name field wraps on mobile

## v1.2.2 - [June 19, 2026]

-   Fixed: reCAPTCHA text visibility is handled correctly

## v1.2.1 - [June 16, 2026]

-   Fixed: Properly handling recpatcha v3

## v1.2.0 - [June 16, 2026]

-   Added: Block has extra attributes to control modal behavior
-   Added: Recaptcha notice is included by default
-   Updated: Error handling and validation is handled
-   Updated: Block is only allowed once per page
-   Updated: Pre-Filled values text is now a `<Tip>`

## v1.1.1 - [June 16, 2026]

-   Added: Form clears/resets after 5 seconds
-   Fixed: Added `isSubmitting` state to form + styles
-   Fixed: Properly added block attributes to the container

## v1.1.0

-   Added: Block supports pre-filled values
-   Added: Block uses confirmation settings set in Gravity Forms

## v1.0.0

-   Init!
