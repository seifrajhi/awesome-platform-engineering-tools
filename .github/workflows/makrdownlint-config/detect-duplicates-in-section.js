module.exports = {
    "names": ["detect-duplicates-in-section"],
    "description": "Rule that reports duplicate links within the same section",
    "tags": ["links"],
    "function": function rule(params, onError) {
        let linksInSection = new Set();
        let currentHeading = null;

        params.tokens.forEach(token => {
            if (token.type === 'heading_open') {
                currentHeading = token.lineNumber;
                linksInSection.clear();
            } else if (token.type === 'inline' && currentHeading) {
                token.children.forEach(child => {
                    if (child.type === 'link_open') {
                        const href = child.attrGet('href');
                        const text = token.content;
                        const linkIdentifier = `${href}|${text}`;

                        if (linksInSection.has(linkIdentifier)) {
                            onError({
                                lineNumber: child.lineNumber,
                                detail: `Duplicate link '[${text}](${href})' found in this section (first occurrence at line ${currentHeading}).`
                            });
                        } else {
                            linksInSection.add(linkIdentifier);
                        }
                    }
                });
            }
        });
    }
};
