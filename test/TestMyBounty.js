const should = require('chai').should()

async function assertRevert(promise) {
  try {
    await promise
  } catch (error) {
    error.message.should.include(
      'revert',
      `Expected "revert", got ${error} instead`
    )
    return
  }
  should.fail('Expected revert not received')
}

const MyBounty = artifacts.require('MyBounty')
contract('MyBounty', ([owner, poster, hunter]) => {
	let bountyFactory 
	const bountyOneTitle = "First Bounty - Title."
	const bountyOneDescription = "First Bounty - Description."
	const bountyOneAmount = 1 // Bounty reward amount

	const submissionOneText = "First Bounty - Submission One Text."
	const submissionTwoText = "First Bounty - Submission One Text."

	beforeEach(async () => {
		bountyFactory = await MyBounty.new()

	})

	// This test is to ensure a user can post a new bounty to the MyBounty dApp by verifyig the returned result.
	it('Poster should be able to create a bounty', async () => {
	    await bountyFactory.createBounty(bountyOneTitle, bountyOneDescription, bountyOneAmount, { from: poster, value: 1000 })
		let result = await bountyFactory.fetchBounty(1)
		result = result.map((item, i) => (i === 3) ? item.toNumber() : item).slice(1,4)
		assert.deepEqual(result, [bountyOneTitle, bountyOneDescription, bountyOneAmount], 'Bounty should be created with known details.')
	})

	// This test is to ensure a bounty hunter can post a submission to an existing bounty item by verifyig the returned result.
	it('Hunter should be able to submit a solution', async () => {
	    await bountyFactory.createBounty(bountyOneTitle, bountyOneDescription, bountyOneAmount, { from: poster, value: 1000 })
	    await bountyFactory.createSubmission(1, submissionOneText, { from: hunter })
		let result = await bountyFactory.fetchSubmission(1, 1)
		result = result.map((item, i) => (i === 0 || i === 1) ? item.toNumber() : item).slice(0,2)
		assert.deepEqual(result, [1, 1], 'Submission should be created with known details.')
	})

	// This test is to ensure a bounty poster can reject a submission to their bounty by verifyig the returned result.
	it('Poster should be able to reject a submission', async () => {
	    await bountyFactory.createBounty(bountyOneTitle, bountyOneDescription, bountyOneAmount, { from: poster, value: 1000 })
	    await bountyFactory.createSubmission(1, submissionOneText, { from: hunter })
	    let result = await bountyFactory.rejectSubmission(1, 1, { from: poster })
		const { bountyId, submissionId } = result.logs[0].args
		assert.isTrue(bountyId.toNumber() === 1 && submissionId.toNumber() === 1, 'Submission should be rejected by the bounty poster.')
	})

	// This test is to ensure a bounty poster can accept a submission to their bounty by verifyig the returned result.
	it('Poster should be able to accept a submission', async () => {
	    await bountyFactory.createBounty(bountyOneTitle, bountyOneDescription, bountyOneAmount, { from: poster, value: 1000 })
	    await bountyFactory.createSubmission(1, submissionOneText, { from: hunter })
	    let result = await bountyFactory.acceptSubmission(1, 1, { from: poster })
		const { bountyId, submissionId } = result.logs[0].args
		assert.isTrue(bountyId.toNumber() === 1 && submissionId.toNumber() === 1, 'Submission should be accepted by the bounty poster.')
	})

	// This test is to ensure only the MyBounty dApp owner (deployer) is able to enable the emergency stop/pause security feature.
	it('Contract owner should be able to emergency stop/pause contract execution', async () => {
	    let result = await bountyFactory.stopContract({ from: owner })
		const { isStopped } = result.logs[0].args
		assert.equal(isStopped, true, 'Contract should be paused using emergency stop feature.')
	})

	// This test is to ensure only the MyBounty dApp owner (deployer) is able to disable the emergency stop/pause security feature.
	it('Contract owner should be able to emergency stop/pause contract execution', async () => {
	    let result = await bountyFactory.resumeContract({ from: owner })
		const { isStopped } = result.logs[0].args
		assert.equal(isStopped, false, 'Contract should be unpaused using emergency stop feature.')
	})

})