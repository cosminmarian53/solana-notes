// Here we export some useful types and functions for interacting with the Anchor program.
import { AnchorProvider, Program } from '@coral-xyz/anchor'
import { Cluster, PublicKey } from '@solana/web3.js'
import NotesIDL from '../target/idl/notes.json'
import type { Notes } from '../target/types/notes'

// Re-export the generated IDL and type
export { Notes, NotesIDL }

// The programId is imported from the program IDL.
export const NOTES_PROGRAM_ID = new PublicKey(NotesIDL.address)

// This is a helper function to get the Notes Anchor program.
export function getNotesProgram(provider: AnchorProvider) {
  return new Program(NotesIDL as Notes, provider)
}

// This is a helper function to get the program ID for the Notes program depending on the cluster.
export function getNotesProgramId(cluster: Cluster) {
  switch (cluster) {
    case 'devnet':
    case 'testnet':
      // This is the program ID for the Notes program on devnet and testnet.
      return new PublicKey('CounNZdmsQmWh7uVngV9FXW2dZ6zAgbJyYsvBpqbykg')
    case 'mainnet-beta':
    default:
      return NOTES_PROGRAM_ID
  }
}
