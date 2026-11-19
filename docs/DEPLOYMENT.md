# yeop.net deployment contract

## Branches

- Development: develop (quality checks only, **never production**)
- Production: main (its exact commit identifies each release)
- Legacy: master (left untouched and not used for deployments)
- Public origin: https://yeop.net
- MIR archive: https://mir.yeop.net (independent)

## Credential-isolated pipeline

The source repository seirian/seirian.github.io does not own the hosting
SFTP secret. The existing repository seirian/mir-cheongwoon-site owns the
server credential and a pinned SSH server key. A **separately scoped**
scheduled Actions workflow in that repository checks ONLY the portfolio
repository main branch for new commits, then uses its existing secret to
upload the six approved static files. No portfolio code is executed in
the privileged runner. Scheduled runs that see no change are no-ops.

The pipeline stages immutable releases at:
/web/_portfolio_releases/<main-commit-prefix>/

Only the # PORTFOLIO-ROOT-V1 block in /web/.htaccess is changed on
activation. The existing # MIR-SUBDOMAIN-BRIDGE-V1 preamble and every
unrelated rule are preserved verbatim. MIR is served from /web/_mir_site.

Preflight: verify pinned host identity, web root, routing markers, ownership
and current MIR health. Stage: upload only allowlisted static files and
verify byte-for-byte over SFTP and HTTP. Activate: atomically replace the
portfolio routing block. Verify: yeop.net and mir.yeop.net both succeed.
On verification failure: restore the previous routing block only.

IMPORTANT: No files are removed, overwritten or moved in MIR paths.
Shared root index files are not modified. The original root's
index.html / standard_index.html are preserved.

## Development

- npm run verify
- npm run build
- npm run dev

The quality workflow checks both develop and main. Only a new SHA from
the portfolio main branch is eligible for hosting deployment.

## Content policy

The source Notion page is linked as the full professional history.
The original Notion content could not be retrieved during initial
implementation. Do not invent employers, dates, skills claims or metrics.
