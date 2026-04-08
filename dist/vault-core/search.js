const CREDENTIAL_TYPES = ["aksk", "token", "password", "custom"];
export function searchEntries(entries, query) {
    const q = query.trim();
    if (!q)
        return [];
    // 1. Exact id
    const byId = entries.filter((e) => e.id === q);
    if (byId.length === 1)
        return byId;
    // 2. Exact name (case-insensitive)
    const byName = entries.filter((e) => e.name.toLowerCase() === q.toLowerCase());
    if (byName.length > 0)
        return byName;
    // 3. Type match
    const qLower = q.toLowerCase();
    if (CREDENTIAL_TYPES.includes(qLower)) {
        const byType = entries.filter((e) => e.type === qLower);
        if (byType.length > 0)
            return byType;
    }
    // 4. Tag intersection: split query into words, match against tags
    const words = q
        .toLowerCase()
        .split(/[\s,\-_/]+/)
        .filter(Boolean);
    const byTags = entries.filter((e) => {
        const entryTags = e.tags.map((t) => t.toLowerCase());
        return words.every((w) => entryTags.some((t) => t.includes(w)));
    });
    if (byTags.length > 0)
        return byTags;
    // 5. Name substring
    const bySub = entries.filter((e) => e.name.toLowerCase().includes(qLower));
    return bySub;
}
export function suggestTags(name) {
    return name
        .split(/[\s,\-_/]+/)
        .map((s) => s.toLowerCase())
        .filter((s) => s.length > 0);
}
export function findSimilarNames(entries, name, excludeId) {
    const normalized = name.toLowerCase().replace(/[\s\-_]+/g, "");
    return entries
        .filter((e) => e.id !== excludeId)
        .filter((e) => {
        const en = e.name.toLowerCase().replace(/[\s\-_]+/g, "");
        return en === normalized || en.startsWith(normalized) || normalized.startsWith(en);
    })
        .map((e) => e.name);
}
