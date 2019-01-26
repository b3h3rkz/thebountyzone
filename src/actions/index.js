export function selectBounty(bountyItem) {
	// selectBook is an ActionCreator, it needs to return an action,
	// an opbject with a type property.

	console.log('A book has been selected:', bountyItem.title);

	return {
		type: 'BOUNTY_SELECTED',
		payload: bountyItem
	};

}