# Common wiki and module read contract

WorkflowX specifies this contract; agentX supplies one reader/index and JanusX uses it for blueprint, wiki and engineering Chat. No second view-specific scanner or authored index is required. A local cache is derived and disposable.

Queries return full URI, title, kind, lifecycle, moduleState when applicable, module/parent ownership, selected checkout, source path, raw-file SHA-256, bounded excerpt, relation metadata and diagnostics. Report searched checkouts, result limits and incomplete coverage. Body reads return bytes/text and hash from the same snapshot.

Required capabilities: module navigation, metadata/body/code-reference search, typed outgoing relations, Markdown references and backlinks. Read entry and necessary parent context first, expand linked detail as required. Missing tooling falls back to bounded host search and originals, with explicit coverage; the desktop is not required.

Preserve parent/depends-on/implements/governed-by/derived-from/supersedes/related-to directions and metadata. Module ownership is not a runtime dependency. Derive reverse edges. Recognize inline/reference Markdown links, autolinks and anchors; ignore fenced/indented/inline code, titles and bare URI mentions. Link resolution never manufactures dependencies.

Index changes track writes, renames, deletion, conversion, profile and checkout changes. Resolve IDs only within explicit selected checkouts; ambiguous IDs/checkout selection never select a winner. Missing source, unavailable checkout, stale snapshot, legacy/unsupported schema and invalid data are distinct diagnostics. Do not infer deletion from incomplete coverage.

Engineering wiki opens originals. Knowledge pages may keep host-owned sourceNoteRefs for exact raw bytes they used. Refreshing a cache or reading new content never updates a page's saved provenance; review all affected content first. Conflicting hashes remain visible. Source freshness, module state and execution validity remain independent.

Blueprint's initial structure contains only module entries, including planning states. Single-click expands, double-click enters detail, and return restores navigation context. Exact visual presentation is JanusX work; no runtime completion is claimed by this specification.
