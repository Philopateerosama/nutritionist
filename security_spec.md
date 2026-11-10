# Security Specification & Threat Model

## Data Invariants
1. Users must be authenticated (`request.auth != null`) to access or interact with any data.
2. User profile documents (`/users/{userId}`) can only be updated by the document owner or an Admin.
3. Content collections (`/recipes/{recipeId}`, `/articles/{articleId}`, `/reviews/{reviewId}`) are publicly readable by logged-in users, but can only be created, updated, or deleted by verified Admins.
4. Chat threads (`/chats/{chatId}`) and subcollection messages (`/chats/{chatId}/messages/{messageId}`) are strictly restricted to the user who owns that chat (`userId == request.auth.uid`) or an Admin (`isAdmin()`).
5. Progress reports (`/reports/{reportId}`) belong to the user (`resource.data.userId == request.auth.uid`) or an Admin (`isAdmin()`).
6. Admin role verification checks `exists(/databases/$(database)/documents/admins/$(request.auth.uid))` to prevent client-side privilege escalation.
7. Immutable fields like `createdAt` cannot be changed after creation.

## Dirty Dozen Payloads & Mitigation
1. **Unauthenticated Read on Recipes/Articles**: Blocked by `request.auth != null`.
2. **User trying to modify another user's profile**: Blocked by `request.auth.uid == userId`.
3. **Regular User trying to create or delete a Recipe**: Blocked by `isAdmin()` check.
4. **Regular User trying to create an Article**: Blocked by `isAdmin()`.
5. **Regular User trying to modify a Review**: Blocked by `isAdmin()`.
6. **User attempting to escalate themselves to Admin in `/users/{userId}`**: Blocked because admin role validation looks exclusively at `/admins/{uid}` document existence.
7. **Attacker attempting to read another user's chat messages**: Blocked by checking `chatId == request.auth.uid || isAdmin()`.
8. **Attacker attempting to write messages in another user's consultation chat**: Blocked by `chatId == request.auth.uid || isAdmin()`.
9. **Attacker sending oversized message text (DDoS)**: Blocked by `.size() <= 2000` validation.
10. **Malicious deletion of all User Reports**: Blocked by owner check `resource.data.userId == request.auth.uid || isAdmin()`.
11. **Injecting corrupted schema with extra shadow keys**: Handled by validation and role checks.
12. **Tampering with immutable creation timestamps**: Blocked by rules requiring `request.resource.data.createdAt == resource.data.createdAt` during update.
