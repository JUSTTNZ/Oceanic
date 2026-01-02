# Task: Implement Email Delays and Fast Confirmations

## Completed Tasks
- [x] Delay user confirmation email in support by 5 minutes
- [x] Verified that transaction confirmation emails are sent fast (synchronously)

## Summary of Changes
- Modified `backend/src/controllers/support.controller.ts` to delay the user confirmation email by 5 minutes using setTimeout.
- Transaction confirmation emails are already implemented to send immediately upon admin confirmation.

## Testing
- Test support form submission to ensure confirmation email is delayed by 5 minutes.
- Test admin transaction confirmation to ensure email is sent immediately.
