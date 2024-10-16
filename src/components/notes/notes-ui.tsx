"use client";
import React, { useMemo, useState } from "react";
import { Keypair, PublicKey } from "@solana/web3.js";
import { ellipsify } from "../ui/ui-layout";
import { ExplorerLink } from "../cluster/cluster-ui";
import { useNotesProgram, useNotesProgramAccount } from "./notes-data-access";
import { useWallet } from "@solana/wallet-adapter-react";
import { create } from "domain";

export function NotesCreate() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const { createNote } = useNotesProgram();
  const { publicKey } = useWallet();

  const isFormValid = title.trim() !== " " && content.trim() !== " ";
  const handleSubmit = async () => {
    if (publicKey && isFormValid) {
      createNote.mutateAsync({ title, content, owner: publicKey });
    }
  };
  if (!publicKey) {
    return (
      <div className="alert alert-warning">
        <span>You must connect your wallet in order to create a note!😠</span>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="card-body">
        <input
          type="text"
          className="input input-bordered w-full max-w-xs"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          className="textarea textarea-bordered w-full max-w-xs"
          placeholder="Content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <button
          className="btn btn-primary"
          onClick={handleSubmit}
          disabled={createNote.isPending || !isFormValid}
        >
          Create a note
        </button>
      </div>
    </div>
  );
}

export function NotesList() {
  const { accounts, getProgramAccount } = useNotesProgram();

  if (getProgramAccount.isLoading) {
    return <span className="loading loading-spinner loading-lg"></span>;
  }
  if (!getProgramAccount.data?.value) {
    return (
      <div className="alert alert-info flex justify-center">
        <span>
          Program account not found. Make sure you have deployed the program and
          are on the correct cluster.
        </span>
      </div>
    );
  }
  return (
    <div className={"space-y-6"}>
      {accounts.isLoading ? (
        <span className="loading loading-spinner loading-lg"></span>
      ) : accounts.data?.length ? (
        <div className="grid md:grid-cols-2 gap-4">
          {accounts.data?.map((account) => (
            <NotesCard
              key={account.publicKey.toString()}
              account={account.publicKey}
            />
          ))}
        </div>
      ) : (
        <div className="text-center">
          <h2 className={"text-2xl"}>No accounts</h2>
          No accounts found. Create one above to get started.
        </div>
      )}
    </div>
  );
}

function NotesCard({ account }: { account: PublicKey }) {
  const { accountQuery, updateNote, deleteNote } = useNotesProgramAccount({
    account,
  });
  const { publicKey } = useWallet();

  const [content, setContent] = useState("");
  const title = accountQuery.data?.title;
  const isFormValid = content.trim() !== " ";

  const handleSubmit = async () => {
    if (publicKey && isFormValid && title) {
      updateNote.mutateAsync({ title, content, owner: publicKey });
    }
  };
  if (!publicKey) {
    return (
      <div className="alert alert-warning">
        <span>You must connect your wallet in order to create a note!😠</span>
      </div>
    );
  }
  return accountQuery.isLoading ? (
    <span className="loading loading-spinner loading-lg"></span>
  ) : (
    <div className="card card-border border-base-300 border-4 text-neutral-content">
      <div className="card-body items-center text-center">
        <div className="space-y-6"></div>
        <h2
          className="card-title justify-center text-center text-3xl cursor-pointer"
          onClick={() => {
            accountQuery.refetch();
          }}
        >
          {accountQuery.data?.title}
        </h2>
        <p>{accountQuery.data?.content}</p>
        <textarea
          className="textarea textarea-bordered w-full max-w-xs"
          placeholder="Content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <div className="space-x-2">
          <button
            className="btn btn-primary"
            onClick={handleSubmit}
            disabled={updateNote.isPending || !isFormValid}
          >
            Update the note
          </button>
          <button
            className="btn btn-error"
            onClick={() => {
              const title = accountQuery.data?.title;
              if (title) {
                deleteNote.mutateAsync(title);
              }
            }}
            disabled={deleteNote.isPending}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
