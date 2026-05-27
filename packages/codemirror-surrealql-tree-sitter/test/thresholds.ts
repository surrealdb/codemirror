/** Ratcheting quality thresholds for the comparison suite. */
export const THRESHOLDS = {
	tier2: {
		meanKindJaccard: 0.35,
		meanSpanOverlap: 0.5,
		perFixtureMinJaccard: 0.15,
		regressionEpsilon: 0.05,
	},
	tier3: {
		/** classHighlighter overlap when lezer emits tags (bridge uses nodeSet styleTags in CM) */
		tagCategoryAgreement: 0,
	},
	tier4: {
		foldOverlap: 0.5,
	},
};
