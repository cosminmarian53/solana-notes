#![allow(clippy::result_large_err)]

use anchor_lang::prelude::*;

declare_id!("AsjZ3kWAUSQRNt2pZVeJkywhZ6gpLpHZmJjduPmKZDZZ");

#[program]
pub mod notes {
    use super::*;

    pub fn create_note(ctx: Context<CreateNote>, title: String, content: String) -> Result<()> {
        let note = &mut ctx.accounts.note;
        note.owner = *ctx.accounts.owner.key;
        note.title = title;
        note.content = content;

        Ok(())
    }

    pub fn update_note(ctx: Context<UpdateNote>, _title: String, content: String) -> Result<()> {
        let note = &mut ctx.accounts.note;
        note.content = content;
        Ok(())
    }
    
    pub fn delete_note(_ctx: Context<DeleteNote>, _title: String) -> Result<()> {
        Ok(())
    }

}

// Define the Note struct--the data structure that will be stored on-chain.
// The `#[account]` attribute is used to define a Solana account.
// The `#[derive(InitSpace)]` attribute is used to derive the `InitSpace` trait.
#[account]
#[derive(InitSpace)]
pub struct Note {
    pub owner: Pubkey,

    #[max_len(64)]
    pub title: String,

    #[max_len(1024)]
    pub content: String,
}

// Define the CreateNote struct.
// The `#[derive(Accounts)]` attribute is used to derive the `Accounts` trait.
// The `Accounts` trait is used to define the accounts that are required to execute a program instruction.
#[derive(Accounts)]
#[instruction(title: String)]
pub struct CreateNote<'info> {
    #[account(
    init,
    seeds =[title.as_bytes(), owner.key().as_ref()],
    bump,
    space = 8 + Note::INIT_SPACE,
    payer = owner,
  )]
    pub note: Account<'info, Note>,

    #[account(mut)]
    pub owner: Signer<'info>,

    pub system_program: Program<'info, System>,
}

// Define the UpdateNote struct.
// The `#[derive(Accounts)]` attribute is used to derive the `Accounts` trait.
// The `Accounts` trait is used to define the accounts that are required to execute a program instruction.

#[derive(Accounts)]
#[instruction(title: String)]
pub struct UpdateNote<'info> {
    #[account(
      mut,
      seeds = [title.as_bytes(), owner.key().as_ref()],
      bump,
      realloc = 8 + Note::INIT_SPACE,
      realloc::payer = owner,
      realloc::zero = true,
    )]
    pub note: Account<'info, Note>,

    #[account(mut)]
    pub owner: Signer<'info>,

    pub system_program: Program<'info, System>,
}

// Define the DeleteNote struct.


#[derive(Accounts)]
#[instruction(title: String)]
pub struct DeleteNote<'info> {
    #[account(
      mut,
      seeds = [title.as_bytes(), owner.key().as_ref()],
      bump,
      close = owner,  
    )]
    pub note: Account<'info, Note>,

    #[account(mut)]
    pub owner: Signer<'info>,

    pub system_program: Program<'info, System>,
}