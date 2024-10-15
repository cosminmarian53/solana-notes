#![allow(clippy::result_large_err)]

use anchor_lang::prelude::*;

declare_id!("AsjZ3kWAUSQRNt2pZVeJkywhZ6gpLpHZmJjduPmKZDZZ");

#[program]
pub mod notes {
    use super::*;

  pub fn close(_ctx: Context<CloseNotes>) -> Result<()> {
    Ok(())
  }

  pub fn decrement(ctx: Context<Update>) -> Result<()> {
    ctx.accounts.notes.count = ctx.accounts.notes.count.checked_sub(1).unwrap();
    Ok(())
  }

  pub fn increment(ctx: Context<Update>) -> Result<()> {
    ctx.accounts.notes.count = ctx.accounts.notes.count.checked_add(1).unwrap();
    Ok(())
  }

  pub fn initialize(_ctx: Context<InitializeNotes>) -> Result<()> {
    Ok(())
  }

  pub fn set(ctx: Context<Update>, value: u8) -> Result<()> {
    ctx.accounts.notes.count = value.clone();
    Ok(())
  }
}

#[derive(Accounts)]
pub struct InitializeNotes<'info> {
  #[account(mut)]
  pub payer: Signer<'info>,

  #[account(
  init,
  space = 8 + Notes::INIT_SPACE,
  payer = payer
  )]
  pub notes: Account<'info, Notes>,
  pub system_program: Program<'info, System>,
}
#[derive(Accounts)]
pub struct CloseNotes<'info> {
  #[account(mut)]
  pub payer: Signer<'info>,

  #[account(
  mut,
  close = payer, // close account and return lamports to payer
  )]
  pub notes: Account<'info, Notes>,
}

#[derive(Accounts)]
pub struct Update<'info> {
  #[account(mut)]
  pub notes: Account<'info, Notes>,
}

#[account]
#[derive(InitSpace)]
pub struct Notes {
  count: u8,
}
