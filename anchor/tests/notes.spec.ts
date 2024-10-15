import * as anchor from '@coral-xyz/anchor'
import {Program} from '@coral-xyz/anchor'
import {Keypair} from '@solana/web3.js'
import {Notes} from '../target/types/notes'

describe('notes', () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env()
  anchor.setProvider(provider)
  const payer = provider.wallet as anchor.Wallet

  const program = anchor.workspace.Notes as Program<Notes>

  const notesKeypair = Keypair.generate()

  it('Initialize Notes', async () => {
    await program.methods
      .initialize()
      .accounts({
        notes: notesKeypair.publicKey,
        payer: payer.publicKey,
      })
      .signers([notesKeypair])
      .rpc()

    const currentCount = await program.account.notes.fetch(notesKeypair.publicKey)

    expect(currentCount.count).toEqual(0)
  })

  it('Increment Notes', async () => {
    await program.methods.increment().accounts({ notes: notesKeypair.publicKey }).rpc()

    const currentCount = await program.account.notes.fetch(notesKeypair.publicKey)

    expect(currentCount.count).toEqual(1)
  })

  it('Increment Notes Again', async () => {
    await program.methods.increment().accounts({ notes: notesKeypair.publicKey }).rpc()

    const currentCount = await program.account.notes.fetch(notesKeypair.publicKey)

    expect(currentCount.count).toEqual(2)
  })

  it('Decrement Notes', async () => {
    await program.methods.decrement().accounts({ notes: notesKeypair.publicKey }).rpc()

    const currentCount = await program.account.notes.fetch(notesKeypair.publicKey)

    expect(currentCount.count).toEqual(1)
  })

  it('Set notes value', async () => {
    await program.methods.set(42).accounts({ notes: notesKeypair.publicKey }).rpc()

    const currentCount = await program.account.notes.fetch(notesKeypair.publicKey)

    expect(currentCount.count).toEqual(42)
  })

  it('Set close the notes account', async () => {
    await program.methods
      .close()
      .accounts({
        payer: payer.publicKey,
        notes: notesKeypair.publicKey,
      })
      .rpc()

    // The account should no longer exist, returning null.
    const userAccount = await program.account.notes.fetchNullable(notesKeypair.publicKey)
    expect(userAccount).toBeNull()
  })
})
