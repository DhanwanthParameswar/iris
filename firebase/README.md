# Firebase security rules

Deploy these after merging the Auth0 → Firebase Auth bridge:

```bash
firebase deploy --only firestore:rules,storage
```

Or paste the contents of `firestore.rules` and `storage.rules` into the Firebase Console (Firestore → Rules, Storage → Rules).

Rules expect `request.auth.uid` to match the Auth0 `sub` (e.g. `auth0|6990dce26645b4eb578475c2`), which the Cloudflare Worker sets when minting custom tokens.
