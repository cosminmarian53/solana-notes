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

  it("Initialize Notes", async () => {});

})
