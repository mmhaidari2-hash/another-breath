# Cladak — owner access (reset)

Public product stays English-only. Your private doors:

| Door | URL | How |
|------|-----|-----|
| Persian UI | `/cofounder` | Code: `cladak-cofounder` (`COFOUNDER_ACCESS_CODE`) |
| Co-founder login | `/login` | `cofounder@cladak.com` / `CofounderPass123!` |
| Ops desk | `/ops` | Same cofounder login, or `ops@cladak.com` / `AdminPass123!` |
| Studio | `/studio` | After login |
| Seller demo | `/login` | `seller@cladak.com` / `SellerPass123!` |

Reset locally:

```bash
npx prisma db push
npx prisma db seed
```

Change production secrets in `.env` — never ship these default passwords live.
